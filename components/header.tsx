import { CreateNewChatButton } from "./create-new-chat";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  return (
    <div className="w-full z-50 fixed top-0 left-0 flex py-2 px-3 items-center justify-between">
      <SidebarTrigger />
      <div className="flex items-center space-x-2">
        <CreateNewChatButton />
        <ThemeToggle />
      </div>
    </div>
  );
};
