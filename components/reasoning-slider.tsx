"use client";
import { BrainCog } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export type ReasoningLevel = "0" | "1" | "2";

// Define icon size based on reasoning level
const ICON_SIZE = {
  "0": 20,
  "1": 24,
  "2": 28,
};

interface ReasoningSelectorProps {
  reasoningLevel: ReasoningLevel;
  setReasoningLevel: (level: ReasoningLevel) => void;
}

export function ReasoningSelector({
  reasoningLevel,
  setReasoningLevel,
}: ReasoningSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          className="flex items-center gap-2 rounded-2xl"
        >
          <BrainCog size={ICON_SIZE[reasoningLevel]} className="text-accent" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 pb-8">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Thinking Depth</h4>
          <div className="relative">
            <Slider
              value={[Number(reasoningLevel)]}
              onValueChange={(value) => {
                setReasoningLevel(value[0].toString() as ReasoningLevel);
              }}
              max={2}
              step={1}
              className="relative flex w-full touch-none items-center select-none"
            />
            <div className="absolute top-full left-0 mt-1.5 flex w-full justify-between px-1">
              <Label className="cursor-default text-xs">Low</Label>
              <Label className="cursor-default text-xs">Medium</Label>
              <Label className="cursor-default text-xs">High</Label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
