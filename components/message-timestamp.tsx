import { cn } from "@/lib/utils";
import { Message } from "ai";
import { memo } from "react";

function PureTimeStamp({
  message,
  formattedTime,
  isUser,
}: {
  message: Message;
  formattedTime: string;
  isUser: boolean;
}) {
  return (
    <time
      key={message.id}
      dateTime={message.createdAt?.toISOString()}
      className={cn(
        "block px-1 text-xs opacity-50",
        "duration-500 animate-in fade-in-0",
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
