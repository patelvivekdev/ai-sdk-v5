import Dexie, { Table } from "dexie";
import { UIMessage } from "ai";
import { ExampleMetadata } from "@/ai/metadata-schema";

export interface ChatSession {
  id: string;
  chatName: string;
  messages: UIMessage<ExampleMetadata>[];
  createdAt: string;
}

export class ChatDatabase extends Dexie {
  chats!: Table<ChatSession, string>;

  constructor() {
    super("ai-sdk-v5");
    this.version(1).stores({
      chats: "id, chatName, createdAt",
    });
  }
}

export const db = new ChatDatabase();
