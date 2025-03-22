import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { cerebras } from "@ai-sdk/cerebras";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

// custom provider with different model settings:
export const model = customProvider({
  languageModels: {
    "gemini-2.0-flash": google("gemini-2.0-flash-001"),
    "gemini-with-search": google("gemini-2.0-flash-001", {
      useSearchGrounding: true,
    }),
    "gemini-2.0-pro": google("gemini-2.0-pro-exp-02-05"),
    "gemini-2.0-thinking": google("gemini-2.0-flash-thinking-exp-01-21"),
    "deepseek-r1-thinking": openrouter("deepseek/deepseek-r1:free"),
    "deepseek-r1-llama-thinking": wrapLanguageModel({
      middleware: extractReasoningMiddleware({
        tagName: "think",
      }),
      model: groq("deepseek-r1-distill-llama-70b"),
    }),
    "llama-3.3": cerebras("llama3.3-70b"),
  },
});

export type modelID = Parameters<(typeof model)["languageModel"]>["0"];
