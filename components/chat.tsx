"use client";

import type { modelID } from "@/ai/providers";
import { useChat } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { MultiModalTextarea } from "./textarea";

export default function Chat() {
  const [selectedModel, setSelectedModel] =
    useState<modelID>("gemini-2.0-flash");
  const [activeButton, setActiveButton] = useState<
    "none" | "deepSearch" | "think"
  >("none");

  // Update model when activeButton changes
  useEffect(() => {
    if (activeButton === "deepSearch") {
      setSelectedModel("gemini-with-search");
    } else if (activeButton === "think") {
      // Always set a default thinking model when switching to think mode
      setSelectedModel("gemini-2.0-thinking");
    } else if (
      activeButton === "none" &&
      (selectedModel === "gemini-with-search" ||
        selectedModel === "gemini-2.0-thinking" ||
        selectedModel === "deepseek-r1-thinking" ||
        selectedModel === "deepseek-r1-llama-thinking")
    ) {
      setSelectedModel("gemini-2.0-flash");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeButton]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    status,
    stop,
  } = useChat({
    body: {
      selectedModel,
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  if (error) return <div>{error.message}</div>;

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
        onSubmit={handleSubmit}
        className="pb-8 bg-white dark:bg-black w-full max-w-3xl mx-auto px-4 sm:px-0"
      >
        <MultiModalTextarea
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          handleInputChange={handleInputChange}
          input={input}
          isLoading={isLoading}
          status={status}
          stop={stop}
        />
      </form>
    </div>
  );
}
