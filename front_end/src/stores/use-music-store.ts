import { create } from "zustand";
import { MOCK_SPOTIFY_SONGS } from "@/lib/mock-data";
import { SpotifyTrack } from "@/types";

interface MusicState {
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  playlist: SpotifyTrack[];
  playTrack: (track: SpotifyTrack) => void;
  togglePlayback: () => void;
  previous: () => void;
  next: () => void;
  clearUpcoming: () => void;
  cancel: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  playlist: MOCK_SPOTIFY_SONGS,
  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  previous: () => {
    const { currentTrack, playlist } = get();
    const currentIndex = playlist.findIndex((track) => track.id === currentTrack?.id);
    const previousIndex = currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    set({ currentTrack: playlist[previousIndex] ?? null, isPlaying: Boolean(playlist[previousIndex]) });
  },
  next: () => {
    const { currentTrack, playlist } = get();
    const currentIndex = playlist.findIndex((track) => track.id === currentTrack?.id);
    const nextIndex = currentIndex === -1 || currentIndex === playlist.length - 1 ? 0 : currentIndex + 1;
    set({ currentTrack: playlist[nextIndex] ?? null, isPlaying: Boolean(playlist[nextIndex]) });
  },
  clearUpcoming: () => {
    const { currentTrack } = get();
    set({ playlist: currentTrack ? [currentTrack] : [] });
  },
  cancel: () => set({ currentTrack: null, isPlaying: false }),
}));
