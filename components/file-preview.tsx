"use client";

import React, { useState } from "react";
import { FileText, X } from "lucide-react";
import Image from "next/image";
import { Attachment } from "ai";
import { ImageOverlay } from "./ui/image-overlay";
import { Button } from "./ui/button";

type AttachmentPreviewProps = {
  attachment: Attachment;
  onRemove?: () => void;
};

export const AttachmentPreview = ({
  attachment,
  onRemove,
}: AttachmentPreviewProps) => {
  const { contentType } = attachment;

  if (contentType?.startsWith("image/")) {
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
    <div className="relative h-10 w-[150px] shrink-0 group">
      <div
        onClick={() => setImageOverlay(true)}
        className="flex shrink-0 cursor-pointer h-10 border-2 border-neutral-400 dark:border-neutral-600 items-center rounded-2xl w-full gap-1 py-1 pl-1 pr-3 space-x-2"
      >
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
          <Image
            alt={`Attachment ${attachment.name}`}
            className="aspect-square rounded-2xl object-cover"
            src={attachment.url}
            width={32}
            height={32}
          />
        </div>
        <div className="flex truncate flex-col text-sm">{attachment.name}</div>
      </div>
      {imageOverlay && (
        <ImageOverlay
          onClose={handleCloseOverlay}
          imageUrl={attachment.url}
          imageAlt={attachment.name ?? "An image attachment"}
        />
      )}

      {onRemove && (
        <Button
          className="absolute right-2 top-2 cursor-pointer flex size-5 rounded-full opacity-0 group-hover:opacity-100"
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
  return (
    <div className="relative h-12 w-[150px] shrink-0 group">
      <div className="flex h-12 border items-center rounded-lg w-full gap-1 py-1 pl-1 pr-3 shadow-sm">
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-sm">
          <FileText className="size-6 text-red-500" />
        </div>
        <div className="flex flex-col w-full text-muted-foreground truncate">
          <span className="text-sm">{attachment.name}</span>
          <span className="text-xs">{attachment.contentType}</span>
        </div>
      </div>
      {onRemove && (
        <Button
          className="absolute right-2 top-2 cursor-pointer flex size-5 rounded-full opacity-0 group-hover:opacity-100"
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
