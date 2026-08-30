"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Paperclip,
  Smile,
  Mic,
  Send,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  Trash2,
  CornerDownRight,
  Sparkles,
} from "lucide-react";
import { useConversationStore } from "@/stores/use-conversation-store";
import { FileMetadata, MessageType } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmojiPicker } from "./emoji-picker";
import { toast } from "sonner";

export function MessageInput() {
  const t = useTranslations("chat");
  const commonT = useTranslations("common");

  const sendMessage = useConversationStore((s) => s.sendMessage);
  const replyingToMessage = useConversationStore((s) => s.replyingToMessage);
  const setReplyingToMessage = useConversationStore((s) => s.setReplyingToMessage);

  const [text, setText] = React.useState("");
  const [attachments, setAttachments] = React.useState<FileMetadata[]>([]);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [isEmojiOpen, setIsEmojiOpen] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-grow textarea height
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    // If we have text and no attachments
    if (text.trim() && attachments.length === 0) {
      // Determine if emoji only
      const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u;
      const cleanText = text.trim();
      const isEmoji = emojiRegex.test(cleanText) && cleanText.replace(/\s/g, "").length <= 3;

      sendMessage(cleanText, isEmoji ? "emoji" : "text");
      setText("");
      textareaRef.current?.focus();
      return;
    }

    // Send each attachment
    if (attachments.length > 0) {
      attachments.forEach((file) => {
        // Send caption text with the first attachment, or as a separate text message
        const fileType: MessageType = file.type.startsWith("image/") ? "image" : "file";
        sendMessage(file.url, fileType, {
          fileMetadata: {
            ...file,
            uploadStatus: "completed",
            uploadProgress: 100
          }
        });
      });

      if (text.trim()) {
        sendMessage(text.trim(), "text");
      }

      setAttachments([]);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const mockUploadFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const mockUrl = isImage
      ? URL.createObjectURL(file) // Client side preview
      : "#";

    const newAttachment: FileMetadata = {
      name: file.name,
      url: mockUrl,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      uploadStatus: "uploading"
    };

    setAttachments((prev) => [...prev, newAttachment]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setAttachments((prev) =>
        prev.map((att) => {
          if (att.name === file.name) {
            if (progress >= 100) {
              clearInterval(interval);
              return { ...att, uploadProgress: 100, uploadStatus: "completed" };
            }
            return { ...att, uploadProgress: progress };
          }
          return att;
        })
      );
    }, 400);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        mockUploadFile(file);
      });
      // clear input
      e.target.value = "";
    }
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        mockUploadFile(file);
      });
      toast.success("Files dropped successfully");
    }
  };

  // Paste image clipboard handler
  React.useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        Array.from(e.clipboardData.files).forEach((file) => {
          mockUploadFile(file);
        });
        toast.success("Image pasted from clipboard");
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Mock Voice Recording lifecycle
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    toast.info("Voice recording started...");
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStopRecording = (send: boolean) => {
    setIsRecording(false);
    if (send) {
      // Send mock audio voice message file
      sendMessage("#", "file", {
        fileMetadata: {
          name: `voice-note-${new Date().toLocaleTimeString()}.mp3`,
          url: "#",
          size: 450000,
          type: "audio/mp3",
          uploadStatus: "completed"
        }
      });
      toast.success("Voice note sent");
    } else {
      toast.error("Voice note cancelled");
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex flex-col border-t bg-background p-3.5 space-y-2 shrink-0 relative"
    >
      {/* Reply Bar indicator */}
      {replyingToMessage && (
        <div className="flex items-center justify-between bg-muted/40 px-3 py-1.5 rounded-lg border-l-4 border-primary animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-foreground">
              Replying to {replyingToMessage.senderName}:
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-[400px]">
              {replyingToMessage.content}
            </span>
          </div>
          <button
            onClick={() => setReplyingToMessage(null)}
            className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Attachments Preview lists */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2.5 max-h-32 overflow-y-auto p-2 bg-muted/30 border border-dashed rounded-lg animate-in fade-in duration-200">
          {attachments.map((file) => {
            const isImg = file.type.startsWith("image/");
            const isUploading = file.uploadStatus === "uploading";

            return (
              <div
                key={file.name}
                className="flex items-center gap-2 bg-background border px-2.5 py-1.5 rounded-lg text-xs min-w-[140px] max-w-[200px] relative group"
              >
                {isImg && file.url !== "#" ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-8 w-8 rounded object-cover border shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary border">
                    <FileText className="h-4 w-4" />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold truncate text-[11px] text-foreground">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>

                  {isUploading && (
                    <div className="h-0.5 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${file.uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeAttachment(file.name)}
                  className="absolute right-[-6px] top-[-6px] hidden group-hover:flex items-center justify-center h-4 w-4 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow cursor-pointer text-[10px]"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main input tools layout */}
      <div className="flex items-end gap-2.5">
        {/* Attachment menu trigger */}
        <div className="flex items-center shrink-0">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={imageInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </Button>

          {/* Emoji Picker Popover */}
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                title="Emojis"
              >
                <Smile className="h-4.5 w-4.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="p-0 border-none bg-transparent shadow-none">
              <EmojiPicker onSelect={(emoji) => {
                setText((prev) => prev + emoji);
                setIsEmojiOpen(false);
              }} />
            </PopoverContent>
          </Popover>

        </div>

        {/* Text Input area or voice recorder */}
        {isRecording ? (
          <div className="flex-1 flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-lg px-4 h-9.5 text-xs text-destructive animate-pulse-slow">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
              <span className="font-bold">Recording Voice Note:</span>
              <span className="font-semibold">{recordingSeconds}s</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStopRecording(false)}
                className="h-6 hover:bg-destructive/15 text-destructive font-bold text-[10px] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleStopRecording(true)}
                className="h-6 bg-destructive hover:bg-destructive/90 text-white font-bold text-[10px] cursor-pointer"
              >
                Send
              </Button>
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="flex-1 min-h-[38px] max-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none overflow-y-auto leading-relaxed shadow-none"
            placeholder={t("writeMessage")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        )}

        {/* Send or Voice Record trigger */}
        <div className="shrink-0 flex items-center">
          {text.trim() || attachments.length > 0 ? (
            <Button
              onClick={handleSend}
              size="icon"
              className="h-9.5 w-9.5 rounded-full cursor-pointer bg-primary text-primary-foreground shadow"
              title="Send Message"
            >
              <Send className="h-4.5 w-4.5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartRecording}
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
              title="Record voice note"
            >
              <Mic className="h-4.5 w-4.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
