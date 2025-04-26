import { model, type modelID } from "@/ai/providers";
import { streamText, type UIMessage } from "ai";
import { ReasoningLevel } from "@/components/reasoning-selector";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const REASONING_LEVEL_MAP = {
  low: 15000,
  high: 24576,
};

export async function POST(req: Request) {
  const {
    messages,
    selectedModel,
    reasoningLevel,
  }: {
    messages: UIMessage[];
    selectedModel: modelID;
    reasoningLevel: ReasoningLevel;
  } = await req.json();
  try {
    const result = streamText({
      model: model.languageModel(selectedModel),
      messages,
      providerOptions: {
        google: {
          thinkingConfig:
            selectedModel === "gemini-2.5-thinking" ||
            selectedModel === "gemini-2.5-flash-search-thinking"
              ? {
                  thinkingBudget: REASONING_LEVEL_MAP[reasoningLevel],
                }
              : {
                  thinkingBudget: 0,
                },
        },
      },
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
      sendUsage: true,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
