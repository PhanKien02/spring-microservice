"use client";

import { useAuthStore } from "@/stores/use-auth-store";
import { useConversationStore } from "@/stores/use-conversation-store";

interface ReactionPickerProps {
  messageId: string;
  onSelect?: () => void;
}

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "👏"];

export function ReactionPicker({ messageId, onSelect }: ReactionPickerProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const addReaction = useConversationStore((s) => s.addReaction);
  const removeReaction = useConversationStore((s) => s.removeReaction);
  const activeConversationId = useConversationStore((s) => s.activeConversationId);
  const messages = useConversationStore((s) => s.messages);

  const chatMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const message = chatMessages.find((m) => m.id === messageId);

  const handleToggleEmoji = (emoji: string) => {
    if (!currentUser) return;

    const reaction = message?.reactions?.find((r) => r.emoji === emoji);
    const hasReacted = reaction?.userIds.includes(currentUser.id);

    if (hasReacted) {
      removeReaction(messageId, emoji, currentUser.id);
    } else {
      addReaction(messageId, emoji, currentUser.id);
    }

    if (onSelect) onSelect();
  };

  return (
    <div className="flex items-center gap-1 bg-popover border border-border/80 px-2 py-1.5 rounded-full shadow-md animate-in fade-in zoom-in duration-200">
      {QUICK_REACTIONS.map((emoji) => {
        const reaction = message?.reactions?.find((r) => r.emoji === emoji);
        const isSelected = reaction?.userIds.includes(currentUser?.id || "");

        return (
          <button
            key={emoji}
            onClick={() => handleToggleEmoji(emoji)}
            className={`flex items-center justify-center h-7 w-7 text-base rounded-full hover:bg-muted/70 active:scale-75 transition-all cursor-pointer ${isSelected ? "bg-primary/10 border border-primary/20 scale-105" : ""
              }`}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  );
}

