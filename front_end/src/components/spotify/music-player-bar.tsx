"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Heart, ListMusic, MoreHorizontal, Music, Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useMusicStore } from "@/stores/use-music-store";

export function MusicPlayerBar() {
  const t = useTranslations("chat");
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const playlist = useMusicStore((state) => state.playlist);
  const playTrack = useMusicStore((state) => state.playTrack);
  const togglePlayback = useMusicStore((state) => state.togglePlayback);
  const previous = useMusicStore((state) => state.previous);
  const next = useMusicStore((state) => state.next);
  const clearUpcoming = useMusicStore((state) => state.clearUpcoming);
  const cancel = useMusicStore((state) => state.cancel);
  const [autoplay, setAutoplay] = React.useState(true);

  if (!currentTrack) return null;

  const upcomingTracks = playlist.filter((track) => track.id !== currentTrack.id);

  return (
    <div className="flex min-h-14 items-center gap-2 border-b bg-emerald-500/5 px-4 py-2 shrink-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Avatar className="h-9 w-9 rounded-md shrink-0">
          <AvatarImage src={currentTrack.albumArt} alt={currentTrack.album} />
          <AvatarFallback className="rounded-md"><Music className="h-4 w-4" /></AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{currentTrack.name}</p>
          <p className="truncate text-xs text-muted-foreground">{currentTrack.artist}</p>
        </div>
        <span className="hidden sm:inline-flex text-[10px] font-semibold text-emerald-600">
          {isPlaying ? t("nowPlaying") : t("playbackStopped")}
        </span>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" onClick={previous} className="h-8 w-8 rounded-full" title={t("previousTrack")}>
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePlayback} className="h-8 w-8 rounded-full" title={isPlaying ? t("pausePlayback") : t("resumePlayback")}>
          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={next} className="h-8 w-8 rounded-full" title={t("nextTrack")}>
          <SkipForward className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" title={t("playlist")}>
              <ListMusic className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-bold">{t("nextUp")}</h3>
              <Button variant="ghost" size="sm" onClick={clearUpcoming} disabled={upcomingTracks.length === 0} className="h-8 px-2 text-sm font-semibold">
                {t("clear")}
              </Button>
            </div>

            <div className="max-h-64 overflow-y-auto p-2">
              <PlaylistTrack track={currentTrack} isCurrent isPlaying={isPlaying} onSelect={() => playTrack(currentTrack)} />
              {upcomingTracks.map((track) => (
                <PlaylistTrack key={track.id} track={track} onSelect={() => playTrack(track)} />
              ))}
            </div>

            <div className="border-t px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{t("autoplay")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("autoplayDescription")}</p>
                </div>
                <Switch checked={autoplay} onCheckedChange={setAutoplay} aria-label={t("autoplay")} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="icon" onClick={cancel} className="h-8 w-8 rounded-full" title={t("cancelPlayback")}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface PlaylistTrackProps {
  track: { id: string; name: string; artist: string; albumArt: string; durationMs: number };
  isCurrent?: boolean;
  isPlaying?: boolean;
  onSelect: () => void;
}

function PlaylistTrack({ track, isCurrent = false, isPlaying = false, onSelect }: PlaylistTrackProps) {
  const t = useTranslations("chat");
  const duration = `${Math.floor(track.durationMs / 60000)}:${String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, "0")}`;

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted ${isCurrent ? "bg-muted" : ""}`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-9 w-9 rounded-sm">
          <AvatarImage src={track.albumArt} alt="" />
          <AvatarFallback className="rounded-sm"><Music className="h-4 w-4" /></AvatarFallback>
        </Avatar>
        {isCurrent && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/55">
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </span>
        )}
      </div>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{track.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{track.artist}</span>
      </span>
      {isCurrent ? (
        <span className="flex items-center gap-1 text-muted-foreground">
          <Heart className="h-4 w-4" aria-label={t("likeTrack")} />
          <MoreHorizontal className="h-4 w-4" />
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">{duration}</span>
      )}
    </button>
  );
}
