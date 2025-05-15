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
import { BoxIcon, BrainCog } from "lucide-react";

function PureMessageActions({
  id,
  role,
  metadata,
  content,
}: {
  id: string;
  role: "user" | "assistant" | "system";
  metadata: ExampleMetadata | undefined;
  content: string;
}) {
  let formattedTime = "";
  if (metadata?.createdAt) {
    // Convert number timestamp to Date object if it's a number
    const timestamp =
      typeof metadata.createdAt === "number"
        ? new Date(metadata.createdAt)
        : metadata.createdAt;

    formattedTime = timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (role === "user") {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-row items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <CopyButton content={content} />
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
            <CopyButton content={content} />
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>
        <TimeStamp id={id} formattedTime={formattedTime} isUser={false} />
        {metadata?.finishReason == "stop" && (
          <>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground flex flex-row items-center gap-2">
              <BoxIcon className="h-4 w-4" />
              {metadata?.model && MODELS[metadata.model as modelID].name}{" "}
              {metadata?.model &&
                MODELS[metadata.model as modelID].reasoning &&
                "(Thinking)"}
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
    if (prevProps.id !== nextProps.id) return false;
    if (prevProps.role !== nextProps.role) return false;
    if (!equal(prevProps.metadata, nextProps.metadata)) return false;

    return true;
  },
);
