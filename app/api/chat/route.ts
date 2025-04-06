import { model, type modelID } from "@/ai/providers";
import { streamText, type UIMessage } from "ai";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  const {
    messages,
    selectedModel,
  }: { messages: UIMessage[]; selectedModel: modelID } = await req.json();
  try {
    const result = streamText({
      model: model.languageModel(selectedModel),
      system: "You are a helpful assistant.",
      messages,
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
