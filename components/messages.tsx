import type { Message as TMessage } from "ai";
import { Message, ThinkingMessage } from "./message";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { ScrollButton } from "./scroll-button";

export const Messages = ({
  messages,
  isLoading,
  status,
}: {
  messages: TMessage[];
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
}) => {
  const [containerRef, showScrollButton, scrollToBottom] =
    useScrollToBottom<HTMLDivElement>();
  return (
    <div
      data-radix-scroll-area-viewport
      className="flex-1 overflow-y-scroll relative py-8"
    >
      <div className="space-y-4 " ref={containerRef}>
        <div className="max-w-3xl mx-auto pt-8">
          {messages.map((m, i) => (
            <Message
              key={i}
              isLoading={isLoading}
              message={m}
              status={status}
            />
          ))}
        </div>

        {(status === "submitted" || status === "streaming") &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && <ThinkingMessage />}
      </div>
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
