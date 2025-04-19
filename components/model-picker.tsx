"use client";
import type { modelID } from "@/ai/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TextMorph } from "@/components/ui/text-morph";

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
  "gemini-2.0-flash-lite": {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description:
      "A lightweight version of Gemini 2.0 flash, optimized for speed and efficiency",
    vision: true,
    reasoning: false,
    search: false,
  },
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description:
      "Our flagship LLM that delivers unfiltered insights and raw intelligence",
    vision: true,
    reasoning: false,
    search: false,
  },
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description:
      "Our flagship LLM that delivers unfiltered insights and raw intelligence",
    vision: true,
    reasoning: false,
    search: false,
  },
  "gemini-2.0-pro": {
    id: "gemini-2.0-pro",
    name: "Gemini 2.0 Pro",
    description:
      "A professional-grade model that combines advanced reasoning with pro features",
    vision: true,
    reasoning: false,
    search: false,
  },

  // Search models
  "gemini-2.0-search": {
    id: "gemini-2.0-search",
    name: "Gemini 2.0 Flash",
    description:
      "A powerful search model that provides accurate and relevant search results",
    vision: true,
    reasoning: false,
    search: true,
  },
  "gemini-2.5-search": {
    id: "gemini-2.5-search",
    name: "Gemini 2.5 Flash",
    description:
      "Our flagship LLM that delivers unfiltered insights and raw intelligence",
    vision: true,
    reasoning: false,
    search: true,
  },

  // Search and thinking models
  "gemini-2.5-flash-search-thinking": {
    id: "gemini-2.5-flash-search-thinking",
    name: "Gemini 2.5 Flash",
    description: "A model that combines advanced search and thinking features",
    vision: true,
    reasoning: true,
    search: true,
  },
  "gemini-2.5-pro-search-thinking": {
    id: "gemini-2.5-pro-search-thinking",
    name: "Gemini 2.5 Pro",
    description: "A model that combines advanced search and thinking features",
    vision: true,
    reasoning: true,
    search: true,
  },

  // Thinking models
  "gemini-2.0-thinking": {
    id: "gemini-2.0-thinking",
    name: "Gemini 2.0 Flash",
    description: "A model that combines advanced reasoning features",
    vision: true,
    reasoning: true,
    search: false,
  },
  "gemini-2.5-thinking": {
    id: "gemini-2.5-thinking",
    name: "Gemini 2.5 Flash",
    description: "A model that combines advanced reasoning features",
    vision: true,
    reasoning: true,
    search: false,
  },
  "gemini-2.5-pro-thinking": {
    id: "gemini-2.5-pro-thinking",
    name: "Gemini 2.5 Pro",
    description: "A model that combines advanced reasoning with pro features",
    vision: true,
    reasoning: true,
    search: false,
  },
};

interface ModelPickerProps {
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  activeSearchButton: "none" | "search";
  activeThinkButton: "none" | "think";
}
export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
  activeSearchButton,
  activeThinkButton,
}: ModelPickerProps) => {
  const getAvailableModels = () => {
    if (activeSearchButton === "search" && activeThinkButton === "think") {
      return Object.values(MODELS).filter(
        (model) => model.search && model.reasoning,
      );
    } else if (activeSearchButton === "search") {
      return Object.values(MODELS).filter(
        (model) => model.search && !model.reasoning,
      );
    } else if (activeThinkButton === "think") {
      return Object.values(MODELS).filter(
        (model) => model.reasoning && !model.search,
      );
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
          <Image src="/gemini.png" alt="Gemini" width={16} height={16} />
          <TextMorph
            variants={{
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
          >
            {selectedModel.name}
          </TextMorph>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuLabel className="text-center">
          Choose a model
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1">
          {availableModels.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={cn(
                "flex flex-row justify-start items-center",
                selectedModel.id === model.id &&
                  "bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground!",
              )}
            >
              <span className="text-sm">{model.name}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
