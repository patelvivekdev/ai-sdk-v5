import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type ScrollButtonAlignment = "left" | "center" | "right";

interface ScrollButtonProps {
  onClick: () => void;
  alignment?: ScrollButtonAlignment;
  className?: string;
}

export function ScrollButton({
  onClick,
  alignment = "right",
  className,
}: ScrollButtonProps) {
  const alignmentClasses = {
    left: "left-4",
    center: "left-1/2 -translate-x-1/2",
    right: "right-4",
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "hover:bg-muted absolute bottom-4 rounded-full shadow-lg",
              alignmentClasses[alignment],
              className,
            )}
            onClick={onClick}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Scroll to bottom</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
