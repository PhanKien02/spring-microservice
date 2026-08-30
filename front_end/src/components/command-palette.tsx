"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Settings,
  Moon,
  Sun,
  Globe,
  Phone,
  Video,
  Plus,
  MessageSquare,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUIStore } from "@/stores/use-ui-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useCallStore } from "@/stores/use-call-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/routing";
import { toast } from "sonner";

export function CommandPalette() {
  const t = useTranslations("settings");
  const chatT = useTranslations("chat");
  const commonT = useTranslations("common");

  const isOpen = useUIStore((s) => s.isCommandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);

  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const setSettingsTab = useUIStore((s) => s.setSettingsTab);

  const conversations = useConversationStore((s) => s.conversations);
  const setActiveConversationId = useConversationStore((s) => s.setActiveConversationId);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  const startCall = useCallStore((s) => s.startCall);
  const currentUser = useAuthStore((s) => s.currentUser);

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenConversation = (id: string) => {
    setActiveConversationId(id);
    setCurrentView("chat");
    setMobileSidebarOpen(false);
    setOpen(false);
  };

  const handleOpenSettings = (tab: string) => {
    router.push(`/settings/${tab}`);
    setOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success("Theme changed successfully");
    setOpen(false);
  };

  const toggleLanguage = () => {
    const nextLocale = pathname.startsWith("/vi") ? "en" : "vi";
    router.replace(pathname, { locale: nextLocale });
    toast.success("Language switched");
    setOpen(false);
  };

  const handleQuickCall = (type: "voice" | "video") => {
    const activeConvId = useConversationStore.getState().activeConversationId;
    const conversation = conversations.find((c) => c.id === activeConvId);

    if (conversation && currentUser) {
      startCall(conversation.id, type, conversation.members, currentUser.id);
      toast.success(`Starting ${type} call...`);
    } else {
      toast.error("Please open a conversation to call");
    }
    setOpen(false);
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>{commonT("noResults")}</CommandEmpty>

        {/* Conversations list search category */}
        <CommandGroup heading="Conversations">
          {conversations.map((conv) => (
            <CommandItem
              key={conv.id}
              onSelect={() => handleOpenConversation(conv.id)}
              className="gap-2"
            >
              <MessageSquare className="h-4.5 w-4.5 text-muted-foreground" />
              <span>{conv.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Navigation Category */}
        <CommandGroup heading="System Commands">
          <CommandItem onSelect={() => handleOpenSettings("profile")} className="gap-2">
            <Settings className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Open Settings</span>
          </CommandItem>
          <CommandItem onSelect={toggleTheme} className="gap-2">
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-muted-foreground" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-muted-foreground" />
            )}
            <span>Toggle theme (Light / Dark)</span>
          </CommandItem>
          <CommandItem onSelect={toggleLanguage} className="gap-2">
            <Globe className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Change interface language (EN / VI)</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Call category */}
        <CommandGroup heading="Calls">
          <CommandItem onSelect={() => handleQuickCall("voice")} className="gap-2">
            <Phone className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Start voice call (in active chat)</span>
          </CommandItem>
          <CommandItem onSelect={() => handleQuickCall("video")} className="gap-2">
            <Video className="h-4.5 w-4.5 text-muted-foreground" />
            <span>Start video call (in active chat)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

