"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Music, Play, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_SPOTIFY_SONGS } from "@/lib/mock-data";
import { SpotifyTrack } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SpotifySearchProps {
  onPlay: (track: SpotifyTrack) => void;
}

export function SpotifySearch({ onPlay }: SpotifySearchProps) {
  const t = useTranslations("chat");
  const [query, setQuery] = React.useState("");

  const filteredTracks = React.useMemo(() => {
    if (!query.trim()) return MOCK_SPOTIFY_SONGS;
    return MOCK_SPOTIFY_SONGS.filter(
      (track) =>
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.album.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="w-80 flex flex-col max-h-96 p-1 overflow-hidden">
      <div className="flex items-center gap-2 border-b p-2 shrink-0">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          className="h-8 border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm shadow-none"
          placeholder={t("searchSpotify")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border/40 p-1">
        <p className="text-[10px] font-bold text-muted-foreground/80 uppercase px-2 py-1 tracking-wider shrink-0">{t("songs")}</p>

        {filteredTracks.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            {t("noSongsFound")}
          </div>
        ) : (
          filteredTracks.map((track) => (
            <div
              key={track.id}
              role="button"
              tabIndex={0}
              onClick={() => onPlay(track)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onPlay(track);
                }
              }}
              className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-9 w-9 rounded-md shrink-0">
                  <AvatarImage src={track.albumArt} />
                  <AvatarFallback className="rounded-md">
                    <Music className="h-4 w-4 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-foreground">
                    {track.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {track.artist} • {track.album}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  onPlay(track);
                }}
                className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary cursor-pointer"
                title={t("playMusic")}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
