"use client";

import { Message, useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { ProjectOverview } from "./project-overview";
import { Messages } from "@/components/messages";
import { ChatInput } from "./chat-input";
import { ModelOption } from "./model-picker";
import { MODELS } from "./model-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ReasoningLevel } from "./reasoning-selector";
import useChatStore from "@/hooks/useChatStore";
import { Header } from "./header";
import { ChatRequestOptions } from "ai";

export default function Chat({
  chatId,
  initialMessages,
}: {
  chatId: string;
  initialMessages: Message[];
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
    if (activeSearchButton === "search") {
      setSelectedModel(MODELS["gemini-2.5-search"]);
    } else if (activeThinkButton === "think") {
      // Always set a default thinking model when switching to think mode
      setSelectedModel(MODELS["gemini-2.5-thinking"]);
    } else if (activeSearchButton === "none" && activeThinkButton === "none") {
      setSelectedModel(MODELS["gemini-2.5-flash"]);
    }

    if (activeSearchButton === "search" && activeThinkButton === "think") {
      setSelectedModel(MODELS["gemini-2.5-flash-search-thinking"]);
    }
  }, [activeSearchButton, activeThinkButton]);

  const { messages, status, reload } = useChat({
    id: chatId,
    initialMessages: initialMessages,
    body: {
      selectedModel: selectedModel.id,
      reasoningLevel: reasoningLevel,
    },
    onFinish: async (message) => {
      const savedMessages = await getMessagesById(chatId);
      saveMessages(chatId, [...savedMessages, message]);
    },
    onError: (error) => {
      toast.error(error.message, {
        description:
          "Please try again or contact support if the issue persists.",
      });
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
        reasoningLevel: reasoningLevel,
      },
    };
    reload(requestOptions);
  };

  return (
    <div className="h-dvh flex flex-col justify-center w-full stretch">
      <Header />
      {messages.length === 0 ? (
        <div className="max-w-3xl mx-auto w-full">
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
          "bg-secondary/90 flex w-11/12 max-w-3xl mx-auto sm:px-2 p-2 mt-4 shadow-md border-2 border-secondary-foreground/20",
          messages.length > 0 ? "rounded-t-2xl border-b-0" : "rounded-2xl",
        )}
      >
        <ChatInput
          chatId={chatId}
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
