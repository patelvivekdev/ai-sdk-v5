import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Search, Paperclip } from "lucide-react";
import { ModelOption, ModelPicker } from "./model-picker";
import { Button } from "@/components/ui/button";
import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { generateId, UIMessage, FileUIPart, ChatRequestOptions } from "ai";
import { useAutosizeTextArea } from "@/hooks/use-autosize-textarea";
import { toast } from "sonner";
import { AttachmentPreview } from "./file-preview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ReasoningLevel, ReasoningSelector } from "./reasoning-selector";
import { ExampleMetadata } from "@/ai/metadata-schema";
import { getMessagesById, saveMessages } from "@/hooks/use-chats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatSession } from "@/lib/db";

interface InputProps {
  chatId: string;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions & {
      files?: FileList | FileUIPart[];
    },
  ) => void;
  status: "submitted" | "streaming" | "ready" | "error";
  stop: () => void;
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  activeSearchButton: "none" | "search";
  setActiveSearchButton: Dispatch<SetStateAction<"none" | "search">>;
  reasoningLevel: ReasoningLevel;
  setReasoningLevel: (level: ReasoningLevel) => void;
}

export const ChatInput = ({
  chatId,
  input,
  handleInputChange,
  handleSubmit,
  status,
  stop,
  selectedModel,
  setSelectedModel,
  activeSearchButton,
  setActiveSearchButton,
  reasoningLevel,
  setReasoningLevel,
}: InputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (messages: ChatSession["messages"]) =>
      saveMessages(chatId, messages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      // queryClient.invalidateQueries({ queryKey: ["chats", chatId] });
    },
    onError: () => {
      toast.error("Failed to save messages");
    },
  });

  const isLoading = status === "streaming" || status === "submitted";
  const [attachment, setAttachment] = useState<FileUIPart | undefined>(
    undefined,
  );

  // File upload
  const uploadFile = async (file: File): Promise<FileUIPart | undefined> => {
    try {
      const reader = new FileReader();

      const attachment: Promise<FileUIPart> = new Promise((resolve, reject) => {
        reader.onload = () => {
          let mediaType = file.type;

          // Handle special file types
          if (!mediaType) {
            const extension = file.name.split(".").pop()?.toLowerCase();
            switch (extension) {
              case "pdf":
                mediaType = "application/pdf";
                break;
              case "md":
                mediaType = "text/markdown";
                break;
              case "txt":
                mediaType = "text/plain";
                break;
              default:
                mediaType = "application/octet-stream";
            }
          }

          resolve({
            filename: file.name,
            mediaType,
            url: reader.result as string,
            type: "file",
          });
        };

        reader.onerror = () =>
          reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      });

      return attachment;
    } catch (error) {
      toast.error(`Failed to upload ${file.name}. Please try again.`);
      console.error("File upload error:", error);
      return undefined;
    }
  };

  useAutosizeTextArea({
    ref: textareaRef,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [input],
  });

  // When change the model, check if the vision model is selected
  useEffect(() => {
    if (!selectedModel.vision) {
      setAttachment(undefined);
    }
  }, [selectedModel]);

  // Function to handle files selected from the file dialog
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") ||
          file.type === "application/pdf" ||
          file.type === "text/markdown" ||
          file.type === "text/plain" ||
          file.name.endsWith(".md") ||
          file.name.endsWith(".txt"),
      );

      if (validFiles.length === 0) {
        toast.error(
          "Please select a valid image, PDF, markdown, or text file.",
        );
        return;
      }

      const file = validFiles[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size exceeds 10MB limit");
          return;
        }
        const uploadPromises = validFiles.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        setAttachment(uploadedAttachments[0]);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submitForm = useCallback(async () => {
    window.history.replaceState({}, "", `/c/${chatId}`);
    const userMessage: UIMessage<ExampleMetadata> = {
      id: generateId(),
      role: "user",
      metadata: {
        createdAt: Date.now(),
      },
      parts: [
        {
          type: "text",
          text: input,
        },
        ...(attachment
          ? [
              {
                type: "file" as const,
                filename: attachment.filename,
                mediaType: attachment.mediaType || "",
                url: attachment.url || "",
              },
            ]
          : []),
      ],
    };
    handleSubmit(undefined, {
      body: {
        selectedModel: selectedModel.id,
        search: activeSearchButton === "search",
        reasoningLevel: reasoningLevel,
      },
      files: attachment ? [attachment] : [],
    });
    const messages = await getMessagesById(chatId);
    mutation.mutate([...messages, userMessage]);
    setAttachment(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [
    attachment,
    handleSubmit,
    chatId,
    mutation,
    input,
    reasoningLevel,
    selectedModel.id,
    activeSearchButton,
  ]);

  return (
    <div className="relative w-full">
      <input
        type="file"
        className="pointer-events-none fixed -top-4 -left-4 size-0.5 opacity-0"
        ref={fileInputRef}
        onChange={handleFileChange}
        tabIndex={-1}
      />
      <div className="flex flex-row items-center justify-between">
        {attachment && (
          <div className="overflow-hidden">
            <AttachmentPreview
              attachment={attachment}
              onRemove={() => setAttachment(undefined)}
            />
          </div>
        )}
        <div className="ml-auto">
          <ModelPicker
            setSelectedModel={setSelectedModel}
            selectedModel={selectedModel}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          className="w-full resize-none border-0 border-none p-2 shadow-none focus-visible:ring-0 focus-visible:outline-none"
          value={input}
          ref={textareaRef}
          autoFocus
          placeholder={"Say something..."}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                submitForm();
              }
            }
          }}
        />

        {/* Control bar at the bottom with all elements */}
        <div className="flex flex-row items-center justify-between">
          {/* center - Model picker and utility buttons */}
          <div className="flex items-center space-x-2 px-1">
            {selectedModel.vision ? (
              <AttachmentsButton
                fileInputRef={fileInputRef}
                isLoading={isLoading}
              />
            ) : (
              <div></div>
            )}
            <Button
              type="button"
              onClick={() => {
                setActiveSearchButton(
                  activeSearchButton === "search" ? "none" : "search",
                );
              }}
              variant={activeSearchButton === "search" ? "default" : "outline"}
              className="rounded-2xl"
            >
              <Search className="size-4" />
              <span className="text-xs">Search</span>
            </Button>
            {selectedModel.id === "gemini-2.5-flash-thinking" && (
              <ReasoningSelector
                reasoningLevel={reasoningLevel}
                setReasoningLevel={setReasoningLevel}
              />
            )}
          </div>
          {isLoading ? (
            <Button
              type="button"
              onClick={stop}
              size="icon"
              className="cursor-pointer rounded-2xl"
            >
              <div className="h-4 w-4 animate-spin">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              onClick={submitForm}
              disabled={isLoading || !input.trim()}
              className="rounded-2xl"
            >
              <ArrowUp />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

function PureAttachmentsButton({
  fileInputRef,
  isLoading,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isLoading: boolean;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="rounded-2xl border dark:border-zinc-600"
            onClick={async (e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            disabled={isLoading}
          >
            <Paperclip />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Upload file</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const AttachmentsButton = memo(PureAttachmentsButton);
