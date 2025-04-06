import { CreateNewChatButton } from "./create-new-chat";

export const Header = () => {
  return (
    <div className="fixed right-0 z-50 left-0 w-full top-0 bg-secondary py-2 px-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h1 className="text font-bold">AI SDK + Gemini </h1>
      <CreateNewChatButton />
    </div>
  );
};
