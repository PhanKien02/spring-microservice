"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { ChevronLeft, User, Shield, Moon, Bell, EyeOff, Key, Globe, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SETTINGS_NAV = [
  { href: "/settings/profile", labelKey: "profile", icon: User },
  { href: "/settings/account", labelKey: "account", icon: Shield },
  { href: "/settings/appearance", labelKey: "appearance", icon: Moon },
  { href: "/settings/notifications", labelKey: "notifications", icon: Bell },
  { href: "/settings/privacy", labelKey: "privacy", icon: EyeOff },
  { href: "/settings/security", labelKey: "security", icon: Key },
  { href: "/settings/language", labelKey: "language", icon: Globe },
  { href: "/settings/calls", labelKey: "calls", icon: PhoneCall },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("settings");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Settings Navigation Sidebar */}
      <div className="w-80 border-r bg-muted/10 flex flex-col shrink-0">
        {/* Header */}
        <div className="flex h-16 items-center gap-2 px-4 border-b shrink-0">
          <Button variant="ghost" size="icon" onClick={() => router.push("/chat")} className="h-8 w-8 rounded-full cursor-pointer">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-base font-bold text-foreground">{t("title")}</h2>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {SETTINGS_NAV.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{t(item.labelKey) || item.labelKey}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings content frame */}
      <div className="flex-1 overflow-y-auto bg-background p-6 md:p-10 max-w-2xl">
        {children}
      </div>
    </div>
  );
}

