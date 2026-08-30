"use client";

import * as React from "react";
import { ConversationSidebar } from "./conversation-sidebar";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { ConversationDetails } from "./conversation-details";
import { EmptyState } from "@/components/shared/empty-state";
import { VoiceCall } from "@/components/calls/voice-call";
import { VideoCall } from "@/components/calls/video-call";
import { CommandPalette } from "../command-palette";
import { MusicPlayerBar } from "@/components/spotify/music-player-bar";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useUIStore } from "@/stores/use-ui-store";
import { useCallStore } from "@/stores/use-call-store";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function ChatLayout() {
  const t = useTranslations("common");

  const activeConversationId = useConversationStore((s) => s.activeConversationId);
  const messages = useConversationStore((s) => s.messages);
  const conversations = useConversationStore((s) => s.conversations);

  const isDetailsOpen = useUIStore((s) => s.isDetailsOpen);
  const isMobileSidebarOpen = useUIStore((s) => s.isMobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);
  const activeCall = useCallStore((s) => s.activeCall);

  const conversation = conversations.find((c) => c.id === activeConversationId);
  const chatMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Register Keyboard Shortcuts
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* 1. Sidebar Panel */}
      <div
        className={cn(
          "w-full md:w-[320px] shrink-0 h-full transition-all duration-300 md:block border-r border-border/40",
          !isMobileSidebarOpen ? "hidden" : "block"
        )}
      >
        <ConversationSidebar />
      </div>

      {/* 2. Main Chat Area Panel */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full bg-background relative",
          isMobileSidebarOpen ? "hidden md:flex" : "flex"
        )}
      >
        {activeConversationId && conversation ? (
          <>
            <MusicPlayerBar />
            <ChatHeader />
            <MessageList
              messages={chatMessages}
              typingUserIds={conversation.isTyping}
            />
            <MessageInput />
          </>
        ) : (
          <EmptyState type="no-conversation" />
        )}
      </div>

      {/* 3. Details Panel (Collapsible) */}
      {isDetailsOpen && activeConversationId && (
        <div className="hidden lg:block w-[320px] shrink-0 h-full border-l border-border/40">
          <ConversationDetails />
        </div>
      )}

      {/* Mobile drawer for Details */}
      {isDetailsOpen && activeConversationId && (
        <div className="lg:hidden fixed inset-0 z-40 flex justify-end bg-black/60 animate-in fade-in duration-200">
          {/* Backdrop closer click hook */}
          <div className="flex-1" onClick={() => useUIStore.getState().setDetailsOpen(false)} />
          <div className="w-[300px] h-full shadow-2xl animate-in slide-in-from-right duration-300">
            <ConversationDetails />
          </div>
        </div>
      )}

      {/* 4. Active Call Overlay elements */}
      {activeCall && activeCall.type === "voice" && <VoiceCall />}
      {activeCall && activeCall.type === "video" && <VideoCall />}

      {/* 5. Command Palette Dialog */}
      <CommandPalette />
    </div>
  );
}
