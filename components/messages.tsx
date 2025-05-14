import type { UIMessage } from "ai";
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
import { ExampleMetadata } from "@/ai/metadata-schema";

export const Messages = ({
  messages,
  status,
  handleReloadChat,
}: {
  messages: UIMessage<ExampleMetadata>[];
  status: "error" | "submitted" | "streaming" | "ready";
  handleReloadChat: () => void;
}) => {
  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      data-radix-scroll-area-viewport
      className="relative flex-1 overflow-y-scroll pt-8"
    >
      <div className="space-y-4" ref={containerRef}>
        <div className="mx-auto max-w-3xl space-y-4 pt-8">
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
          <div className="mt-4 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReloadChat}
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
            className="hover:bg-muted rounded-full shadow-lg"
          />
        )}
      </div>
    </div>
  );
};
