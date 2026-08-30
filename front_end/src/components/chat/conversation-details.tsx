"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Phone,
  Video,
  UserPlus,
  VolumeX,
  Trash2,
  X,
  FileText,
  Link as LinkIcon,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  Shield,
  UserCheck,
  UserX,
  Settings as GearIcon,
  Search,
} from "lucide-react";
import { useConversationStore } from "@/stores/use-conversation-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCallStore } from "@/stores/use-call-store";
import { useUIStore } from "@/stores/use-ui-store";
import { MOCK_USERS } from "@/lib/mock-data";
import { cn, formatFileSize, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export function ConversationDetails() {
  const t = useTranslations("chat");
  const commonT = useTranslations("common");

  const currentUser = useAuthStore((s) => s.currentUser);
  const activeConversationId = useConversationStore((s) => s.activeConversationId);
  const conversations = useConversationStore((s) => s.conversations);
  const messages = useConversationStore((s) => s.messages);

  const muteConversation = useConversationStore((s) => s.muteConversation);
  const deleteConversation = useConversationStore((s) => s.deleteConversation);
  const leaveGroup = useConversationStore((s) => s.leaveGroup);
  const removeMemberFromGroup = useConversationStore((s) => s.removeMemberFromGroup);
  const addMembersToGroup = useConversationStore((s) => s.addMembersToGroup);

  const startCall = useCallStore((s) => s.startCall);
  const setDetailsOpen = useUIStore((s) => s.setDetailsOpen);

  const [isAddMemberOpen, setIsAddMemberOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [searchMember, setSearchMember] = React.useState("");

  const conversation = conversations.find((c) => c.id === activeConversationId);
  const chatMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  if (!conversation) return null;

  const isGroup = conversation.type === "group";
  const isAdmin = isGroup && conversation.adminId === currentUser?.id;

  // Resolve members details
  const members = conversation.members.map((id) => {
    return MOCK_USERS.find((u) => u.id === id) || {
      id,
      fullName: "Unknown User",
      userName: "unknown",
      email: "",
      avatar: "",
      status: "offline" as const,
    };
  });

  // Extract shared media (images) and files
  const sharedMedia = chatMessages.filter((m) => m.type === "image" && !m.isDeleted);
  const sharedFiles = chatMessages.filter((m) => m.type === "file" && !m.isDeleted);
  const sharedLinks = chatMessages.filter(
    (m) =>
      m.type === "text" &&
      !m.isDeleted &&
      (m.content.includes("http://") || m.content.includes("https://"))
  );

  const handleStartVoiceCall = () => {
    if (!currentUser) return;
    startCall(conversation.id, "voice", conversation.members, currentUser.id);
  };

  const handleStartVideoCall = () => {
    if (!currentUser) return;
    startCall(conversation.id, "video", conversation.members, currentUser.id);
  };

  const handleAddMembers = () => {
    if (selectedUsers.length === 0) return;
    addMembersToGroup(conversation.id, selectedUsers);
    toast.success("Members added successfully!");
    setIsAddMemberOpen(false);
    setSelectedUsers([]);
    setSearchMember("");
  };

  const handleRemoveMember = (userId: string) => {
    removeMemberFromGroup(conversation.id, userId);
    toast.success("Member removed.");
  };

  const handleLeaveGroup = () => {
    if (currentUser) {
      leaveGroup(conversation.id, currentUser.id);
      toast.success("Left the group.");
      setDetailsOpen(false);
    }
  };

  // Find candidate users to add (users not currently in group)
  const candidateUsersToAdd = MOCK_USERS.filter(
    (u) => !conversation.members.includes(u.id) && u.id !== "currentUser"
  ).filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchMember.toLowerCase()) ||
      u.userName.toLowerCase().includes(searchMember.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-background border-l border-border/40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 shrink-0 border-b border-border/20">
        <h3 className="text-sm font-bold text-foreground">{t("details")}</h3>
        <Button variant="ghost" size="icon" onClick={() => setDetailsOpen(false)} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center p-6 text-center shrink-0">
          <Avatar className="h-20 w-20 border-2 border-border/10 mb-3 shadow-sm">
            {conversation.avatar ? (
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
            ) : null}
            <AvatarFallback className="text-xl">{getInitials(conversation.name)}</AvatarFallback>
          </Avatar>
          <h4 className="text-base font-bold text-foreground">{conversation.name}</h4>

          {isGroup ? (
            <p className="text-xs text-muted-foreground mt-0.5">{t("members", { count: conversation.members.length })}</p>
          ) : (
            <p className="text-xs text-emerald-500 font-semibold mt-0.5">{t("online")}</p>
          )}

          {/* Quick Call actions */}
          <div className="flex items-center gap-3 mt-4 w-full justify-center">
            <Button size="sm" variant="outline" className="flex-1 max-w-[120px] h-9 gap-1.5" onClick={handleStartVoiceCall}>
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button size="sm" variant="outline" className="flex-1 max-w-[120px] h-9 gap-1.5" onClick={handleStartVideoCall}>
              <Video className="h-4 w-4" />
              Video
            </Button>
          </div>
        </div>

        <Separator />

        {/* Members List (Group Only) */}
        {isGroup && (
          <div className="p-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Members</h5>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => setIsAddMemberOpen(true)} className="h-7 text-xs px-2 gap-1 text-primary">
                  <UserPlus className="h-3.5 w-3.5" />
                  Add
                </Button>
              )}
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {members.map((member) => {
                const isMemberAdmin = member.id === conversation.adminId;
                const isSelf = member.id === currentUser?.id;
                return (
                  <div key={member.id} className="flex items-center justify-between gap-2 text-left">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">{member.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate text-foreground">
                          {member.fullName} {isSelf && "(You)"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          @{member.userName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isMemberAdmin ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                          <Shield className="h-2.5 w-2.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                          {t("memberRole")}
                        </span>
                      )}

                      {isAdmin && !isSelf && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-6 w-6 rounded-full text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Remove member"
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isGroup && <Separator />}

        {/* Media & Files Tabs */}
        <div className="p-4">
          <Tabs defaultValue="media" className="w-full">
            <TabsList className="grid w-full grid-cols-3 shrink-0">
              <TabsTrigger value="media" className="text-xs">{t("media")}</TabsTrigger>
              <TabsTrigger value="files" className="text-xs">{t("files")}</TabsTrigger>
              <TabsTrigger value="links" className="text-xs">{t("links")}</TabsTrigger>
            </TabsList>

            <TabsContent value="media" className="mt-3">
              {sharedMedia.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground/30 mb-1.5" />
                  No shared media
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {sharedMedia.map((m) => (
                    <a
                      key={m.id}
                      href={m.fileMetadata?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square relative rounded-md overflow-hidden bg-muted border hover:opacity-85 transition-opacity"
                    >
                      <img
                        src={m.fileMetadata?.url}
                        alt="Shared media"
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="files" className="mt-3">
              {sharedFiles.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  <FileText className="mx-auto h-6 w-6 text-muted-foreground/30 mb-1.5" />
                  No shared files
                </div>
              ) : (
                <div className="space-y-2">
                  {sharedFiles.map((m) => (
                    <a
                      key={m.id}
                      href={m.fileMetadata?.url}
                      download
                      className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate text-foreground">
                            {m.fileMetadata?.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatFileSize(m.fileMetadata?.size || 0)}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="links" className="mt-3">
              {sharedLinks.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  <LinkIcon className="mx-auto h-6 w-6 text-muted-foreground/30 mb-1.5" />
                  No shared links
                </div>
              ) : (
                <div className="space-y-2">
                  {sharedLinks.map((m) => {
                    const match = m.content.match(/https?:\/\/[^\s]+/g);
                    const link = match ? match[0] : m.content;
                    return (
                      <a
                        key={m.id}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary/80 text-secondary-foreground">
                            <LinkIcon className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-foreground">
                              {link}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              Shared by {m.senderName}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </a>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        {/* Options */}
        <div className="p-4 space-y-1.5">
          <h5 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2.5">Settings</h5>

          <Button
            variant="ghost"
            onClick={() => muteConversation(conversation.id)}
            className="w-full justify-start text-foreground hover:bg-muted/70 text-xs h-9 pl-2"
          >
            <VolumeX className="h-4 w-4 mr-2.5" />
            {conversation.isMuted ? "Unmute conversation" : "Mute conversation"}
          </Button>

          {isGroup ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-9 pl-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2.5" />
                  Leave Group
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave group chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to leave this group? You will no longer be able to send or receive messages in this group.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{commonT("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveGroup} className="bg-destructive hover:bg-destructive/95">
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-9 pl-2 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2.5" />
                  {t("deleteConversation")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete conversation history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently clear your message history with {conversation.name}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{commonT("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteConversation(conversation.id);
                      toast.success("Conversation deleted.");
                    }}
                    className="bg-destructive hover:bg-destructive/95"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </ScrollArea>

      {/* Add Members Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col p-6 overflow-hidden">
          <DialogHeader className="shrink-0 mb-2">
            <DialogTitle>Add Members to Group</DialogTitle>
          </DialogHeader>

          <div className="relative shrink-0 mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search contacts..."
              value={searchMember}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchMember(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto border rounded-lg bg-background/50 divide-y divide-border/60">
            {candidateUsersToAdd.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No contacts available to add
              </div>
            ) : (
              candidateUsersToAdd.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={cn(
                      "flex items-center justify-between p-2.5 hover:bg-muted/50 cursor-pointer transition-colors",
                      isSelected && "bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">@{user.userName}</p>
                      </div>
                    </div>
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleUserSelection(user.id)} className="pointer-events-none" />
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter className="mt-4 pt-3 border-t shrink-0">
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
              {commonT("cancel")}
            </Button>
            <Button onClick={handleAddMembers} disabled={selectedUsers.length === 0}>
              Add members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
