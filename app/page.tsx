import Chat from "@/components/chat";

export const dynamic = "force-dynamic";

export default async function Page() {
  const chatId = crypto.randomUUID();
  return <Chat key={chatId} chatId={chatId} initialMessages={[]} />;
}
