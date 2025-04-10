"use client";

import type { Message as TMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import equal from "fast-deep-equal";

import { MarkdownContent } from "./markdown";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { SpinnerIcon } from "./icons";
import { SourcePreview } from "./source-preview";
import { Button } from "./ui/button";
import { AttachmentPreview } from "./file-preview";
import { cx } from "class-variance-authority";

interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
  details: Array<{ type: "text"; text: string }>;
}

interface ReasoningMessagePartProps {
  part: ReasoningPart;
  isReasoning: boolean;
}

export function ReasoningMessagePart({
  part,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Save current scroll position for restoration
  const scrollPositionRef = useRef(0);
  // Track thinking time
  const [thinkingTime, setThinkingTime] = useState(0);
  const thinkingStartRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
    },
    expanded: {
      height: "auto",
      opacity: 1,
      overflow: "hidden",
    },
  };

  // Initialize thinking time counter when reasoning starts
  useEffect(() => {
    if (isReasoning && !thinkingStartRef.current) {
      thinkingStartRef.current = Date.now();

      // Set up interval to update thinking time
      intervalRef.current = setInterval(() => {
        if (thinkingStartRef.current) {
          const elapsedSeconds = (Date.now() - thinkingStartRef.current) / 1000;
          setThinkingTime(elapsedSeconds);
        }
      }, 100); // Update every 100ms for smooth counter
    } else if (!isReasoning && thinkingStartRef.current) {
      // Stop timer when reasoning is complete
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Calculate final thinking time
      if (thinkingStartRef.current) {
        const finalTime = (Date.now() - thinkingStartRef.current) / 1000;
        setThinkingTime(finalTime);
        thinkingStartRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isReasoning]);

  const memoizedSetIsExpanded = useCallback((value: boolean) => {
    setIsExpanded(value);
  }, []);

  useEffect(() => {
    memoizedSetIsExpanded(isReasoning);
  }, [isReasoning, memoizedSetIsExpanded]);

  // Create a ref to measure the content height
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Save current scroll position
      scrollPositionRef.current = window.scrollY;

      // Toggle the expanded state
      setIsExpanded(!isExpanded);

      // Restore scroll position after animation completes
      setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "auto",
        });
      }, 300); // Slightly longer than the animation duration
    },
    [isExpanded],
  );

  const formattedTime = thinkingTime.toFixed(1);

  return (
    <div className="flex flex-col">
      <div className={cn("flex items-center")}>
        {isReasoning ? (
          <div className="flex items-center">
            <Button className="rounded-full text-sm flex items-center gap-1.5">
              <span>Thinking</span>
              <div className="animate-spin">
                <SpinnerIcon />
              </div>
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Button
              className="rounded-full text-sm flex items-center gap-1.5"
              onClick={handleToggle}
            >
              <span>Thought for {formattedTime} seconds</span>
              <ChevronDownIcon
                className={cn("h-4 w-4 transition-transform", {
                  "transform rotate-180": !isExpanded,
                })}
              />
            </Button>
          </div>
        )}
      </div>
      <div className="overflow-hidden ml-2">
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="reasoning"
              ref={contentRef}
              className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l-2 dark:border-zinc-800 border-zinc-200 mt-3 px-2"
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={variants}
              transition={{
                duration: 0.25,
                ease: [0.04, 0.62, 0.23, 0.98],
                opacity: { duration: 0.15 },
              }}
            >
              {part.details.map((detail, detailIndex) =>
                detail.type === "text" ? (
                  <MarkdownContent
                    key={detailIndex}
                    content={detail.text}
                    id={detailIndex.toString()}
                  />
                ) : (
                  "<redacted>"
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const PurePreviewMessage = ({
  message,
  status,
}: {
  message: TMessage;
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
}) => {
  const attachments = message.experimental_attachments;
  const sources = message.parts?.filter((part) => part.type === "source");
  return (
    <AnimatePresence key={message.id}>
      <motion.div
        className="w-full mx-auto px-4 group/message mt-2"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={`message-${message.id}`}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            "group-data-[role=user]/message:w-fit",
          )}
        >
          {/* {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="">
                <SparklesIcon size={14} />
              </div>
            </div>
          )} */}

          <div className="flex flex-col w-full space-y-4">
            {attachments && attachments?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {attachments.map((attachment) => (
                  <AttachmentPreview
                    attachment={attachment}
                    key={attachment.url}
                  />
                ))}
              </div>
            )}
            {message.parts?.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <motion.div
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      key={`message-${message.id}-part-${i}`}
                      className="flex flex-row gap-2 items-start w-full pb-4"
                    >
                      <div
                        className={cn("flex flex-col gap-4", {
                          "bg-secondary text-secondary-foreground px-3 py-2 rounded-tl-xl rounded-tr-xl rounded-bl-xl":
                            message.role === "user",
                        })}
                      >
                        <MarkdownContent id={message.id} content={part.text} />
                      </div>
                    </motion.div>
                  );
                case "reasoning":
                  return (
                    <ReasoningMessagePart
                      key={`message-${message.id}-${i}`}
                      // @ts-expect-error part
                      part={part}
                      isReasoning={
                        (message.parts &&
                          status === "streaming" &&
                          i === message.parts.length - 1) ??
                        false
                      }
                    />
                  );
                default:
                  return null;
              }
            })}
            {sources && sources.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {sources.map((source) => (
                  <SourcePreview key={source.source.id} source={source} />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Message = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.message.annotations !== nextProps.message.annotations)
    return false;
  // if (prevProps.message.content !== nextProps.message.content) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

  return true;
});

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl mt-2 px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div
        className={cx(
          "flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl",
          {
            "group-data-[role=user]/message:bg-muted": true,
          },
        )}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-4 text-muted-foreground">
            Thinking...
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SparklesIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width={size}
    style={{ color: "currentcolor" }}
  >
    <path
      d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
      fill="currentColor"
    />
    <path
      d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
      fill="currentColor"
    />
    <path
      d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
      fill="currentColor"
    />
  </svg>
);
