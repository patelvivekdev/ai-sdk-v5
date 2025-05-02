"use client";
import { Brain, BrainCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export type ReasoningLevel = "low" | "high";

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
        <DropdownMenuItem
          onClick={() => setReasoningLevel("low")}
          className={cn(
            reasoningLevel === "low" &&
              "bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground!",
          )}
        >
          <Brain className="mr-2 size-4 text-current" /> Low
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setReasoningLevel("high")}
          className={cn(
            reasoningLevel === "high" &&
              "bg-primary text-primary-foreground hover:bg-primary! hover:text-primary-foreground!",
          )}
        >
          <Brain className="mr-2 size-4 text-current" /> High
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
