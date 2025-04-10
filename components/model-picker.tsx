"use client";
import type { modelID } from "@/ai/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface ModelPickerProps {
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  activeButton: "none" | "search" | "think";
}

export interface ModelOption {
  id: modelID;
  name: string;
  description: string;
  vision: boolean;
  reasoning: boolean;
  search: boolean;
}

export const MODELS: Record<modelID, ModelOption> = {
  // Vision models
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 flash",
    description:
      "Our flagship LLM that delivers unfiltered insights and raw intelligence",
    vision: true,
    reasoning: false,
    search: false,
  },
  "gemini-2.0-flash-lite": {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 flash lite",
    description:
      "A lightweight version of Gemini 2.0 flash, optimized for speed and efficiency",
    vision: true,
    reasoning: false,
    search: false,
  },
  "gemini-2.0-pro": {
    id: "gemini-2.0-pro",
    name: "Gemini 2.0 pro",
    description:
      "A professional-grade model that combines advanced reasoning with pro features",
    vision: true,
    reasoning: false,
    search: false,
  },

  // Search models
  "gemini-2.0-search": {
    id: "gemini-2.0-search",
    name: "Gemini 2.0 search",
    description:
      "A powerful search model that provides accurate and relevant search results",
    vision: true,
    reasoning: false,
    search: true,
  },
  "gemini-2.5-pro-search": {
    id: "gemini-2.5-pro-search",
    name: "Gemini 2.5 pro search",
    description:
      "An advanced search model that enhances search capabilities with pro features",
    vision: true,
    reasoning: false,
    search: true,
  },

  // Thinking models
  "gemini-2.0-thinking": {
    id: "gemini-2.0-thinking",
    name: "Gemini 2.0",
    description: "A model that combines advanced reasoning features",
    vision: true,
    reasoning: true,
    search: false,
  },
  "gemini-2.5-pro-thinking": {
    id: "gemini-2.5-pro-thinking",
    name: "Gemini 2.5 pro",
    description: "A model that combines advanced reasoning with pro features",
    vision: true,
    reasoning: true,
    search: false,
  },
};

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
  activeButton,
}: ModelPickerProps) => {
  const getAvailableModels = () => {
    if (activeButton === "search") {
      return Object.values(MODELS).filter((model) => model.search);
    } else if (activeButton === "think") {
      return Object.values(MODELS).filter((model) => model.reasoning);
    } else {
      return Object.values(MODELS).filter(
        (model) => !model.search && !model.reasoning,
      );
    }
  };

  const availableModels = getAvailableModels();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {selectedModel.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">
          Select a model
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedModel.id}
          onValueChange={(value: string) =>
            setSelectedModel(
              Object.values(availableModels).find(
                (model) => model.id === value,
              ) || MODELS["gemini-2.0-flash"],
            )
          }
        >
          {availableModels.map((model) => (
            <DropdownMenuRadioItem key={model.id} value={model.id}>
              {model.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
