"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  CornerUpLeft,
  Smile,
  Copy,
  Forward,
  Edit2,
  Trash2,
  AlertTriangle,
  MoreHorizontal,
  CheckCheck,
} from "lucide-react";
import { Message } from "@/types";
import { cn, formatDetailedTime, formatMessageTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/use-auth-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { ImageMessage } from "./image-message";
import { FileMessage } from "./file-message";
import { ReactionPicker } from "./reaction-picker";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  showSenderHeader: boolean;
}

export function MessageItem({ message, showSenderHeader }: MessageItemProps) {
  const t = useTranslations("chat");
  const commonT = useTranslations("common");

  const currentUser = useAuthStore((s) => s.currentUser);

  const setReplyingToMessage = useConversationStore((s) => s.setReplyingToMessage);
  const editMessage = useConversationStore((s) => s.editMessage);
  const deleteMessage = useConversationStore((s) => s.deleteMessage);
  const addReaction = useConversationStore((s) => s.addReaction);
  const removeReaction = useConversationStore((s) => s.removeReaction);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(message.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isReactionOpen, setIsReactionOpen] = React.useState(false);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);

  const isOwn = message.senderId === currentUser?.id;
  const isEmojiOnly = message.type === "emoji";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied to clipboard");
  };

  const handleEditSave = () => {
    if (!editContent.trim()) return;
    editMessage(message.id, editContent);
    setIsEditing(false);
    toast.success("Message edited");
  };

  const handleDelete = () => {
    deleteMessage(message.id);
    setIsDeleteDialogOpen(false);
    toast.success("Message deleted");
  };

  const handleToggleReaction = (emoji: string) => {
    if (!currentUser) return;
    const reaction = message.reactions?.find((r) => r.emoji === emoji);
    const hasReacted = reaction?.userIds.includes(currentUser.id);

    if (hasReacted) {
      removeReaction(message.id, emoji, currentUser.id);
    } else {
      addReaction(message.id, emoji, currentUser.id);
    }
  };

  const renderMessageContent = () => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-1.5 w-full min-w-[200px]">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="text-sm min-h-[48px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEditSave();
              }
            }}
          />
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-6 text-xs px-2 cursor-pointer">
              {commonT("cancel")}
            </Button>
            <Button size="sm" onClick={handleEditSave} className="h-6 text-xs px-2 cursor-pointer">
              {commonT("save")}
            </Button>
          </div>
        </div>
      );
    }

    if (message.isDeleted) {
      return <p className="text-sm italic text-muted-foreground/80">{message.content}</p>;
    }

    switch (message.type) {
      case "image":
        return message.fileMetadata ? <ImageMessage metadata={message.fileMetadata} /> : null;
      case "file":
        return message.fileMetadata ? <FileMessage metadata={message.fileMetadata} /> : null;
      case "emoji":
        return <p className="text-4xl select-none leading-none">{message.content}</p>;
      default:
        return <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>;
    }
  };

  return (
    <div
      className={cn(
        "group relative flex w-full gap-3 px-4 py-1 transition-colors duration-150 hover:bg-muted/30",
        isOwn ? "flex-row-reverse" : "flex-row",
        showSenderHeader ? "mt-3" : "mt-0.5"
      )}
    >
      {/* Avatar Container */}
      {!isOwn ? (
        <div className="w-8 shrink-0">
          {showSenderHeader ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.senderAvatar} />
              <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      ) : null}

      {/* Message Area */}
      <div className={cn("flex flex-col max-w-[70%] sm:max-w-[60%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender Name header */}
        {!isOwn && showSenderHeader && (
          <div className="flex items-center gap-2 mb-1 pl-1">
            <span className="text-xs font-bold text-foreground">{message.senderName}</span>
            <span className="text-[10px] text-muted-foreground">
              {formatMessageTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Reply Preview Box inside item */}
        {message.replyToMessage && !message.isDeleted && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 bg-muted/40 px-2.5 py-1 rounded border-l-2 border-primary/50">
            <CornerUpLeft className="h-3 w-3 shrink-0" />
            <span className="font-bold shrink-0">{message.replyToMessage.senderName}:</span>
            <span className="truncate max-w-[150px]">{message.replyToMessage.content}</span>
          </div>
        )}

        {/* Bubble container */}
        <div
          className={cn(
            "relative",
            isOwn ? "text-right" : "text-left"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-foreground relative transition-shadow duration-200",
              isEmojiOnly
                ? "bg-transparent px-0 py-0"
                : isOwn
                  ? "bg-primary text-primary-foreground rounded-tr-none shadow-sm"
                  : "bg-muted text-foreground rounded-tl-none shadow-sm"
            )}
            title={formatDetailedTime(message.timestamp)}
          >
            {renderMessageContent()}

            {/* Edited mark */}
            {message.isEdited && !message.isDeleted && (
              <span className={cn("text-[9px] block text-right mt-1 font-semibold opacity-70", isOwn ? "text-primary-foreground/90" : "text-muted-foreground")}>
                Edited
              </span>
            )}
          </div>

          {/* Reactions bar */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn("flex flex-wrap gap-1 mt-1.5", isOwn ? "justify-end" : "justify-start")}>
              {message.reactions.map((react) => {
                const isUserReacted = react.userIds.includes(currentUser?.id || "");
                return (
                  <button
                    key={react.emoji}
                    onClick={() => handleToggleReaction(react.emoji)}
                    className={cn(
                      "flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-xs font-semibold hover:bg-muted/75 cursor-pointer select-none active:scale-90 transition-transform",
                      isUserReacted
                        ? "bg-primary/5 border-primary/30 text-primary"
                        : "bg-background border-border/80 text-muted-foreground"
                    )}
                  >
                    <span>{react.emoji}</span>
                    <span>{react.userIds.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {!message.isDeleted && !isEditing && (
            <div
              className={cn(
                "absolute -top-9 z-10 hidden group-hover:flex items-center gap-0.5 rounded-full border border-border/85 bg-popover px-1 py-0.5 shadow-md",
                isOwn ? "right-0" : "left-0"
              )}
            >
              <Popover open={isReactionOpen} onOpenChange={setIsReactionOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full cursor-pointer hover:bg-muted">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-auto border-none bg-transparent p-0 shadow-none">
                  <ReactionPicker messageId={message.id} onSelect={() => setIsReactionOpen(false)} />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setReplyingToMessage(message)}
                className="h-7 w-7 rounded-full cursor-pointer hover:bg-muted"
                title={t("reply")}
              >
                <CornerUpLeft className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsActionsOpen((open) => !open)}
                  className="h-7 w-7 rounded-full cursor-pointer hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                {isActionsOpen && (
                  <div className={cn("absolute top-full z-20 mt-1 w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", isOwn ? "right-0" : "left-0")}>
                    <MessageAction onClick={() => { handleCopy(); setIsActionsOpen(false); }} icon={<Copy className="h-4 w-4" />}>{t("copy")}</MessageAction>
                    <MessageAction onClick={() => setIsActionsOpen(false)} icon={<Forward className="h-4 w-4" />}>{t("forward")}</MessageAction>
                    {isOwn ? (
                      <>
                        <div className="my-1 h-px bg-border" />
                        <MessageAction onClick={() => { setIsEditing(true); setEditContent(message.content); setIsActionsOpen(false); }} icon={<Edit2 className="h-4 w-4" />}>{t("edit")}</MessageAction>
                        <MessageAction onClick={() => { setIsDeleteDialogOpen(true); setIsActionsOpen(false); }} icon={<Trash2 className="h-4 w-4" />} destructive>{t("delete")}</MessageAction>
                      </>
                    ) : (
                      <>
                        <div className="my-1 h-px bg-border" />
                        <MessageAction onClick={() => setIsActionsOpen(false)} icon={<AlertTriangle className="h-4 w-4" />} destructive>{t("report")}</MessageAction>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick self timestamp at right */}
        {isOwn && showSenderHeader && (
          <div className="flex items-center gap-1.5 mt-0.5 pr-1.5">
            <span className="text-[9px] text-muted-foreground font-semibold">
              {formatMessageTime(message.timestamp)}
            </span>
            <CheckCheck className="h-3 w-3 text-primary" />
          </div>
        )}
      </div>

      {/* Delete Alert Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action is permanent and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              {commonT("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/95">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MessageAction({
  children,
  icon,
  onClick,
  destructive = false,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
        destructive && "text-destructive hover:bg-destructive/10"
      )}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
