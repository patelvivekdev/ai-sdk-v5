import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Message } from "@ai-sdk/react";

interface CreateNewChatButtonProps {
  setMessages: (messages: Message[]) => void;
}

export function CreateNewChatButton({ setMessages }: CreateNewChatButtonProps) {
  const router = useRouter();

  const handleCreateNewChat = () => {
    router.push("/");
    setMessages([]);
    router.refresh();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className={cn("rounded-2xl")}
            onClick={handleCreateNewChat}
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="size-5" />
              <span className="hidden md:block">new chat</span>
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create a new chat</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
