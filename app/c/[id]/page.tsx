"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useChatStore from "@/hooks/useChatStore";
import Chat from "@/components/chat";
import { UIMessage } from "ai";
import Loading from "./loading";

export default function Page() {
  const { id } = useParams() as { id: string };
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const getChatById = useChatStore((state) => state.getChatById);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchChat = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const chat = await getChatById(id);
      setInitialMessages(chat?.messages || []);
      setIsLoading(false);
    };
    fetchChat();
  }, [getChatById, id]);

  if (isLoading) {
    return <Loading />;
  }

  return <Chat chatId={id} initialMessages={initialMessages} />;
}
