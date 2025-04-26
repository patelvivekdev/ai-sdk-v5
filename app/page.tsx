"use client";

import Chat from "@/components/chat";

export default function Page() {
  const chatId = crypto.randomUUID();
  console.log("chatId", chatId);
  return <Chat chatId={chatId} initialMessages={[]} />;
}
