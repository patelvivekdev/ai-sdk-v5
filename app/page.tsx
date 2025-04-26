"use client";

import Chat from "@/components/chat";

export default function Page() {
  const chatId = crypto.randomUUID();
  return <Chat chatId={chatId} initialMessages={[]} />;
}
