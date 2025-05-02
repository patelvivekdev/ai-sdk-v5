"use client";
import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  content: string;
  copyMessage?: string;
  className?: string;
  asChild?: boolean;
};

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className, content, asChild, ...props }, ref) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();
    return (
      <Button
        ref={ref}
        variant="outline"
        size="icon"
        className={cn(
          "text-muted-foreground relative h-fit px-2 py-1",
          className,
        )}
        asChild={asChild}
        {...props}
        aria-label="Copy to clipboard"
        onClick={() => copyToClipboard(content)}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Check
            className={cn(
              "h-4 w-4 text-teal-600 transition-transform ease-in-out",
              isCopied ? "scale-100" : "scale-0",
            )}
          />
        </div>
        <Copy
          className={cn(
            "h-4 w-4 transition-transform ease-in-out",
            isCopied ? "scale-0" : "scale-100",
          )}
        />
      </Button>
    );
  },
);
CopyButton.displayName = "CopyButton";

export { CopyButton };
