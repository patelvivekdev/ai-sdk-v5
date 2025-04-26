import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface CreateNewChatButtonProps {
  className?: string;
}

export function CreateNewChatButton({ className }: CreateNewChatButtonProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className={cn("rounded-2xl", className)}
            asChild
          >
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">
              <PlusCircle className="size-5" />
              <span className="hidden md:block">new chat</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create a new chat</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
