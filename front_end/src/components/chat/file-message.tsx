"use client";

import { Download, FileText, Loader2, RefreshCw, X } from "lucide-react";
import { FileMetadata } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileMessageProps {
  metadata: FileMetadata;
}

export function FileMessage({ metadata }: FileMessageProps) {
  const isUploading = metadata.uploadStatus === "uploading";
  const isFailed = metadata.uploadStatus === "failed";
  const isCompleted = !metadata.uploadStatus || metadata.uploadStatus === "completed";

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-lg border bg-card text-card-foreground shadow-sm max-w-[280px] sm:max-w-[320px]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FileText className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate text-foreground leading-snug">
            {metadata.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatFileSize(metadata.size)}
          </p>
        </div>

        {isCompleted && (
          <a
            href={metadata.url}
            download
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer transition-colors"
            title="Download file"
          >
            <Download className="h-4.5 w-4.5" />
          </a>
        )}

        {isUploading && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive shrink-0 cursor-pointer transition-colors"
            title="Cancel upload"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}

        {isFailed && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-primary shrink-0 cursor-pointer transition-colors"
            title="Retry upload"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="space-y-1 mt-1">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${metadata.uploadProgress || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
            <span>Uploading...</span>
            <span>{metadata.uploadProgress || 0}%</span>
          </div>
        </div>
      )}

      {isFailed && (
        <p className="text-[10px] font-semibold text-destructive mt-0.5">
          Upload failed. Please try again.
        </p>
      )}
    </div>
  );
}

