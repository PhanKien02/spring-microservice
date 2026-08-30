"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Phone,
  Video,
  Sidebar,
  MoreVertical,
  VolumeX,
  Volume2,
  Trash2,
  ChevronLeft,
  Music,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/use-auth-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useCallStore } from "@/stores/use-call-store";
import { useUIStore } from "@/stores/use-ui-store";
import { useMusicStore } from "@/stores/use-music-store";
import { SpotifySearch } from "@/components/spotify/spotify-search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ChatHeader() {
  const t = useTranslations("chat");

  const currentUser = useAuthStore((s) => s.currentUser);
  const activeConversationId = useConversationStore((s) => s.activeConversationId);
  const conversations = useConversationStore((s) => s.conversations);
  const setActiveConversationId = useConversationStore((s) => s.setActiveConversationId);
  const muteConversation = useConversationStore((s) => s.muteConversation);
  const deleteConversation = useConversationStore((s) => s.deleteConversation);

  const startCall = useCallStore((s) => s.startCall);
  const playTrack = useMusicStore((s) => s.playTrack);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = React.useState(false);

  const isDetailsOpen = useUIStore((s) => s.isDetailsOpen);
  const toggleDetails = useUIStore((s) => s.toggleDetails);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  const conversation = conversations.find((c) => c.id === activeConversationId);

  if (!conversation) return null;

  const isGroup = conversation.type === "group";

  const handleStartVoiceCall = () => {
    if (!currentUser) return;
    startCall(conversation.id, "voice", conversation.members, currentUser.id);
  };

  const handleStartVideoCall = () => {
    if (!currentUser) return;
    startCall(conversation.id, "video", conversation.members, currentUser.id);
  };

  // Mock online indicators
  let isOnline = false;
  let statusText = isGroup ? t("members", { count: conversation.members.length }) : t("offline");

  if (!isGroup) {
    if (conversation.name === "John Doe" || conversation.name === "Michael Chen") {
      isOnline = true;
      statusText = t("online");
    } else if (conversation.name === "Emma Wilson") {
      statusText = "Away";
    }
  }

  return (
    <div className="flex h-16 w-full items-center justify-between border-b bg-background px-4 shrink-0 shadow-sm z-10">
      {/* Sender profile */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back navigation button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setActiveConversationId(null);
            setMobileSidebarOpen(true); // Return to Sidebar lists
          }}
          className="md:hidden h-8 w-8 rounded-full cursor-pointer shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="relative shrink-0">
          <Avatar className="h-9 w-9 border border-border/20">
            {conversation.avatar ? (
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
            ) : null}
            <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
          </Avatar>

          {/* Active status indicator dot */}
          {!isGroup && (
            <span
              className={cn(
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                isOnline ? "bg-emerald-500" : conversation.name === "Emma Wilson" ? "bg-amber-500" : "bg-slate-400"
              )}
            />
          )}
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-semibold truncate text-foreground leading-tight">
            {conversation.name}
          </h4>
          <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">
            {statusText}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStartVoiceCall}
          className="h-8.5 w-8.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          title={t("startVoiceCall")}
        >
          <Phone className="h-4.5 w-4.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStartVideoCall}
          className="h-8.5 w-8.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          title={t("startVideoCall")}
        >
          <Video className="h-4.5 w-4.5" />
        </Button>
        <Popover open={isMusicPickerOpen} onOpenChange={setIsMusicPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8.5 w-8.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title={t("playMusic")}
            >
              <Music className="h-4.5 w-4.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-auto overflow-hidden p-0">
            <SpotifySearch onPlay={(track) => {
              playTrack(track);
              setIsMusicPickerOpen(false);
            }} />
          </PopoverContent>
        </Popover>

        {/* Toggle Details Panel */}
        <Button
          variant={isDetailsOpen ? "secondary" : "ghost"}
          size="icon"
          onClick={toggleDetails}
          className="h-8.5 w-8.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
          title="Toggle info panel"
        >
          <Sidebar className="h-4.5 w-4.5" />
        </Button>

        {/* More actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8.5 w-8.5 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <MoreVertical className="h-4.5 w-4.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem onClick={() => muteConversation(conversation.id)} className="gap-2 cursor-pointer">
              {conversation.isMuted ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  <span>Unmute notifications</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  <span>Mute notifications</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                deleteConversation(conversation.id);
                setActiveConversationId(null);
                setMobileSidebarOpen(true);
              }}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 gap-2 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              <span>{t("deleteConversation")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
