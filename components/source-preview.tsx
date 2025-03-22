import { Badge } from "@/components/ui/badge";
import { SourceUIPart } from "@ai-sdk/ui-utils";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

export function SourcePreview({ source }: { source: SourceUIPart }) {
  return (
    <Link
      href={source.source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <Badge
        variant="outline"
        className="px-2 py-1 gap-1.5 hover:bg-muted/50 transition-colors"
      >
        <LinkIcon size={12} />
        <span className="text-sm">{source.source.title}</span>
      </Badge>
    </Link>
  );
}
