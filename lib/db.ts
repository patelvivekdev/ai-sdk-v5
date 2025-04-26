import Dexie, { Table } from "dexie";
import { Message } from "ai";

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: string;
}

class ChatDatabase extends Dexie {
  chats!: Table<ChatSession, string>;

  constructor() {
    super("ChatDatabase");
    this.version(1).stores({
      chats: "id, createdAt",
    });
  }
}

export const db = new ChatDatabase();
