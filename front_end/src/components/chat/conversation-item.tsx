"use client";

import { useTranslations } from "next-intl";
import { Pin, VolumeX, Archive, Trash2, CheckCheck, Check } from "lucide-react";
import { Conversation, User } from "@/types";
import { cn, formatMessageTime, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/use-auth-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useUIStore } from "@/stores/use-ui-store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ConversationItemProps {
  conversation: Conversation;
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const t = useTranslations("chat");
  const activeId = useConversationStore((s) => s.activeConversationId);
  const setActiveId = useConversationStore((s) => s.setActiveConversationId);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const pinConversation = useConversationStore((s) => s.pinConversation);
  const muteConversation = useConversationStore((s) => s.muteConversation);
  const archiveConversation = useConversationStore((s) => s.archiveConversation);
  const deleteConversation = useConversationStore((s) => s.deleteConversation);
  const markAsRead = useConversationStore((s) => s.markAsRead);

  // Find other member if direct chat
  const currentUser = useAuthStore((s) => s.currentUser);

  const isActive = activeId === conversation.id;

  // Render online status dot
  let isOnline = false;
  let isAway = false;

  if (conversation.type === "direct") {
    // In real app, we would fetch other user online state. Mocking it here based on conversation name.
    const otherUserName = conversation.name;
    if (otherUserName === "John Doe" || otherUserName === "Michael Chen") {
      isOnline = true;
    } else if (otherUserName === "Emma Wilson") {
      isAway = true;
    }
  }

  const handleSelect = () => {
    setActiveId(conversation.id);
    setMobileSidebarOpen(false); // Close mobile sidebar to show chat screen
  };

  const getAvatarFallBack = () => {
    return getInitials(conversation.name);
  };

  const renderLastMessageContent = () => {
    if (!conversation.lastMessage) return "";
    const msg = conversation.lastMessage;

    if (msg.isDeleted) {
      return <span className="italic text-muted-foreground/80">{msg.content}</span>;
    }

    const prefix = msg.senderId === currentUser?.id ? "You: " : `${msg.senderName.split(" ")[0]}: `;

    switch (msg.type) {
      case "image":
        return <span className="text-muted-foreground font-medium">📷 Photo</span>;
      case "file":
        return <span className="text-muted-foreground font-medium">📄 File: {msg.fileMetadata?.name}</span>;
      case "call":
        return <span className="text-muted-foreground font-medium">📞 Call</span>;
      default:
        return `${prefix}${msg.content}`;
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <button
          onClick={handleSelect}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200 cursor-pointer",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground hover:bg-muted/70"
          )}
        >
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11 border border-border/20">
              {conversation.avatar ? (
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
              ) : null}
              <AvatarFallback className={cn(isActive && "bg-primary-foreground/10 text-primary-foreground")}>
                {getAvatarFallBack()}
              </AvatarFallback>
            </Avatar>

            {/* Status dot */}
            {conversation.type === "direct" && (
              <span
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                  isOnline && "bg-emerald-500",
                  isAway && "bg-amber-500",
                  !isOnline && !isAway && "bg-slate-400"
                )}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={cn("text-sm font-semibold truncate", isActive ? "text-primary-foreground" : "text-foreground")}>
                {conversation.name}
              </span>
              <span className={cn("text-[10px] whitespace-nowrap pl-2", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {conversation.lastMessage
                  ? formatMessageTime(conversation.lastMessage.timestamp)
                  : ""}
              </span>
            </div>

            <div className="flex items-center justify-between mt-0.5">
              <p className={cn("text-xs truncate max-w-[160px]", isActive ? "text-primary-foreground/90" : "text-muted-foreground")}>
                {renderLastMessageContent()}
              </p>

              <div className="flex items-center gap-1.5 pl-2">
                {conversation.isMuted && (
                  <VolumeX className={cn("h-3 w-3 shrink-0", isActive ? "text-primary-foreground/85" : "text-muted-foreground/60")} />
                )}
                {conversation.isPinned && (
                  <Pin className={cn("h-3 w-3 shrink-0 rotate-45", isActive ? "text-primary-foreground/85" : "text-muted-foreground/60")} />
                )}
                {conversation.unreadCount > 0 && (
                  <Badge variant="destructive" className="h-4.5 min-w-4.5 px-1 py-0 flex items-center justify-center text-[10px] font-bold rounded-full">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => markAsRead(conversation.id)} className="gap-2">
          <CheckCheck className="h-4 w-4" />
          <span>{t("markAsRead")}</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => pinConversation(conversation.id)} className="gap-2">
          <Pin className="h-4 w-4" />
          <span>{conversation.isPinned ? t("unpin") : t("pin")}</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => muteConversation(conversation.id)} className="gap-2">
          <VolumeX className="h-4 w-4" />
          <span>{conversation.isMuted ? t("unmute") : t("mute")}</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => archiveConversation(conversation.id)} className="gap-2">
          <Archive className="h-4 w-4" />
          <span>{t("archive")}</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => deleteConversation(conversation.id)}
          className="text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t("delete")}</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
