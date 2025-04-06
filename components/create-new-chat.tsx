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
            variant="outline"
            className={cn("rounded-xl", className)}
            asChild
          >
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">
              <PlusCircle className="h-4 w-4" />
              <span>new chat</span>
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create a new chat</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
