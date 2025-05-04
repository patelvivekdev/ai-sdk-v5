import Dexie, { Table } from "dexie";
import { UIMessage } from "ai";

export interface ChatSession {
  id: string;
  messages: UIMessage[];
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
