"use client";

import * as React from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
  Maximize2,
  Minimize2,
  MoreVertical,
} from "lucide-react";
import { useCallStore } from "@/stores/use-call-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials, formatDuration } from "@/lib/utils";
import { MOCK_USERS } from "@/lib/mock-data";

export function VideoCall() {
  const activeCall = useCallStore((s) => s.activeCall);
  const endCall = useCallStore((s) => s.endCall);
  const toggleMute = useCallStore((s) => s.toggleMute);
  const toggleCamera = useCallStore((s) => s.toggleCamera);
  const toggleScreenSharing = useCallStore((s) => s.toggleScreenSharing);
  const incrementDuration = useCallStore((s) => s.incrementDuration);

  const conversations = useConversationStore((s) => s.conversations);

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const conversation = conversations.find((c) => c.id === activeCall?.conversationId);
  const isGroup = conversation?.type === "group";

  // Interval timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall && activeCall.status === "connected") {
      interval = setInterval(() => {
        incrementDuration();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  if (!activeCall) return null;

  // Gather group participants data
  const groupMembers = (conversation?.members || []).map((id) => {
    return MOCK_USERS.find((u) => u.id === id);
  }).filter(Boolean);

  const activeSpeakerId = groupMembers[1]?.id; // Michael Chen as mock active speaker

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-zinc-950 text-white animate-in fade-in duration-300">
      {/* Top Header info */}
      <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-b from-black/60 to-transparent relative z-20 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white">{conversation?.name}</h3>
          <span className="text-xs text-white/60">
            {activeCall.status === "connected" ? formatDuration(activeCall.duration) : "Connecting..."}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8.5 w-8.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 cursor-pointer">
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </Button>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 p-4 flex items-center justify-center relative overflow-hidden z-10">
        {activeCall.status !== "connected" ? (
          /* Connecting placeholder screen */
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <Avatar className="h-28 w-28 border-2 border-white/20 animate-pulse">
                <AvatarImage src={conversation?.avatar} />
                <AvatarFallback>{conversation ? getInitials(conversation.name) : "C"}</AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-60" />
            </div>
            <p className="text-sm font-semibold tracking-wider text-white/70">Connecting Call...</p>
          </div>
        ) : isGroup ? (
          /* Group Video grid view */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full h-full max-w-5xl">
            {groupMembers.map((member) => {
              if (!member) return null;
              const isSelf = member.id === "currentUser";
              const isActiveSpeaker = member.id === activeSpeakerId;
              const isCamOff = isSelf ? activeCall.isCameraOff : false;

              return (
                <div
                  key={member.id}
                  className={`relative rounded-xl overflow-hidden border bg-zinc-900 flex items-center justify-center transition-all ${isActiveSpeaker ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/40" : "border-white/5"
                    }`}
                >
                  {isCamOff ? (
                    <Avatar className="h-16 w-16 border border-white/10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    /* Mock camera feed */
                    <div className="relative h-full w-full">
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="h-full w-full object-cover filter brightness-[0.7] blur-sm scale-110 opacity-40 absolute inset-0"
                      />
                      <img
                        src={member.avatar}
                        alt={member.fullName}
                        className="h-full w-full object-cover relative z-10"
                      />
                    </div>
                  )}

                  {/* Name badge */}
                  <div className="absolute bottom-3 left-3 z-20 bg-black/60 px-2.5 py-1 rounded text-xs font-semibold border border-white/10">
                    {member.fullName} {isSelf && "(You)"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Direct Video call layout (Remote large, local PiP) */
          <div className="relative h-full w-full max-w-4xl rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 flex items-center justify-center shadow-2xl">
            {/* Remote camera feed */}
            <div className="h-full w-full relative">
              <img
                src={conversation?.avatar}
                alt={conversation?.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Local Video Picture-in-picture box */}
            <div className="absolute right-4 bottom-4 z-20 h-32 w-24 md:h-44 md:w-32 rounded-xl overflow-hidden border-2 border-white/15 bg-zinc-800 shadow-lg">
              {activeCall.isCameraOff ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <div className="h-full w-full relative">
                  {/* Mock local user picture */}
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80"
                    alt="Your camera feed"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="h-24 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center px-6 relative z-20 shrink-0">
        <div className="flex items-center gap-4 bg-zinc-900/90 border border-white/10 px-6 py-3.5 rounded-full shadow-2xl">
          {/* Mute Mic */}
          <Button
            size="icon"
            onClick={toggleMute}
            className={`h-11 w-11 rounded-full cursor-pointer ${activeCall.isMuted
              ? "bg-white text-zinc-950 hover:bg-white/90"
              : "bg-white/10 text-white hover:bg-white/15"
              }`}
          >
            {activeCall.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Toggle camera */}
          <Button
            size="icon"
            onClick={toggleCamera}
            className={`h-11 w-11 rounded-full cursor-pointer ${activeCall.isCameraOff
              ? "bg-white text-zinc-950 hover:bg-white/90"
              : "bg-white/10 text-white hover:bg-white/15"
              }`}
          >
            {activeCall.isCameraOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
          </Button>

          {/* Share Screen */}
          <Button
            size="icon"
            onClick={toggleScreenSharing}
            className={`h-11 w-11 rounded-full cursor-pointer ${activeCall.isScreenSharing
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-white/10 text-white hover:bg-white/15"
              }`}
            title="Share Screen"
          >
            <Monitor className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            onClick={endCall}
            className="h-11 w-11 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="h-5.5 w-5.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

