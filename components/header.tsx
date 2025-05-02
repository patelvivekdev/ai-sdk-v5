import { CreateNewChatButton } from "./create-new-chat";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  return (
    <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-3 py-2">
      <SidebarTrigger />
      <div className="flex items-center space-x-2">
        <CreateNewChatButton />
        <ThemeToggle />
      </div>
    </div>
  );
};
