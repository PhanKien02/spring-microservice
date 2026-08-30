"use client";

import * as React from "react";
import { Play, Pause, ExternalLink } from "lucide-react";
import { SpotifyTrack } from "@/types";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SpotifyMessageProps {
  track: SpotifyTrack;
}

export function SpotifyMessage({ track }: SpotifyMessageProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(35); // mock progress percentage

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-lg border bg-black text-white w-full max-w-[280px] sm:max-w-[320px] shadow-md border-emerald-500/20">
      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-500 uppercase">
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-1.02-.336.073-.668-.14-.74-.476-.073-.337.14-.668.476-.74 3.86-.88 7.155-.51 9.81 1.117.295.18.387.563.207.86zm1.224-2.72c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.678-1.117 8.248-.573 11.35 1.334.367.227.487.708.26 1.075zm.105-2.81c-3.26-1.937-8.644-2.115-11.75-1.17-.5.152-1.025-.133-1.177-.633-.15-.5.133-1.025.633-1.177 3.623-1.1 9.553-.895 13.31 1.336.45.267.6.845.333 1.295-.267.45-.845.6-1.295.333z" />
        </svg>
        Spotify
      </div>

      <div className="flex items-center gap-3">
        <img
          src={track.albumArt}
          alt={track.album}
          className="h-14 w-14 rounded-md object-cover border border-white/10 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h5 className="text-sm font-bold text-white truncate leading-snug">
            {track.name}
          </h5>
          <p className="text-xs text-white/70 truncate mt-0.5">
            {track.artist}
          </p>
          <p className="text-[10px] text-white/50 truncate">
            {track.album}
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 rounded-full border border-white/20 text-white hover:text-emerald-500 hover:bg-white/10 shrink-0 cursor-pointer"
          >
            {isPlaying ? <Pause className="h-4.5 w-4.5 fill-current" /> : <Play className="h-4.5 w-4.5 fill-current pl-0.5" />}
          </Button>

          <div className="flex-1 space-y-1">
            {/* Progress line */}
            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-white/50 font-medium">
              <span>{formatDuration(Math.floor((track.durationMs * (progress / 100)) / 1000))}</span>
              <span>{formatDuration(Math.floor(track.durationMs / 1000))}</span>
            </div>
          </div>
        </div>

        <a
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full text-center py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 transition-colors text-xs font-bold text-black cursor-pointer shadow-sm"
        >
          Open in Spotify
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

