"use client";

import * as React from "react";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/use-auth-store";
import { ProtectedRoute } from "@/contexts/protected-route";
import { OfflineBanner } from "@/components/shared/error-state";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check authentication
    if (!isAuthenticated || !currentUser) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
        {/* Network offline warning alert */}
        <OfflineBanner />

        {/* Subpage content */}
        <div className="flex-1 min-h-0 relative">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

