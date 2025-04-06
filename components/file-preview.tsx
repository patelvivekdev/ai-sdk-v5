"use client";

import React, { useState } from "react";
import { FileText, LoaderIcon, X } from "lucide-react";
import Image from "next/image";
import { Attachment } from "ai";
import { ImageOverlay } from "./ui/image-overlay";

type AttachmentPreviewProps = {
  attachment: Attachment;
  onRemove?: () => void;
  isUploading?: boolean;
};

export const AttachmentPreview = ({
  attachment,
  onRemove,
  isUploading = false,
}: AttachmentPreviewProps) => {
  const { contentType } = attachment;

  if (contentType?.startsWith("image/")) {
    return (
      <ImageFilePreview
        isUploading={isUploading}
        attachment={attachment}
        onRemove={onRemove}
      />
    );
  }

  if (isUploading) {
    return (
      <div className="relative h-10 w-[150px] shrink-0">
        <div className="flex shrink-0 cursor-pointer h-10 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 items-center rounded-lg w-full gap-1 py-1 pl-1 pr-3 space-x-2 shadow-sm">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-100 text-gray-500">
            <LoaderIcon className="animate-spin" />
          </div>
          <div className="flex truncate flex-col">
            <span className="w-full truncate text-muted-foreground">
              {attachment.name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GenericFilePreview
      attachment={attachment}
      onRemove={onRemove}
      isUploading={isUploading}
    />
  );
};

const ImageFilePreview = ({
  attachment,
  onRemove,
  isUploading,
}: AttachmentPreviewProps) => {
  const [imageOverlay, setImageOverlay] = useState<boolean>(false);

  const handleCloseOverlay = () => {
    setImageOverlay(false);
  };

  return (
    <div className="relative h-10 w-[150px] shrink-0">
      <div
        onClick={() => setImageOverlay(true)}
        className="flex shrink-0 dark:border-gray-600 cursor-pointer h-10 border hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 items-center rounded-lg w-full gap-1 py-1 pl-1 pr-3 space-x-2 shadow-sm"
      >
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-100 text-gray-500">
          <Image
            alt={`Attachment ${attachment.name}`}
            className="border-alpha-400 aspect-square rounded-sm border object-cover"
            src={attachment.url}
            width={32}
            height={32}
          />
        </div>
        <div className="flex truncate flex-col">
          <span className="w-full truncate text-muted-foreground">
            {attachment.name}
          </span>
        </div>
      </div>
      {isUploading && (
        <div className="animate-spin absolute text-zinc-500">
          <LoaderIcon />
        </div>
      )}
      {imageOverlay && (
        <ImageOverlay
          onClose={handleCloseOverlay}
          imageUrl={attachment.url}
          imageAlt={attachment.name ?? "An image attachment"}
        />
      )}

      {onRemove ? (
        <button
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border bg-secondary"
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      ) : null}
    </div>
  );
};

const GenericFilePreview = ({
  attachment,
  onRemove,
  isUploading,
}: AttachmentPreviewProps) => {
  return (
    <div className="relative h-10 w-[150px] shrink-0">
      <div className="flex shrink-0 cursor-pointer h-10 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 items-center rounded-lg w-full gap-1 py-1 pl-1 pr-3 space-x-2 shadow-sm">
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-100 text-gray-500">
          <FileText className="h-6 w-6 text-red-500" />
        </div>
        <div className="flex truncate flex-col">
          <span className="w-full truncate text-muted-foreground">
            {attachment.name}
          </span>
        </div>
      </div>
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoaderIcon className="animate-spin text-zinc-500" />
        </div>
      )}
      {onRemove && (
        <button
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border bg-secondary"
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
};
