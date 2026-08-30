"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Settings, Plus, Search, MessageSquare, Globe, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useUIStore } from "@/stores/use-ui-store";
import { ConversationItem } from "./conversation-item";
import { NewConversationModal } from "./new-conversation-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/routing";

export function ConversationSidebar() {
  const t = useTranslations("chat");
  const authT = useTranslations("auth");
  const settingsT = useTranslations("settings");

  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  const conversations = useConversationStore((s) => s.conversations);
  const searchQuery = useConversationStore((s) => s.searchQuery);
  const setSearchQuery = useConversationStore((s) => s.setSearchQuery);
  const activeTab = useConversationStore((s) => s.activeTab);
  const setActiveTab = useConversationStore((s) => s.setActiveTab);

  const setCurrentView = useUIStore((s) => s.setCurrentView);
  const setSettingsTab = useUIStore((s) => s.setSettingsTab);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Switch locale
  const toggleLanguage = () => {
    const nextLocale = pathname.startsWith("/vi") ? "en" : "vi";
    // Navigate with new locale
    router.replace(pathname, { locale: nextLocale });
  };

  // Filter conversations
  const filteredConversations = React.useMemo(() => {
    return conversations
      .filter((c) => !c.isArchived) // don't show archived by default
      .filter((c) => {
        // Tab filter
        if (activeTab === "unread") return c.unreadCount > 0;
        if (activeTab === "groups") return c.type === "group";
        return true;
      })
      .filter((c) => {
        // Search filter
        if (!searchQuery) return true;
        return c.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // Pinned first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        // Then by last message date desc
        const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
        const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
        return bTime - aTime;
      });
  }, [conversations, activeTab, searchQuery]);

  const handleOpenSettings = (tab: "profile" | "appearance" | "language" | "calls") => {
    setCurrentView("settings");
    setSettingsTab(tab);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-full w-full flex-col border-r bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 shrink-0 border-b border-border/40">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative shrink-0 rounded-full ring-offset-background transition-opacity hover:opacity-90 focus:outline-none cursor-pointer">
                <Avatar className="h-9 w-9 border border-border/30">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.fullName} />
                  <AvatarFallback>{currentUser?.fullName.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{currentUser?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">@{currentUser?.userName}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleOpenSettings("profile")} className="cursor-pointer">
                {settingsT("profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenSettings("appearance")} className="cursor-pointer">
                {settingsT("appearance")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenSettings("language")} className="cursor-pointer">
                {settingsT("language")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenSettings("calls")} className="cursor-pointer">
                {settingsT("calls")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{authT("logout") || "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">{currentUser?.fullName}</p>
            <p className="text-xs text-emerald-500 font-medium">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Quick Language Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleLanguage} className="h-8 w-8 rounded-full" title="Switch Language">
            <Globe className="h-4.5 w-4.5" />
          </Button>

          {/* Quick Settings Gear */}
          <Button variant="ghost" size="icon" onClick={() => handleOpenSettings("profile")} className="h-8 w-8 rounded-full">
            <Settings className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>

      {/* Search and New Chat */}
      <div className="p-3 space-y-2 shrink-0 border-b border-border/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-9"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="w-full h-9 gap-1.5" variant="secondary">
          <Plus className="h-4 w-4" />
          {t("newConversation")}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 border-b border-border/20 bg-muted/20 shrink-0">
        {(["all", "unread", "groups"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all duration-200 capitalize cursor-pointer ${activeTab === tab
              ? "bg-background text-foreground shadow-sm font-bold"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-[280px]">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-muted-foreground">{t("noConversationsYet")}</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredConversations.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Modals */}
      <NewConversationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

