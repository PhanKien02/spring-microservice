"use client";

import { useTranslations } from "next-intl";
import { MOCK_USERS } from "@/lib/mock-data";

interface TypingIndicatorProps {
  typingUserIds: string[];
}

export function TypingIndicator({ typingUserIds }: TypingIndicatorProps) {
  const t = useTranslations("chat");

  if (!typingUserIds || typingUserIds.length === 0) return null;

  const names = typingUserIds
    .map((id) => MOCK_USERS.find((u) => u.id === id)?.fullName || "Someone")
    .filter(Boolean);

  const renderText = () => {
    if (names.length === 1) {
      return t("typing", { name: names[0] });
    }
    if (names.length === 2) {
      return t("typingMultiple", { names: `${names[0]} and ${names[1]}` });
    }
    return t("typingMultiple", { names: `${names[0]}, ${names[1]} and others` });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground bg-muted/30 w-fit rounded-lg animate-pulse-slow">
      {/* 3 dots loader animation */}
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot-2" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot-3" />
      </div>
      <span>{renderText()}</span>
    </div>
  );
}

