"use client";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteChatById } from "@/hooks/use-chats";
import { toast } from "sonner";

export function DeleteChat({
  chatId,
  closeDropdown,
}: {
  chatId: string;
  closeDropdown: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteChatById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });

  const handleDelete = () => {
    try {
      setIsDeleting(true);
      mutation.mutate(chatId);
      router.push("/");
      router.refresh();
      closeDropdown();
    } catch (error) {
      console.error("Failed to delete chat:", error);
      setIsDeleting(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex w-full items-center justify-between px-2 py-1.5">
        <div className="flex w-full items-center gap-2">
          <span className="text-sm">
            {isDeleting ? "Deleting..." : "Absolutely sure?"}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeDropdown();
              }}
              disabled={isDeleting}
              className="hover:bg-muted rounded-sm p-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="hover:bg-destructive/20 text-destructive rounded-sm p-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setConfirming(true)}
      className="flex w-full cursor-pointer items-center gap-2 px-2 py-1.5"
    >
      <Trash2 className="h-4 w-4" />
      <span className="text-sm">Delete</span>
    </div>
  );
}
