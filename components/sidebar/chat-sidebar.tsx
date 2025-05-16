"use client";

import { useRouter, usePathname } from "next/navigation";
import { MessageSquarePlus, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { getMessagesById, getChats, removeChats } from "@/hooks/use-chats";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { SpinnerIcon } from "../icons";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DeleteChat } from "./delete-chat";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ChatSession } from "@/lib/db";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isPending, data: chats } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  const removeMutation = useMutation({
    mutationFn: removeChats,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: () => {
      toast.error("Failed to remove chats");
    },
  });
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);

  // Sort chats by createdAt
  const sortedChats = chats?.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
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

  const handleRemoveChats = () => {
    removeMutation.mutate();
    toast.success("Chats removed");

    router.push(`/`);
    router.refresh();
    setOpenDeleteAll(false);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex flex-row items-center justify-between p-3">
          <SidebarTrigger className="block sm:hidden" />
          <div className="hidden sm:block" />

          <div className="text-foreground/90 text-lg font-semibold">
            AISDK V5 Demo
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup className="h-full">
            <SidebarGroupLabel className="px-2 py-1 text-sm font-semibold select-none">
              Previous Chats
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex h-[calc(100%-2rem)] flex-col">
              {isPending ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-3 text-center">
                  <span className="animate-spin">
                    <SpinnerIcon size={20} />
                  </span>
                  <span className="text-muted-foreground text-base font-normal">
                    Loading chats...
                  </span>
                </div>
              ) : !sortedChats || sortedChats.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-3 text-center">
                  <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                    <MessageSquarePlus className="text-muted-foreground h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">No conversations yet</h4>
                    <p className="text-muted-foreground text-sm">
                      Start a new chat to begin a conversation
                    </p>
                  </div>
                </div>
              ) : (
                <SidebarMenu>
                  <AnimatePresence initial={false}>
                    {Object.entries(groupedChats).map(([section, chats]) =>
                      chats.length > 0 ? (
                        <div key={section} className="mb-2">
                          <div className="text-muted-foreground px-2 py-1 text-xs font-semibold select-none">
                            {section}
                          </div>
                          {chats.map((chat) => (
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
                                      queryClient.prefetchQuery({
                                        queryKey: ["chats", chat.id],
                                        queryFn: () => getMessagesById(chat.id),
                                      });
                                    }}
                                    onClick={() => {
                                      setOpenMobile(false);
                                    }}
                                  >
                                    <div className="flex min-w-0 flex-1 items-center overflow-hidden pr-2">
                                      {!isCollapsed && (
                                        <span
                                          className={cn(
                                            "truncate text-sm",
                                            pathname === `/c/${chat.id}`
                                              ? "text-foreground font-medium"
                                              : "text-foreground/80",
                                          )}
                                        >
                                          {chat.chatName}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                </SidebarMenuButton>
                                <DropdownMenu
                                  open={openDropdown === chat.id}
                                  onOpenChange={(open) => {
                                    setOpenDropdown(open ? chat.id : null);
                                  }}
                                >
                                  <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction>
                                      <MoreHorizontal />
                                    </SidebarMenuAction>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      asChild
                                      className="focus:bg-background p-0"
                                    >
                                      <DeleteChat
                                        chatId={chat.id}
                                        closeDropdown={() =>
                                          setOpenDropdown(null)
                                        }
                                      />
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </SidebarMenuItem>
                            </motion.div>
                          ))}
                        </div>
                      ) : null,
                    )}
                  </AnimatePresence>
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Separator />
        <SidebarFooter>
          <Button
            variant="destructive"
            className="w-full"
            disabled={removeMutation.isPending}
            onClick={() => setOpenDeleteAll(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove All Chats
          </Button>
        </SidebarFooter>
      </Sidebar>
      <Dialog open={openDeleteAll} onOpenChange={setOpenDeleteAll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove All Chats</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove all chats?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={removeMutation.isPending}
              onClick={handleRemoveChats}
            >
              Remove All Chats
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
