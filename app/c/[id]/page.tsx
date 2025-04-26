"use client";

import React from "react";
import { notFound, useParams } from "next/navigation";
import useChatStore from "@/hooks/useChatStore";
import Chat from "@/components/chat";

export default function Page() {
  const { id } = useParams() as { id: string };

  const getChatById = useChatStore((state) => state.getChatById);
  const chat = getChatById(id);

  if (!chat) {
    return notFound();
  }

  return <Chat chatId={id} initialMessages={chat.messages} />;
}
