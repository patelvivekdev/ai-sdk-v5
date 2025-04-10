"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { ProjectOverview } from "./project-overview";
import { Messages } from "@/components/messages";
import { Header } from "@/components/header";
import { MultiModalTextarea } from "./chat-input";
import { ModelOption } from "./model-picker";
import { MODELS } from "./model-picker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Chat({ chatId }: { chatId: string }) {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    MODELS["gemini-2.0-flash"],
  );
  const [activeButton, setActiveButton] = useState<"none" | "search" | "think">(
    "none",
  );

  // Update model when activeButton changes
  useEffect(() => {
    if (activeButton === "search") {
      setSelectedModel(MODELS["gemini-2.0-search"]);
    } else if (activeButton === "think") {
      // Always set a default thinking model when switching to think mode
      setSelectedModel(MODELS["gemini-2.0-thinking"]);
    } else if (activeButton === "none") {
      setSelectedModel(MODELS["gemini-2.0-flash"]);
    }
  }, [activeButton]);

  const { messages, status } = useChat({
    id: chatId,
    body: {
      selectedModel: selectedModel.id,
    },
    onError: (error) => {
      toast.error(error.message, {
        description:
          "Please try again or contact support if the issue persists.",
      });
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="h-dvh flex flex-col justify-center w-full stretch">
      <Header />
      {messages.length === 0 ? (
        <div className="max-w-3xl mx-auto w-full">
          <ProjectOverview />
        </div>
      ) : (
        <Messages messages={messages} isLoading={isLoading} status={status} />
      )}
      <form
        className={cn(
          "bg-secondary flex w-11/12 max-w-3xl mx-auto px-4 sm:px-2 py-1 mt-4 shadow-md border border-gray-200 dark:border-gray-700",
          messages.length > 0 ? "rounded-t-2xl" : "sticky rounded-2xl bottom-0",
        )}
      >
        <MultiModalTextarea
          chatId={chatId}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </form>
    </div>
  );
}
