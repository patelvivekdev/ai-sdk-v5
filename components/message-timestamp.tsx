import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { memo } from "react";

function PureTimeStamp({
  message,
  formattedTime,
  isUser,
}: {
  message: UIMessage;
  formattedTime: string;
  isUser: boolean;
}) {
  // Convert string timestamp to Date object for ISO string if needed
  const dateTime = message.createdAt
    ? typeof message.createdAt === "string"
      ? message.createdAt
      : message.createdAt.toISOString()
    : undefined;

  return (
    <time
      key={message.id}
      dateTime={dateTime}
      className={cn(
        "block px-1 text-xs opacity-50",
        "animate-in fade-in-0 duration-500",
        isUser && "text-right",
      )}
    >
      {formattedTime}
    </time>
  );
}

export const TimeStamp = memo(PureTimeStamp, (prevProps, nextProps) => {
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.createdAt !== nextProps.message.createdAt) return false;

  return true;
});
