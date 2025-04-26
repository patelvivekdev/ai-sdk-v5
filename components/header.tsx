import Link from "next/link";
import { CreateNewChatButton } from "./create-new-chat";
import { ThemeToggle } from "./theme-toggle";
export const Header = () => {
  return (
    <div className="fixed right-0 z-50 left-0 w-full top-0 bg-secondary py-2 px-3 border-b flex items-center justify-between">
      <Link href="/" className="text font-bold">
        AI SDK + Gemini{" "}
      </Link>
      <div className="flex items-center space-x-2">
        <CreateNewChatButton />
        <ThemeToggle />
      </div>
    </div>
  );
};
