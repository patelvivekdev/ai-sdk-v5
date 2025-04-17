import { Message } from "ai";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { memo } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { TimeStamp } from "./message-timestamp";

function PureMessageActions({ message }: { message: Message }) {
  const formattedTime = message.createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (message.role === "user") {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-row items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <CopyButton content={message.content} />
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <TimeStamp
            message={message}
            formattedTime={formattedTime || ""}
            isUser={true}
          />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row items-center gap-2">
        <TimeStamp
          message={message}
          formattedTime={formattedTime || ""}
          isUser={false}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <CopyButton content={message.content} />
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.message.role !== nextProps.message.role) return false;
    if (prevProps.message.createdAt !== nextProps.message.createdAt)
      return false;
    if (prevProps.message.content !== nextProps.message.content) return false;

    return true;
  },
);
