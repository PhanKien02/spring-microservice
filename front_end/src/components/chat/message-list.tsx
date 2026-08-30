"use client";

import * as React from "react";
import { Message } from "@/types";
import { isToday, isYesterday, format } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { useTranslations } from "next-intl";
import { MessageItem } from "./message-item";
import { TypingIndicator } from "./typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversationStore } from "@/stores/use-conversation-store";

interface MessageListProps {
  messages: Message[];
  typingUserIds?: string[];
  locale?: string;
}

export function MessageList({ messages, typingUserIds = [], locale = "en" }: MessageListProps) {
  const t = useTranslations("chat");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, typingUserIds]);

  // Group messages by date and sender continuity
  const groupedElements = React.useMemo(() => {
    const elements: React.ReactNode[] = [];
    let lastDateKey = "";
    let lastSenderId = "";
    let lastTimestamp = 0;

    messages.forEach((msg, idx) => {
      const date = new Date(msg.timestamp);
      let dateKey = format(date, "yyyy-MM-dd");

      // Render date separator
      if (dateKey !== lastDateKey) {
        lastDateKey = dateKey;

        let label = format(date, "MMMM d, yyyy", { locale: locale === "vi" ? vi : enUS });
        if (isToday(date)) {
          label = t("today");
        } else if (isYesterday(date)) {
          label = t("yesterday");
        }

        elements.push(
          <div key={`date-${dateKey}-${idx}`} className="flex items-center justify-center my-4 shrink-0">
            <div className="border-t border-border/40 w-1/4" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/75 px-3">
              {label}
            </span>
            <div className="border-t border-border/40 w-1/4" />
          </div>
        );

        // Reset continuity on date boundary
        lastSenderId = "";
      }

      // Check sender continuity (within 3 minutes)
      const msgTime = date.getTime();
      const timeDiff = (msgTime - lastTimestamp) / 1000 / 60; // in minutes
      const showHeader = msg.senderId !== lastSenderId || timeDiff > 3 || msg.type === "call";

      elements.push(
        <MessageItem
          key={msg.id}
          message={msg}
          showSenderHeader={showHeader}
        />
      );

      lastSenderId = msg.senderId;
      lastTimestamp = msgTime;
    });

    return elements;
  }, [messages, locale, t]);

  return (
    <div className="flex-1 overflow-y-auto p-2" ref={scrollRef}>
      <div className="space-y-1">
        {groupedElements}

        {/* Typing indicator inside scrolling list */}
        {typingUserIds.length > 0 && (
          <div className="p-4 select-none shrink-0 animate-in slide-in-from-bottom-2 duration-300">
            <TypingIndicator typingUserIds={typingUserIds} />
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}

