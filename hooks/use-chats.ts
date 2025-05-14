import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatSession, db } from "@/lib/db";
import { toast } from "sonner";

export const getChats = async () => {
  return await db.chats.toArray();
};

export const getMessagesById = async (chatId: string) => {
  const chat = await db.chats.get(chatId);
  return chat?.messages || [];
};

export const saveMessages = async (
  chatId: string,
  messages: ChatSession["messages"],
) => {
  const existingChat = await db.chats.get(chatId);

  return await db.chats.put({
    id: chatId,
    messages: [...messages],
    createdAt: existingChat?.createdAt || new Date().toISOString(),
  });
};

export const deleteChatById = async (chatId: string, messageId?: string) => {
  if (messageId) {
    // Delete specific message
    const chat = await db.chats.get(chatId);
    if (chat) {
      const updatedMessages = chat.messages.filter(
        (message) => message.id !== messageId,
      );

      await db.chats.update(chatId, {
        messages: updatedMessages,
      });
    }
  } else {
    // Delete entire chat
    await db.chats.delete(chatId);
  }
};

export const removeChats = async () => {
  return await db.chats.clear();
};
