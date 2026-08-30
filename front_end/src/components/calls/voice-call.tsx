"use client";

import * as React from "react";
import { Mic, MicOff, Volume2, VolumeX, PhoneOff, UserPlus, ShieldAlert } from "lucide-react";
import { useCallStore } from "@/stores/use-call-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials, formatDuration } from "@/lib/utils";

export function VoiceCall() {
  const activeCall = useCallStore((s) => s.activeCall);
  const endCall = useCallStore((s) => s.endCall);
  const toggleMute = useCallStore((s) => s.toggleMute);
  const incrementDuration = useCallStore((s) => s.incrementDuration);

  const conversations = useConversationStore((s) => s.conversations);

  const [isSpeakerOn, setIsSpeakerOn] = React.useState(true);

  const conversation = conversations.find((c) => c.id === activeCall?.conversationId);

  // Interval timer for connected calls duration
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall && activeCall.status === "connected") {
      interval = setInterval(() => {
        incrementDuration();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall?.status, activeCall, incrementDuration]);

  if (!activeCall) return null;

  const renderStatus = () => {
    switch (activeCall.status) {
      case "calling":
        return "Calling...";
      case "connecting":
        return "Connecting...";
      case "connected":
        return formatDuration(activeCall.duration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between bg-zinc-950 text-white p-6 md:p-12 animate-in fade-in duration-300">
      {/* Background blurred cover */}
      {conversation?.avatar && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] blur-xl"
          style={{ backgroundImage: `url(${conversation.avatar})` }}
        />
      )}

      {/* Top logo/encryption banner */}
      <div className="flex items-center gap-1.5 text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full relative z-10 shrink-0">
        <ShieldAlert className="h-3.5 w-3.5" />
        <span>End-to-End Encrypted</span>
      </div>

      {/* Center user avatar profile details */}
      <div className="flex flex-col items-center text-center space-y-4 relative z-10 my-auto">
        <div className="relative">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/10 shadow-2xl relative">
            {conversation?.avatar && (
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
            )}
            <AvatarFallback className="text-3xl bg-zinc-800 text-white font-medium">
              {conversation ? getInitials(conversation.name) : "C"}
            </AvatarFallback>
          </Avatar>

          {/* Pulsating calling circle visual overlay */}
          {activeCall.status === "calling" && (
            <span className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-70" />
          )}
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {conversation?.name}
          </h2>
          <p className="text-sm font-semibold text-white/60 tracking-wider mt-1.5">
            {renderStatus()}
          </p>
        </div>
      </div>

      {/* Bottom dial actions and controls buttons */}
      <div className="flex flex-col items-center gap-6 relative z-10 shrink-0 w-full max-w-sm">
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Mute Microphone */}
          <Button
            size="icon"
            onClick={toggleMute}
            className={`h-12 w-12 rounded-full cursor-pointer border ${activeCall.isMuted
              ? "bg-white text-zinc-950 border-white hover:bg-white/90"
              : "bg-white/10 text-white border-white/10 hover:bg-white/15"
              }`}
            title={activeCall.isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {activeCall.isMuted ? <MicOff className="h-5.5 w-5.5" /> : <Mic className="h-5.5 w-5.5" />}
          </Button>

          {/* End Call Button */}
          <Button
            size="icon"
            onClick={endCall}
            className="h-14 w-14 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow-lg active:scale-95"
            title="End Call"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          {/* Speaker Switch */}
          <Button
            size="icon"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`h-12 w-12 rounded-full cursor-pointer border ${!isSpeakerOn
              ? "bg-white text-zinc-950 border-white hover:bg-white/90"
              : "bg-white/10 text-white border-white/10 hover:bg-white/15"
              }`}
            title={isSpeakerOn ? "Speaker Off" : "Speaker On"}
          >
            {!isSpeakerOn ? <VolumeX className="h-5.5 w-5.5" /> : <Volume2 className="h-5.5 w-5.5" />}
          </Button>
        </div>

        {/* Add participant text links */}
        {activeCall.status === "connected" && (
          <Button variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white gap-1 hover:bg-white/5 cursor-pointer">
            <UserPlus className="h-4 w-4" />
            Add Participant
          </Button>
        )}
      </div>
    </div>
  );
}

