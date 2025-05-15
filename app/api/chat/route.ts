import { model, type modelID } from "@/ai/providers";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ReasoningLevel } from "@/components/reasoning-selector";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { ExampleMetadata } from "@/ai/metadata-schema";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const REASONING_LEVEL_MAP = {
  low: 7000,
  medium: 15000,
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
    const startTime = performance.now();
    const result = streamText({
      model: model.languageModel(selectedModel),
      messages: convertToModelMessages(messages),
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
      onError: (error) => {
        console.error("Error in streamText:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }): ExampleMetadata | undefined => {
        // when the message is finished, send additional information:
        if (part.type === "finish") {
          return {
            createdAt: Date.now(),
            model: selectedModel,
            totalTokens: part.totalUsage.totalTokens,
            finishReason: part.finishReason,
            duration: Number(
              ((performance.now() - startTime) / 1000).toFixed(2),
            ),
          };
        }
      },
      sendReasoning: true,
      sendSources: true,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
