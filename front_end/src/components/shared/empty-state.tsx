"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, Search, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-conversation" | "no-results" | "no-conversations-yet";
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ type, actionLabel, onAction }: EmptyStateProps) {
  const t = useTranslations();

  switch (type) {
    case "no-conversation":
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-background">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4 animate-bounce">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {t("chat.noConversationSelected")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            {t("chat.selectConversationToStart")}
          </p>
        </div>
      );

    case "no-results":
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h4 className="text-sm font-medium text-foreground">
            {t("common.noResults")}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {t("common.tryAnotherSearch")}
          </p>
        </div>
      );

    case "no-conversations-yet":
      return (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {t("chat.noConversationsYet")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            {t("chat.startNewConversation")}
          </p>
          {onAction && actionLabel && (
            <Button onClick={onAction} size="sm">
              {actionLabel}
            </Button>
          )}
        </div>
      );
  }
}

