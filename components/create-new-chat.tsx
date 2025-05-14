import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CreateNewChatButton() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className={cn("rounded-2xl")}
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <PlusCircle className="size-5" />
              <span>new chat</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create a new chat</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
