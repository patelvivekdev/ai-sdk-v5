import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { customProvider } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const google1 = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY_1,
});

const google2 = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY_2,
});

// custom provider with different model settings:
export const model = customProvider({
  languageModels: {
    "gemini-2.0-flash": google("gemini-2.0-flash"),
    "gemini-2.5-flash": google("gemini-2.5-flash-preview-04-17"),
    "gemini-2.5-flash-thinking": google1("gemini-2.5-flash-preview-04-17"),
    "gemini-2.5-pro": google2("gemini-2.5-pro-exp-03-25"),
  },
});

export type modelID = Parameters<(typeof model)["languageModel"]>["0"];
