"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Search, X, Loader2, Users, UserPlus } from "lucide-react";
import { useConversationStore } from "@/stores/use-conversation-store";
import { MOCK_USERS } from "@/lib/mock-data";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewConversationModal({ isOpen, onClose }: NewConversationModalProps) {
  const t = useTranslations();
  const createConversation = useConversationStore((s) => s.createConversation);
  const setActiveConversationId = useConversationStore((s) => s.setActiveConversationId);

  const [search, setSearch] = React.useState("");
  const [isGroup, setIsGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Exclude current user from candidate lists
  const availableUsers = MOCK_USERS.filter((u) => u.id !== "currentUser");

  // Debounced/filtered list
  const filteredUsers = availableUsers.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      if (!isGroup) {
        // Direct messages only have 1 other member
        setSelectedUsers([user]);
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };

  const handleCreate = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one member.");
      return;
    }
    if (isGroup && !groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const name = isGroup
        ? groupName.trim()
        : selectedUsers[0].fullName;

      const memberIds = selectedUsers.map((u) => u.id);

      const conversationId = createConversation(
        name,
        isGroup ? "group" : "direct",
        memberIds
      );

      setActiveConversationId(conversationId);
      toast.success("Conversation created successfully!");
      onClose();
      // Reset values
      setSearch("");
      setIsGroup(false);
      setGroupName("");
      setSelectedUsers([]);
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="mb-2 shrink-0">
          <DialogTitle>{t("chat.newConversation")}</DialogTitle>
        </DialogHeader>

        {/* Selected Members Chips */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 border rounded-lg max-h-24 overflow-y-auto mb-3 shrink-0">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1.5 bg-background border px-2 py-0.5 rounded-full text-xs font-semibold"
              >
                <Avatar className="h-4.5 w-4.5">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-[8px]">{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.fullName}</span>
                <button
                  onClick={() => toggleUser(user)}
                  className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Conversation Type */}
          <div className="flex items-center gap-6 py-1 shrink-0">
            <button
              onClick={() => {
                setIsGroup(false);
                setSelectedUsers([]);
              }}
              className={cn(
                "flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/30 cursor-pointer",
                !isGroup ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
              )}
            >
              <UserPlus className="h-4 w-4" />
              Direct Message
            </button>
            <button
              onClick={() => {
                setIsGroup(true);
                setSelectedUsers([]);
              }}
              className={cn(
                "flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted/30 cursor-pointer",
                isGroup ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
              )}
            >
              <Users className="h-4 w-4" />
              Group Chat
            </button>
          </div>

          {/* Group Name input if Group selected */}
          {isGroup && (
            <div className="space-y-1.5 shrink-0">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Search users */}
          <div className="space-y-2 flex flex-col flex-1 min-h-[220px]">
            <Label htmlFor="search">Add Members</Label>
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                className="pl-9"
                placeholder="Search people..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* List */}
            <div className="flex-1 border rounded-lg overflow-y-auto bg-background/50 divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {t("common.noResults")}
                </div>
              ) : !isGroup ? (
                <RadioGroup
                  value={selectedUsers[0]?.id}
                  onValueChange={(userId) => {
                    const user = availableUsers.find((candidate) => candidate.id === userId);
                    if (user) setSelectedUsers([user]);
                  }}
                >
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers[0]?.id === user.id;
                    return (
                      <Label
                        key={user.id}
                        htmlFor={`direct-member-${user.id}`}
                        className={cn(
                          "flex items-center justify-between p-2.5 hover:bg-muted/50 cursor-pointer transition-colors",
                          isSelected && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              @{user.userName}
                            </p>
                          </div>
                        </div>
                        <RadioGroupItem
                          id={`direct-member-${user.id}`}
                          value={user.id}
                          disabled={isLoading}
                        />
                      </Label>
                    );
                  })}
                </RadioGroup>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = selectedUsers.some((u) => u.id === user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => !isLoading && toggleUser(user)}
                      className={cn(
                        "flex items-center justify-between p-2.5 hover:bg-muted/50 cursor-pointer transition-colors",
                        isSelected && "bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.userName}
                          </p>
                        </div>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleUser(user)}
                        disabled={isLoading}
                        className="pointer-events-none"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-3 border-t shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={isLoading || selectedUsers.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create conversation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
