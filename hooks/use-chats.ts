import { ChatSession, db } from "@/lib/db";

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

  let chatName = "";
  if (existingChat?.chatName) {
    chatName = existingChat.chatName;
  } else if (messages[0].role === "user") {
    console.log("messages", messages);
    const textPart = messages[0].parts.find((part) => part.type === "text");
    console.log("textPart", textPart);
    if (textPart) {
      chatName = textPart.text;
    }
  } else {
    chatName = "New Chat";
  }

  return await db.chats.put({
    id: chatId,
    chatName,
    messages: [...messages],
    createdAt: existingChat?.createdAt || new Date().toISOString(),
  });
};

export const deleteMessageById = async (chatId: string, messageId: string) => {
  const chat = await db.chats.get(chatId);
  if (chat) {
    const updatedMessages = chat.messages.filter(
      (message) => message.id !== messageId,
    );

    // Delete chat if the last message is assistant
    if (
      updatedMessages.length === 1 &&
      updatedMessages[0].role === "assistant"
    ) {
      await deleteChatById(chatId);
      return;
    }

    // Delete chat if no messages left
    if (updatedMessages.length === 0) {
      await deleteChatById(chatId);
    } else {
      await saveMessages(chatId, updatedMessages);
    }
  }
};

export const deleteChatById = async (chatId: string) => {
  await db.chats.delete(chatId);
};

export const removeChats = async () => {
  return await db.chats.clear();
};
