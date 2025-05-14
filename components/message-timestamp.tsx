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
  // Convert string timestamp to Date object for ISO string if needed
  const dateTime = formattedTime;

  return (
    <time
      key={id}
      dateTime={dateTime}
      className={cn(
        "text-muted-foreground block px-1",
        "animate-in fade-in-0 duration-500",
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
