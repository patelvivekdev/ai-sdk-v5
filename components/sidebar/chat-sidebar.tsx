"use client";

import { useRouter, usePathname } from "next/navigation";
import { MessageSquare, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useChatStore, { useChats } from "@/hooks/use-chat-store";
import React from "react";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const chats = useChats();
  const handleDelete = useChatStore((state) => state.handleDelete);
  const getMessagesById = useChatStore((state) => state.getMessagesById);

  // Sort chats by createdAt
  const sortedChats = chats?.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Group chats by date sections
  type ChatSession = typeof sortedChats extends (infer T)[] ? T : any;
  type GroupedChats = {
    Today: ChatSession[];
    "Past 7 Days": ChatSession[];
    "Past 30 Days": ChatSession[];
    Older: ChatSession[];
  };
  const groupedChats: GroupedChats = React.useMemo(() => {
    if (!sortedChats)
      return {
        Today: [],
        "Past 7 Days": [],
        "Past 30 Days": [],
        Older: [],
      };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const past7 = new Date(today);
    past7.setDate(today.getDate() - 6);
    const past30 = new Date(today);
    past30.setDate(today.getDate() - 29);

    const sections: GroupedChats = {
      Today: [],
      "Past 7 Days": [],
      "Past 30 Days": [],
      Older: [],
    };

    for (const chat of sortedChats) {
      const chatDate = new Date(chat.createdAt);
      const chatDay = new Date(
        chatDate.getFullYear(),
        chatDate.getMonth(),
        chatDate.getDate(),
      );
      if (chatDay.getTime() === today.getTime()) {
        sections.Today.push(chat);
      } else if (chatDay >= past7 && chatDay < today) {
        sections["Past 7 Days"].push(chat);
      } else if (chatDay >= past30 && chatDay < past7) {
        sections["Past 30 Days"].push(chat);
      } else {
        sections.Older.push(chat);
      }
    }
    return sections;
  }, [sortedChats]);

  // Delete a chat
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    handleDelete(chatId);

    // If we're currently on the deleted chat's page, navigate to home
    if (pathname === `/c/${chatId}`) {
      router.push(`/`);
      router.refresh();
    }
  };

  return (
    <Sidebar className="z-51">
      <SidebarHeader className="border-border flex flex-row items-center justify-between border-b p-3">
        <SidebarTrigger className="block sm:hidden" />
        <div className="hidden sm:block" />

        <div className="flex items-center justify-center gap-2">
          <Image
            src="/gemini.png"
            alt="Gemini Logo"
            width={24}
            height={24}
            unoptimized
            quality={100}
          />
          <div className="text-foreground/90 text-lg font-semibold">
            AISDK + Gemini
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <SidebarGroup className="min-h-0 flex-1">
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!sortedChats || sortedChats.length === 0 ? (
                <div className={`flex items-center justify-center px-4 py-3`}>
                  <div className="border-border/50 bg-background/50 flex w-full items-center gap-3 rounded-md border border-dashed px-3 py-2">
                    <MessageSquare className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground text-xs font-normal">
                      No conversations yet
                    </span>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {Object.entries(groupedChats).map(([section, chats]) =>
                    chats.length > 0 ? (
                      <div key={section} className="mb-2">
                        <div className="text-muted-foreground px-3 py-1 text-xs font-semibold select-none">
                          {section}
                        </div>
                        {chats.map((chat: any) => (
                          <motion.div
                            key={chat.id}
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                asChild
                                tooltip={
                                  isCollapsed
                                    ? chat.messages[0].parts[0].type === "text"
                                      ? chat.messages[0].parts[0].text
                                      : ""
                                    : undefined
                                }
                                data-active={pathname === `/c/${chat.id}`}
                                className={cn(
                                  "hover:bg-primary/10 active:bg-primary/15 mb-1 transition-all",
                                  pathname === `/c/${chat.id}`
                                    ? "bg-secondary/60 hover:bg-secondary/60"
                                    : "",
                                )}
                              >
                                <Link
                                  href={`/c/${chat.id}`}
                                  className="flex w-full items-center justify-between gap-1"
                                  prefetch={true}
                                  onMouseEnter={() => {
                                    getMessagesById(chat.id);
                                  }}
                                  onClick={() => {
                                    setOpenMobile(false);
                                  }}
                                >
                                  <div className="flex min-w-0 flex-1 items-center overflow-hidden pr-2">
                                    <MessageSquare
                                      className={cn(
                                        "h-4 w-4 flex-shrink-0",
                                        pathname === `/c/${chat.id}`
                                          ? "text-foreground"
                                          : "text-muted-foreground",
                                      )}
                                    />
                                    {!isCollapsed && (
                                      <span
                                        className={cn(
                                          "ml-2 truncate text-sm",
                                          pathname === `/c/${chat.id}`
                                            ? "text-foreground font-medium"
                                            : "text-foreground/80",
                                        )}
                                      >
                                        {chat.messages[0].parts[0].type ===
                                        "text"
                                          ? chat.messages[0].parts[0].text
                                          : ""}
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-foreground h-6 w-6 flex-shrink-0"
                                    onClick={(e) =>
                                      handleDeleteChat(chat.id, e)
                                    }
                                    title="Delete chat"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </motion.div>
                        ))}
                      </div>
                    ) : null,
                  )}
                </AnimatePresence>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
