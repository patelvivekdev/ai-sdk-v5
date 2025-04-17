import { google } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { customProvider } from "ai";

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

// custom provider with different model settings:
export const model = customProvider({
  languageModels: {
    // Google Gemini models
    "gemini-2.0-flash-lite": google("gemini-2.0-flash-lite-001"),
    "gemini-2.0-flash": google("gemini-2.0-flash-001"),
    "gemini-2.5-flash": google("gemini-2.5-flash-preview-04-17"),
    "gemini-2.0-pro": google("gemini-exp-1206"),

    // Gemini with search grounding
    "gemini-2.0-search": google("gemini-2.0-flash-001", {
      useSearchGrounding: true,
      dynamicRetrievalConfig: {
        mode: "MODE_DYNAMIC",
        dynamicThreshold: 0,
      },
    }),
    "gemini-2.5-search": google("gemini-2.5-flash-preview-04-17", {
      useSearchGrounding: true,
      dynamicRetrievalConfig: {
        mode: "MODE_DYNAMIC",
        dynamicThreshold: 0,
      },
    }),
    "gemini-2.5-pro-search": google("gemini-2.5-pro-exp-03-25", {
      useSearchGrounding: true,
      dynamicRetrievalConfig: {
        mode: "MODE_DYNAMIC",
        dynamicThreshold: 0,
      },
    }),

    // Gemini with reasoning capabilities
    "gemini-2.0-thinking": openrouter(
      "google/gemini-2.0-flash-thinking-exp:free",
    ),
    "gemini-2.5-thinking": google("gemini-2.5-flash-preview-04-17"),
    "gemini-2.5-pro-thinking": openrouter(
      "google/gemini-2.5-pro-exp-03-25:free",
    ),
  },
});

export type modelID = Parameters<(typeof model)["languageModel"]>["0"];
