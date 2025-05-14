"use client";

import { useParams } from "next/navigation";
import Chat from "@/components/chat";
import { getMessagesById } from "@/hooks/use-chats";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { id } = useParams() as { id: string };

  const { isPending, data: initialMessages } = useQuery({
    queryKey: ["chats", id],
    queryFn: () => getMessagesById(id),
  });

  if (isPending) {
    return <Loading />;
  }

  return <Chat chatId={id} initialMessages={initialMessages || []} />;
}

export function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-500 dark:border-zinc-700 dark:border-t-zinc-300"></div>
        <p className="mt-4 text-lg font-medium text-zinc-600 dark:text-zinc-400">
          Loading chat...
        </p>
      </div>
    </div>
  );
}
