"use client";
import type { modelID } from "@/ai/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ModelOption {
  id: modelID;
  name: string;
  vision: boolean;
  reasoning: boolean;
  search: boolean;
}

export const MODELS: Record<modelID, ModelOption> = {
  // Vision models

  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    vision: true,
    reasoning: false,
    search: false,
  },
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    vision: true,
    reasoning: false,
    search: false,
  },

  // Search models
  "gemini-2.0-search": {
    id: "gemini-2.0-search",
    name: "Gemini 2.0 Flash",
    vision: true,
    reasoning: false,
    search: true,
  },
  "gemini-2.5-search": {
    id: "gemini-2.5-search",
    name: "Gemini 2.5 Flash",
    vision: true,
    reasoning: false,
    search: true,
  },

  // Search and thinking models
  "gemini-2.5-flash-search-thinking": {
    id: "gemini-2.5-flash-search-thinking",
    name: "Gemini 2.5 Flash",
    vision: true,
    reasoning: true,
    search: true,
  },
  "gemini-2.5-pro-search-thinking": {
    id: "gemini-2.5-pro-search-thinking",
    name: "Gemini 2.5 Pro",
    vision: true,
    reasoning: true,
    search: true,
  },

  // Thinking models
  "gemini-2.5-thinking": {
    id: "gemini-2.5-thinking",
    name: "Gemini 2.5 Flash",
    vision: true,
    reasoning: true,
    search: false,
  },
  "gemini-2.5-pro-thinking": {
    id: "gemini-2.5-pro-thinking",
    name: "Gemini 2.5 Pro",
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
        <Button variant="outline" className="rounded-2xl">
          <Image src="/gemini.png" alt="Gemini" width={16} height={16} />
          {selectedModel.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
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
