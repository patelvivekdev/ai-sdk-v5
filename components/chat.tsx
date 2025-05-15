"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ProjectOverview } from "./project-overview";
import { Messages } from "@/components/messages";
import { ChatInput } from "./chat-input";
import { ModelOption } from "./model-picker";
import { MODELS } from "./model-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ReasoningLevel } from "./reasoning-selector";
import { ChatRequestOptions } from "ai";
import { ExampleMetadata, exampleMetadataSchema } from "@/ai/metadata-schema";
import { zodSchema } from "@ai-sdk/provider-utils";
import { getMessagesById, saveMessages } from "@/hooks/use-chats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatSession } from "@/lib/db";
import { defaultChatStore } from "ai";

export default function Chat({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: UIMessage<ExampleMetadata>[];
}) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    MODELS["gemini-2.0-flash"],
  );
  const [activeSearchButton, setActiveSearchButton] = useState<
    "none" | "search"
  >("none");
  const [reasoningLevel, setReasoningLevel] = useState<ReasoningLevel>("low");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (messages: ChatSession["messages"]) =>
      saveMessages(chatId, messages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },
    onError: () => {
      toast.error("Failed to save messages");
    },
  });

  const {
    messages,
    status,
    reload,
    input,
    handleInputChange,
    handleSubmit,
    stop,
  } = useChat({
    id: chatId,
    chatStore: defaultChatStore({
      api: "/api/chat",
      messageMetadataSchema: zodSchema(exampleMetadataSchema),
      chats: chatId
        ? { [chatId]: { messages: initialMessages ?? [] } }
        : undefined,
    }),
    onFinish: async ({ message }: { message: UIMessage<ExampleMetadata> }) => {
      const savedMessages = await getMessagesById(chatId);
      mutation.mutate([...savedMessages, message]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeLastLatestAssistantMessage = async () => {
    const messages = await getMessagesById(chatId);
    const updatedMessages = messages.slice(0, -1);
    mutation.mutate(updatedMessages);
    return updatedMessages;
  };

  const handleReloadChat = async () => {
    await removeLastLatestAssistantMessage();
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
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          activeSearchButton={activeSearchButton}
          setActiveSearchButton={setActiveSearchButton}
          reasoningLevel={reasoningLevel}
          setReasoningLevel={setReasoningLevel}
        />
      </form>
    </div>
  );
}
