import { model, type modelID } from "@/ai/providers";
import { streamText, type UIMessage } from "ai";
import { ReasoningLevel } from "@/components/reasoning-selector";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

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
    search,
    reasoningLevel,
  }: {
    messages: UIMessage[];
    selectedModel: modelID;
    search: boolean;
    reasoningLevel: ReasoningLevel;
  } = await req.json();
  try {
    const result = streamText({
      model: model.languageModel(selectedModel),
      messages,
      providerOptions: {
        google: {
          useSearchGrounding: search,
          dynamicRetrievalConfig: {
            mode: "MODE_DYNAMIC",
            dynamicThreshold: 0.1,
          },
          thinkingConfig:
            selectedModel === "gemini-2.5-flash-thinking"
              ? {
                  thinkingBudget: REASONING_LEVEL_MAP[reasoningLevel],
                }
              : {
                  thinkingBudget: 0,
                },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_CIVIC_INTEGRITY",
              threshold: "BLOCK_NONE",
            },
          ],
        } satisfies GoogleGenerativeAIProviderOptions,
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
