import { cn } from "@/lib/utils";
import { memo } from "react";

function PureTimeStamp({
  id,
  formattedTime,
  isUser,
}: {
  id: string;
  formattedTime: string;
  isUser: boolean;
}) {
  return (
    <time
      key={id}
      dateTime={formattedTime}
      className={cn(
        "text-muted-foreground block px-1 text-sm",
        isUser && "text-right",
      )}
    >
      {formattedTime}
    </time>
  );
}

export const TimeStamp = memo(PureTimeStamp, (prevProps, nextProps) => {
  if (prevProps.id !== nextProps.id) return false;

  return true;
});
