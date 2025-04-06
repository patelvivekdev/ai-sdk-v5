import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { ArrowUp, Search, Brain, Paperclip } from "lucide-react";
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
import { Attachment } from "ai";
import { useAutosizeTextArea } from "@/hooks/use-autosize-textarea";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { AttachmentPreview } from "./file-preview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface InputProps {
  chatId: string;
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  activeButton: "none" | "search" | "think";
  setActiveButton: Dispatch<SetStateAction<"none" | "search" | "think">>;
}

export const MultiModalTextarea = ({
  chatId,
  selectedModel,
  setSelectedModel,
  activeButton,
  setActiveButton,
}: InputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null!);

  const { input, handleInputChange, handleSubmit, status, stop } = useChat({
    id: chatId,
    body: {
      selectedModel: selectedModel.id,
    },
  });

  const isLoading = status === "streaming" || status === "submitted";
  const [attachment, setAttachment] = useState<Attachment | undefined>(
    undefined
  );

  // File upload
  const uploadFile = async (file: File): Promise<Attachment | undefined> => {
    try {
      const reader = new FileReader();

      const attachment: Promise<Attachment> = new Promise((resolve, reject) => {
        reader.onload = () => {
          let contentType = file.type;

          // Handle special file types
          if (!contentType) {
            const extension = file.name.split(".").pop()?.toLowerCase();
            switch (extension) {
              case "pdf":
                contentType = "application/pdf";
                break;
              case "md":
                contentType = "text/markdown";
                break;
              default:
                contentType = "application/octet-stream";
            }
          }

          resolve({
            name: file.name,
            contentType,
            url: reader.result as string,
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );

      if (validFiles.length === 0) {
        toast.error("Please select a valid image file or PDF file.");
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

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachment ? [attachment] : [],
    });
    setAttachment(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [attachment, handleSubmit]);

  return (
    <div className="relative w-full">
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        onChange={handleFileChange}
        tabIndex={-1}
      />
      {attachment && (
        <div className="overflow-hidden">
          <AttachmentPreview
            attachment={attachment}
            onRemove={() => setAttachment(undefined)}
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <ShadcnTextarea
          className="resize-none w-full p-2 border-0 shadow-none border-none focus-visible:ring-0 focus-visible:outline-none"
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
        <div className="flex flex-row justify-between items-center">
          {selectedModel.vision ? (
            <div className="flex items-center gap-2">
              <AttachmentsButton
                fileInputRef={fileInputRef}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div></div>
          )}
          {/* center - Model picker and utility buttons */}
          <div className="flex items-center space-x-2 px-2">
            {/* Utility buttons */}
            <Button
              type="button"
              onClick={() => {
                setActiveButton(activeButton === "search" ? "none" : "search");
              }}
              variant={activeButton === "search" ? "default" : "outline"}
              className={`rounded-full p-2 transition-colors flex items-center ${
                activeButton === "search"
              } disabled:bg-zinc-300 disabled:cursor-not-allowed`}
              aria-pressed={activeButton === "search"}
              title="Deep Search"
            >
              <Search className="size-4 " />
              <span className="ml-1.5 hidden sm:inline text-xs">Search</span>
            </Button>

            <Button
              type="button"
              onClick={() => {
                setActiveButton(activeButton === "think" ? "none" : "think");
              }}
              variant={activeButton === "think" ? "default" : "outline"}
              className={`rounded-full p-2 transition-colors flex items-center ${
                activeButton === "think"
              } disabled:bg-zinc-300 disabled:cursor-not-allowed`}
              aria-pressed={activeButton === "think"}
              title="Think"
            >
              <Brain className="size-4 " />
              <span className="ml-1.5 hidden sm:inline text-xs">Think</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {/* Model Picker */}
            <div className="w-40 sm:w-56">
              <ModelPicker
                setSelectedModel={setSelectedModel}
                selectedModel={selectedModel}
                activeButton={activeButton}
              />
            </div>

            {/* Right side - Submit/Stop button */}
            {status === "streaming" || status === "submitted" ? (
              <Button
                type="button"
                onClick={stop}
                size="icon"
                className="cursor-pointer rounded-full bg-zinc-800 hover:bg-black disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
              >
                <div className="animate-spin h-4 w-4">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
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
                disabled={isLoading || !input.trim()}
                className="rounded-full p-2 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 dark:disabled:opacity-80 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUp className="size-4 text-white" />
              </Button>
            )}
          </div>
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
            className="rounded-full h-fit border dark:border-zinc-600"
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
