"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { ProjectOverview } from "./project-overview";
import { Messages } from "@/components/messages";
import { ChatInput } from "./chat-input";
import { ModelOption } from "./model-picker";
import { MODELS } from "./model-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ReasoningLevel } from "./reasoning-selector";
import useChatStore from "@/hooks/use-chat-store";
import { Header } from "./header";
import { ChatRequestOptions } from "ai";
import { ExampleMetadata, exampleMetadataSchema } from "@/ai/metadata-schema";
import { zodSchema } from "@ai-sdk/provider-utils";

export default function Chat({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: UIMessage<ExampleMetadata>[];
}) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    MODELS["gemini-2.5-flash"],
  );
  const [activeSearchButton, setActiveSearchButton] = useState<
    "none" | "search"
  >("none");
  const [activeThinkButton, setActiveThinkButton] = useState<"none" | "think">(
    "none",
  );
  const [reasoningLevel, setReasoningLevel] = useState<ReasoningLevel>("high");
  const saveMessages = useChatStore((state) => state.saveMessages);
  const getMessagesById = useChatStore((state) => state.getMessagesById);

  // Update model when activeButton changes
  useEffect(() => {
    if (activeThinkButton === "think") {
      // Always set a default thinking model when switching to think mode
      setSelectedModel(MODELS["gemini-2.5-flash-thinking"]);
    } else {
      setSelectedModel(MODELS["gemini-2.5-flash"]);
    }
  }, [activeThinkButton]);

  const { messages, status, reload } = useChat({
    id: chatId,
    initialMessages: initialMessages,
    messageMetadataSchema: zodSchema(exampleMetadataSchema),
    body: {
      selectedModel: selectedModel.id,
      search: activeSearchButton === "search",
      reasoningLevel: reasoningLevel,
    },
    onFinish: async ({ message }: { message: UIMessage<ExampleMetadata> }) => {
      const savedMessages = await getMessagesById(chatId);
      saveMessages(chatId, [...savedMessages, message]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeLatestAssistantMessage = async () => {
    const updatedMessages = messages.filter(
      (message) => message.role !== "assistant",
    );
    await saveMessages(chatId, updatedMessages);
    return updatedMessages;
  };

  const handleReloadChat = async () => {
    await removeLatestAssistantMessage();
    const requestOptions: ChatRequestOptions = {
      body: {
        selectedModel: selectedModel.id,
        search: activeSearchButton === "search",
        reasoningLevel: reasoningLevel,
      },
    };
    reload(requestOptions);
  };

  return (
    <div className="stretch flex h-dvh w-full flex-col justify-center">
      <Header />
      {messages.length === 0 ? (
        <div className="mx-auto w-full max-w-3xl">
          <ProjectOverview />
        </div>
      ) : (
        <Messages
          handleReloadChat={handleReloadChat}
          messages={messages}
          status={status}
        />
      )}
      <form
        className={cn(
          "bg-secondary/90 border-secondary-foreground/20 mx-auto mt-4 flex w-11/12 max-w-3xl border-2 p-2 shadow-md sm:px-2",
          messages.length > 0 ? "rounded-t-2xl border-b-0" : "rounded-2xl",
        )}
      >
        <ChatInput
          chatId={chatId}
          initialMessages={initialMessages}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          activeSearchButton={activeSearchButton}
          setActiveSearchButton={setActiveSearchButton}
          activeThinkButton={activeThinkButton}
          setActiveThinkButton={setActiveThinkButton}
          reasoningLevel={reasoningLevel}
          setReasoningLevel={setReasoningLevel}
        />
      </form>
    </div>
  );
}
