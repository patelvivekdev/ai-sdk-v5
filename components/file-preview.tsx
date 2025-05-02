"use client";

import React, { useState } from "react";
import { FileText, X, File, FileCode, FileType } from "lucide-react";
import Image from "next/image";
import { FileUIPart } from "ai";
import { ImageOverlay } from "./ui/image-overlay";
import { Button } from "./ui/button";

type AttachmentPreviewProps = {
  attachment: FileUIPart;
  onRemove?: () => void;
};

export const AttachmentPreview = ({
  attachment,
  onRemove,
}: AttachmentPreviewProps) => {
  const { mediaType } = attachment;

  if (mediaType?.startsWith("image/")) {
    return <ImageFilePreview attachment={attachment} onRemove={onRemove} />;
  }

  return <GenericFilePreview attachment={attachment} onRemove={onRemove} />;
};

const ImageFilePreview = ({ attachment, onRemove }: AttachmentPreviewProps) => {
  const [imageOverlay, setImageOverlay] = useState<boolean>(false);

  const handleCloseOverlay = () => {
    setImageOverlay(false);
  };

  return (
    <div className="group relative h-10 w-[150px] shrink-0">
      <div
        onClick={() => setImageOverlay(true)}
        className="flex h-10 w-full shrink-0 cursor-pointer items-center gap-1 space-x-2 rounded-2xl border-2 border-neutral-400 py-1 pr-3 pl-1 dark:border-neutral-600"
      >
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
          <Image
            alt={`Attachment ${attachment.filename}`}
            className="aspect-square rounded-2xl object-cover"
            src={attachment.url}
            width={32}
            height={32}
          />
        </div>
        <div className="flex flex-col truncate text-sm">
          {attachment.filename}
        </div>
      </div>
      {imageOverlay && (
        <ImageOverlay
          onClose={handleCloseOverlay}
          imageUrl={attachment.url}
          imageAlt={attachment.filename ?? "An image attachment"}
        />
      )}

      {onRemove && (
        <Button
          className="absolute top-2 right-2 flex size-5 cursor-pointer rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          type="button"
          size="icon"
          variant="default"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="size-5" />
        </Button>
      )}
    </div>
  );
};

const GenericFilePreview = ({
  attachment,
  onRemove,
}: AttachmentPreviewProps) => {
  // Get file extension from filename or try to determine from mediaType
  const getFileExtension = (filename: string | undefined): string => {
    if (!filename) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
  };

  const renderFileIcon = () => {
    const extension = getFileExtension(attachment.filename);
    const { mediaType } = attachment;

    if (mediaType === "application/pdf" || extension === "pdf") {
      return <FileType className="size-6 text-red-500" />;
    } else if (mediaType === "text/markdown" || extension === "md") {
      return <FileCode className="size-6 text-blue-500" />;
    } else if (mediaType === "text/plain" || extension === "txt") {
      return <FileText className="size-6 text-gray-500" />;
    } else {
      return <File className="size-6 text-gray-500" />;
    }
  };

  return (
    <div className="group relative h-12 w-[150px] shrink-0">
      <div className="flex h-12 w-full items-center gap-1 rounded-2xl border-2 border-neutral-400 py-1 pr-3 pl-1 dark:border-neutral-600">
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-2xl">
          {renderFileIcon()}
        </div>
        <div className="text-muted-foreground flex w-full flex-col truncate">
          <span className="text-sm font-medium">{attachment.filename}</span>
          <span className="text-xs opacity-70">
            {getFileExtension(attachment.filename).toUpperCase()} file
          </span>
        </div>
      </div>
      {onRemove && (
        <Button
          className="absolute top-2 right-2 flex size-5 cursor-pointer rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          type="button"
          size="icon"
          variant="default"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="size-5" />
        </Button>
      )}
    </div>
  );
};
