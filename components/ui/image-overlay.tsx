"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export const ImageOverlay = ({
  onClose,
  imageUrl,
  imageAlt,
}: {
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl">
      <DialogTitle className="text-2xl font-bold">{imageAlt}</DialogTitle>
      <DialogDescription className="sr-only">
        Full size view of {imageAlt}
      </DialogDescription>
      <div className="relative w-full h-[80vh]">
        <Image
          src={imageUrl}
          alt={`Full size view of ${imageAlt}`}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </DialogContent>
  </Dialog>
);
