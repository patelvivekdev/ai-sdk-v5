import { UIMessage } from "ai";
import { create } from "zustand";
import { useLiveQuery } from "dexie-react-hooks";
import { ChatSession, db } from "@/lib/db";
import { ExampleMetadata } from "@/ai/metadata-schema";

interface State {
  selectedModel: string | null;
}

interface Actions {
  setSelectedModel: (selectedModel: string) => void;
  getChatById: (chatId: string) => Promise<ChatSession | undefined>;
  getMessagesById: (chatId: string) => Promise<UIMessage<ExampleMetadata>[]>;
  saveMessages: (
    chatId: string,
    messages: UIMessage<ExampleMetadata>[],
  ) => Promise<void>;
  handleDelete: (chatId: string, messageId?: string) => Promise<void>;
}

// Store only in-memory state in Zustand
const useChatStore = create<State & Actions>()((set) => ({
  selectedModel: null,

  setSelectedModel: (selectedModel) => set({ selectedModel }),

  getChatById: async (chatId) => {
    return await db.chats.get(chatId);
  },

  getMessagesById: async (chatId) => {
    const chat = await db.chats.get(chatId);
    return chat?.messages || [];
  },

  saveMessages: async (chatId, messages) => {
    const existingChat = await db.chats.get(chatId);

    await db.chats.put({
      id: chatId,
      messages: [...messages],
      createdAt: existingChat?.createdAt || new Date().toISOString(),
    });
  },

  handleDelete: async (chatId, messageId) => {
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
  },
}));

// Helper hooks for using Dexie live queries with the store
export const useChats = () => {
  return useLiveQuery(() => db.chats.toArray());
};

export const useChatById = (chatId: string | null) => {
  return useLiveQuery(
    () => (chatId ? db.chats.get(chatId) : undefined),
    [chatId],
  );
};

export default useChatStore;
