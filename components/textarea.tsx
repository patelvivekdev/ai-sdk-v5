import { modelID } from "@/ai/providers";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Search, Brain, PaperclipIcon, Square } from "lucide-react";
import { ModelPicker } from "./model-picker";
import { Button } from "./ui/button";
import {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface InputProps {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  status: string;
  stop: () => void;
  selectedModel: modelID;
  setSelectedModel: (model: modelID) => void;
  activeButton: "none" | "deepSearch" | "think";
  setActiveButton: Dispatch<SetStateAction<"none" | "deepSearch" | "think">>;
}

interface Attachment {
  name: string;
  contentType: string;
  url: string;
}

// File Upload Overlay Component
const FileUploadOverlay = ({ isDragging }: { isDragging: boolean }) => {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center space-x-2 rounded-xl border border-dashed border-primary bg-background/80 text-sm text-muted-foreground backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <PaperclipIcon className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Attachment Preview Component
const AttachmentPreview = ({
  attachment,
  isUploading,
  onRemove,
}: {
  attachment: Attachment;
  isUploading: boolean;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex items-center gap-2 rounded-md bg-background p-2 text-xs">
      <div className="max-w-32 truncate">{attachment.name}</div>
      {isUploading ? (
        <div className="h-3 w-3 animate-spin rounded-full border-t-2 border-primary"></div>
      ) : (
        onRemove && (
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Remove attachment"
          >
            <Square className="h-3 w-3" />
          </button>
        )
      )}
    </div>
  );
};

// Attachments Button Component
const AttachmentsButton = ({
  fileInputRef,
  isDisabled,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDisabled: boolean;
}) => {
  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fileInputRef.current?.click();
      }}
      variant="outline"
      size="icon"
      className="rounded-full transition-colors flex items-center"
      disabled={isDisabled}
      title="Attach Files"
    >
      <PaperclipIcon className="size-4" />
      <span className="sr-only">Attach</span>
    </Button>
  );
};

export const MultiModalTextarea = ({
  input,
  handleInputChange,
  isLoading,
  status,
  stop,
  selectedModel,
  setSelectedModel,
  activeButton,
  setActiveButton,
}: InputProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadQueue, setUploadQueue] = useState<
    { name: string; id: string }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File handling functions
  const validateFile = useCallback((file: File): boolean => {
    // Check if file is valid and has content
    if (!file || file.size === 0) {
      return false;
    }

    // You can add more validation rules here
    return true;
  }, []);

  const uploadFile = async (
    file: File,
    queueId: string
  ): Promise<Attachment | undefined> => {
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

      // Remove this file from upload queue after successful upload
      setUploadQueue((queue) => queue.filter((item) => item.id !== queueId));

      return attachment;
    } catch (error) {
      // Remove from queue on error too
      setUploadQueue((queue) => queue.filter((item) => item.id !== queueId));
      console.error(`Failed to upload ${file.name}. Please try again.`);
      console.error("File upload error:", error);
      return undefined;
    }
  };

  const handleFiles = useCallback(
    async (files: File[]) => {
      const validFiles = files.filter((file) => {
        const isValid = validateFile(file);
        if (!isValid) {
          console.error(`Unsupported file: ${file.name}`);
          return false;
        }
        return isValid;
      });

      const queueItems = validFiles.map((file) => ({
        name: file.name,
        id: crypto.randomUUID(),
      }));

      setUploadQueue((current) => [...current, ...queueItems]);

      try {
        const uploadPromises = validFiles.map((file, index) =>
          uploadFile(file, queueItems[index].id)
        );
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        ) as Attachment[];

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      }
    },
    [validateFile]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const onAttachmentRemove = (attachment: Attachment) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter(
        (a) => a.name !== attachment.name || a.url !== attachment.url
      )
    );
  };

  const showAttachmentsList = attachments.length > 0 || uploadQueue.length > 0;

  return (
    <div
      className="relative w-full pt-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FileUploadOverlay isDragging={isDragging} />

      {/* Hidden file input */}
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        onChange={handleFileChange}
        tabIndex={-1}
      />

      {/* Attachments preview section */}
      {showAttachmentsList && (
        <div className="bg-muted rounded-t-lg mb-2">
          <div className="flex items-center gap-3 overflow-x-auto p-3 [scrollbar-width:thin]">
            {attachments.map((attachment, index) => (
              <AttachmentPreview
                key={`${attachment.name}-${index}`}
                attachment={attachment}
                isUploading={false}
                onRemove={() => onAttachmentRemove(attachment)}
              />
            ))}
            {uploadQueue.map((item) => (
              <AttachmentPreview
                key={item.id}
                attachment={{
                  url: "",
                  name: item.name,
                  contentType: "",
                }}
                isUploading={true}
              />
            ))}
          </div>
        </div>
      )}

      <Textarea
        className="resize-none min-h-[30px] max-h-[200px] h-30 bg-secondary w-full rounded-2xl pr-12 pt-4 pb-12"
        value={input}
        autoFocus
        placeholder={"Say something..."}
        // @ts-expect-error err
        onChange={handleInputChange}
        onPaste={handlePaste}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              // @ts-expect-error err
              const form = e.target.closest("form");
              if (form) form.requestSubmit();
            }
          }
        }}
      />

      {/* Control bar at the bottom with all elements */}
      <div className="absolute bottom-2 left-0 right-0 px-2 flex items-center justify-between">
        {/* Left side - File Attachment Button */}
        <AttachmentsButton fileInputRef={fileInputRef} isDisabled={isLoading} />

        {/* center - Model picker and utility buttons */}
        <div className="flex items-center space-x-2">
          {/* Model Picker */}
          <div className="w-40">
            <ModelPicker
              setSelectedModel={setSelectedModel}
              selectedModel={selectedModel}
              activeButton={activeButton}
            />
          </div>

          {/* Utility buttons */}
          <Button
            type="button"
            onClick={() => {
              setActiveButton(
                activeButton === "deepSearch" ? "none" : "deepSearch"
              );
            }}
            variant={activeButton === "deepSearch" ? "default" : "outline"}
            className={`rounded-full p-2 transition-colors flex items-center ${
              activeButton === "deepSearch"
            } disabled:bg-zinc-300 disabled:cursor-not-allowed`}
            aria-pressed={activeButton === "deepSearch"}
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
  );
};
