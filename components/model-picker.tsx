"use client";
import type { modelID } from "@/ai/providers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModelPickerProps {
  selectedModel: modelID;
  setSelectedModel: (model: modelID) => void;
  activeButton: "none" | "deepSearch" | "think";
}

const MODELS: Record<modelID, string> = {
  "gemini-2.0-flash":
    "Our flagship LLM that delivers unfiltered insights and raw intelligence",
  "gemini-2.0-pro":
    "A powerful LLM that provides accurate and reliable information",
  "gemini-2.0-thinking":
    "A powerful LLM that provides accurate and reliable information",
  "gemini-with-search":
    "A powerful LLM that provides accurate and reliable information",
  "deepseek-r1-llama-thinking":
    "A powerful LLM that provides accurate and reliable information",
  "deepseek-r1-thinking":
    "A powerful LLM that provides accurate and reliable information",
  "llama-3.3": "A powerful LLM that provides accurate and reliable information",
};

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
  activeButton,
}: ModelPickerProps) => {
  // Get available models based on the active button
  const getAvailableModels = () => {
    if (activeButton === "deepSearch") {
      return ["gemini-with-search"];
    } else if (activeButton === "think") {
      return [
        "gemini-2.0-thinking",
        "deepseek-r1-thinking",
        "deepseek-r1-llama-thinking",
      ];
    } else {
      // remove search and think models
      return Object.keys(MODELS).filter(
        (model) =>
          ![
            "gemini-with-search",
            "gemini-2.0-thinking",
            "deepseek-r1-thinking",
            "deepseek-r1-llama-thinking",
          ].includes(model)
      ) as modelID[];
    }
  };

  const availableModels = getAvailableModels();

  return (
    <Select
      value={selectedModel}
      onValueChange={(newModel) => {
        if (newModel !== selectedModel) {
          setSelectedModel(newModel as modelID);
        }
      }}
    >
      <SelectTrigger
        className={`h-9 w-full border border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700 rounded-md text-xs ${
          activeButton === "deepSearch" || activeButton === "think"
            ? "opacity-80"
            : ""
        }`}
      >
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableModels.map((modelId) => (
            <SelectItem key={modelId} value={modelId} className="text-xs">
              {modelId}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
