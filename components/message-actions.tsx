"use client";
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
import { BoxIcon, Trash2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteChatById,
  deleteMessageById,
  getMessagesById,
} from "@/hooks/use-chats";
import { Button } from "./ui/button";
import { UIMessage } from "ai";
import { useRouter } from "next/navigation";

function PureMessageActions({
  id,
  role,
  metadata,
  content,
  setMessages,
  chatId,
}: {
  id: string;
  role: "user" | "assistant" | "system";
  metadata: ExampleMetadata | undefined;
  content: string;
  setMessages: (messages: UIMessage<ExampleMetadata>[]) => void;
  chatId: string;
}) {
  const router = useRouter();
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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ chatId, id }: { chatId: string; id: string }) =>
      deleteMessageById(chatId, id),
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chats", chatId],
      });
    },
    onError: () => {
      toast.error("Failed to delete message");
    },
  });
  const handleDeleteMessage = async () => {
    const messages = await getMessagesById(chatId);
    const updatedMessages = messages.filter((m) => m.id !== id);

    if (updatedMessages.length === 0) {
      console.log("No messages left");
      await deleteChatById(chatId);
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chats", chatId],
      });
      setMessages([]);
      router.push("/");
      return;
    }

    // if only one message left and it is assistant, delete the chat
    if (
      updatedMessages.length === 1 &&
      updatedMessages[0].role === "assistant"
    ) {
      console.log("Last message is assistant");
      await deleteChatById(chatId);
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      queryClient.invalidateQueries({
        queryKey: ["chats", chatId],
      });
      setMessages([]);
      router.push("/");
      return;
    }

    mutation.mutate({
      chatId,
      id,
    });
    setMessages(updatedMessages);
  };

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground h-fit px-2 py-1"
                onClick={handleDeleteMessage}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
          <TimeStamp id={id} formattedTime={formattedTime} isUser={true} />
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="text-muted-foreground h-fit px-2 py-1"
              onClick={handleDeleteMessage}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
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
    if (prevProps.chatId !== nextProps.chatId) return false;
    if (prevProps.id !== nextProps.id) return false;
    if (prevProps.role !== nextProps.role) return false;
    if (!equal(prevProps.metadata, nextProps.metadata)) return false;

    return true;
  },
);
