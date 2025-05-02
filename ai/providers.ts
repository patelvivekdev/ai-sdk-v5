import { google } from "@ai-sdk/google";
import { customProvider } from "ai";

// custom provider with different model settings:
export const model = customProvider({
  languageModels: {
    // Google Gemini models
    "gemini-2.0-flash": google("gemini-2.0-flash"),
    "gemini-2.5-flash": google("gemini-2.5-flash-preview-04-17"),
    "gemini-2.5-flash-thinking": google("gemini-2.5-flash-preview-04-17"),
    "gemini-2.5-pro": google("gemini-2.5-pro-exp-03-25"),
  },
});

export type modelID = Parameters<(typeof model)["languageModel"]>["0"];
