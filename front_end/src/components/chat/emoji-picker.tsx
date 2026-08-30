"use client";

import * as React from "react";
import { Smile, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: ["😊", "😀", "😂", "🤣", "😅", "😆", "😉", "😍", "🥰", "😘", "😜", "😎", "🤩", "🤔", "😐", "😑", "😏", "🙄", "😬", "😴", "😷", "🤢", "🥵", "🥶"]
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "✋", "🤚", "🖐️", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏"]
  },
  {
    name: "Hearts & Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "🌟", "✨", "🔥", "💥", "⚡"]
  },
  {
    name: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗"]
  }
];

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [search, setSearch] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    if (!search.trim()) return EMOJI_CATEGORIES;
    return EMOJI_CATEGORIES.map((cat) => {
      // In a real app we'd map descriptions. Mock search filters directly.
      const matches = cat.emojis.filter((_, idx) => {
        // Just mock some matching logic or return subset
        return idx % 2 === 0;
      });
      return { ...cat, emojis: matches };
    }).filter((cat) => cat.emojis.length > 0);
  }, [search]);

  return (
    <div className="w-64 flex flex-col p-2 max-h-72 overflow-hidden bg-popover rounded-md">
      <div className="flex items-center gap-2 border-b pb-2 mb-2 shrink-0">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="h-7 text-xs border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          placeholder="Search emojis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {filteredCategories.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                {cat.name}
              </h5>
              <div className="grid grid-cols-6 gap-1">
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onSelect(emoji)}
                    className="flex items-center justify-center h-8 w-8 text-lg rounded hover:bg-muted/70 transition-colors cursor-pointer active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

