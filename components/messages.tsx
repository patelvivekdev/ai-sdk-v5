import type { ChatRequestOptions, Message as TMessage } from "ai";
import { Message, ThinkingMessage } from "./message";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { ScrollButton } from "./scroll-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import { ReasoningLevel } from "./reasoning-selector";
export const Messages = ({
  selectedModel,
  reasoningLevel,
  messages,
  status,
  reload,
}: {
  selectedModel: string;
  reasoningLevel: ReasoningLevel;
  messages: TMessage[];
  status: "error" | "submitted" | "streaming" | "ready";
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}) => {
  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();
  return (
    <div
      data-radix-scroll-area-viewport
      className="flex-1 overflow-y-scroll relative pt-8"
    >
      <div className="space-y-4 " ref={containerRef}>
        <div className="max-w-3xl mx-auto pt-8">
          {messages.map((m, i) => (
            <Message key={i} message={m} status={status} />
          ))}
        </div>

        {(status === "submitted" || status === "streaming") &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && <ThinkingMessage />}
      </div>
      {(status === "ready" || status === "error") && messages.length > 0 && (
        <TooltipProvider delayDuration={0}>
          <div className="flex justify-center mt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    reload({
                      body: {
                        selectedModel,
                        reasoningLevel,
                      },
                    })
                  }
                  className="gap-2"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Regenerate Response
                </Button>
              </TooltipTrigger>
              <TooltipContent>Regenerate last response</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}
      <div className="sticky bottom-4">
        {showScrollButton && (
          <ScrollButton
            onClick={scrollToBottom}
            alignment="center"
            className="rounded-full shadow-lg hover:bg-muted"
          />
        )}
      </div>
    </div>
  );
};
