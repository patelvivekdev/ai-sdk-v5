"use client";
import { BrainCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type ReasoningLevel = "low" | "medium" | "high";

interface ReasoningSelectorProps {
  reasoningLevel: ReasoningLevel;
  setReasoningLevel: (level: ReasoningLevel) => void;
}

export function ReasoningSelector({
  reasoningLevel,
  setReasoningLevel,
}: ReasoningSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="rounded-2xl">
          <BrainCog className="h-4 w-4" />
          {reasoningLevel.charAt(0).toUpperCase() + reasoningLevel.slice(1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={reasoningLevel}
          onValueChange={(value) => setReasoningLevel(value as ReasoningLevel)}
        >
          <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
