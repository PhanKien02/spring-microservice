"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center bg-background">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        {title || t("common.error")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
        {description || "We couldn't load your content. Please check your connection."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          {t("common.tryAgain")}
        </Button>
      )}
    </div>
  );
}

export function OfflineBanner() {
  const t = useTranslations();
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-destructive/90 text-destructive-foreground px-4 py-2 text-xs font-medium transition-all duration-300">
      <WifiOff className="h-4.5 w-4.5 animate-pulse" />
      <span>
        <strong>{t("common.offline")}:</strong> {t("common.offlineText")}
      </span>
    </div>
  );
}

