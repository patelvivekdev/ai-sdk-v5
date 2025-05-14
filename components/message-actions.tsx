import { UIMessage } from "ai";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { memo } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { TimeStamp } from "./message-timestamp";
import equal from "fast-deep-equal";
import { ExampleMetadata } from "@/ai/metadata-schema";
import { MODELS } from "./model-picker";
import { modelID } from "@/ai/providers";
import { Separator } from "./ui/separator";

function PureMessageActions({
  message,
}: {
  message: UIMessage<ExampleMetadata>;
}) {
  const parts = message.parts?.filter((part) => part.type === "text");
  let formattedTime = "";
  if (message.metadata?.createdAt) {
    // Convert number timestamp to Date object if it's a number
    const timestamp =
      typeof message.metadata.createdAt === "number"
        ? new Date(message.metadata.createdAt)
        : message.metadata.createdAt;

    formattedTime = timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (message.role === "user") {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-row items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <CopyButton
                content={parts?.map((part) => part.text).join("\n") || ""}
              />
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <CopyButton
              content={parts?.map((part) => part.text).join("\n") || ""}
            />
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
        <TimeStamp
          id={message.id}
          formattedTime={formattedTime}
          isUser={false}
        />
        {message.metadata?.duration && (
          <>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground">
              Duration: {message.metadata?.duration} s
            </p>
          </>
        )}
        {message.metadata?.finishReason == "stop" && (
          <>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground flex flex-row items-center gap-2">
              Generated with{" "}
              {message.metadata?.model &&
                MODELS[message.metadata.model as modelID].name}
            </p>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (prevProps.message.role !== nextProps.message.role) return false;
    if (!equal(prevProps.message.metadata, nextProps.message.metadata))
      return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  },
);
