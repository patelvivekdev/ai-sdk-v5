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
import useChatStore from "@/hooks/useChatStore";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const chats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);

  // Sort chats by createdAt
  const sortedChats = Object.keys(chats).sort((a, b) => {
    return (
      new Date(chats[b].createdAt).getTime() -
      new Date(chats[a].createdAt).getTime()
    );
  });

  const chatsIds = sortedChats;

  // Delete a chat
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    handleDelete(chatId);

    // If we're currently on the deleted chat's page, navigate to home
    if (pathname === `/c/${chatId}`) {
      router.push("/");
    }
  };

  return (
    <Sidebar className="z-51">
      <SidebarHeader className="p-3 border-b border-border flex flex-row items-center justify-between">
        <SidebarTrigger />
        <div className="flex items-center gap-2 justify-center">
          <Image
            src="/gemini.png"
            alt="Gemini Logo"
            width={24}
            height={24}
            unoptimized
            quality={100}
          />
          <div className="font-semibold text-lg text-foreground/90">
            AISDK + Gemini
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <SidebarGroup className="flex-1 min-h-0">
          <SidebarGroupLabel>Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatsIds.length === 0 ? (
                <div className={`flex items-center justify-center py-3 px-4`}>
                  <div className="flex items-center gap-3 w-full px-3 py-2 rounded-md border border-dashed border-border/50 bg-background/50">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-normal">
                      No conversations yet
                    </span>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {chatsIds.map((chatId) => (
                    <motion.div
                      key={chatId}
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
                              ? chats[chatId].messages[0].content
                              : undefined
                          }
                          data-active={pathname === `/c/${chatId}`}
                          className={cn(
                            "transition-all hover:bg-primary/10 active:bg-primary/15",
                            pathname === `/c/${chatId}`
                              ? "bg-secondary/60 hover:bg-secondary/60"
                              : "",
                          )}
                        >
                          <Link
                            href={`/c/${chatId}`}
                            className="flex items-center justify-between w-full gap-1"
                          >
                            <div className="flex items-center min-w-0 overflow-hidden flex-1 pr-2">
                              <MessageSquare
                                className={cn(
                                  "h-4 w-4 flex-shrink-0",
                                  pathname === `/c/${chatId}`
                                    ? "text-foreground"
                                    : "text-muted-foreground",
                                )}
                              />
                              {!isCollapsed && (
                                <span
                                  className={cn(
                                    "ml-2 truncate text-sm",
                                    pathname === `/c/${chatId}`
                                      ? "text-foreground font-medium"
                                      : "text-foreground/80",
                                  )}
                                  title={chats[chatId].messages[0].content}
                                >
                                  {chats[chatId].messages[0].content.length > 18
                                    ? `${chats[chatId].messages[0].content.slice(0, 18)}...`
                                    : chats[chatId].messages[0].content}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
                              onClick={(e) => handleDeleteChat(chatId, e)}
                              title="Delete chat"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
