"use client";

import * as React from "react";
import { Download, Maximize2, X } from "lucide-react";
import { FileMetadata } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageMessageProps {
  metadata: FileMetadata;
}

export function ImageMessage({ metadata }: ImageMessageProps) {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  return (
    <div className="relative group rounded-lg overflow-hidden border border-border/10 max-w-[280px] sm:max-w-[320px] bg-muted/30">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
        <img
          src={metadata.url}
          alt={metadata.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover controls overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors cursor-pointer">
            <Maximize2 className="h-4.5 w-4.5" />
          </button>
          <a
            href={metadata.url}
            download
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors cursor-pointer"
          >
            <Download className="h-4.5 w-4.5" />
          </a>
        </div>
      </div>

      {/* Info bar if caption needed, or details */}
      <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-muted-foreground bg-card/60">
        <span className="truncate max-w-[160px] font-semibold">{metadata.name}</span>
        <span>{formatFileSize(metadata.size)}</span>
      </div>

      {/* Fullscreen Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none flex items-center justify-center">
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-lg">
            <img
              src={metadata.url}
              alt={metadata.name}
              className="max-h-[80vh] object-contain mx-auto"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 px-4 py-2 rounded-full border border-white/10 text-white shrink-0">
              <span className="text-xs font-semibold truncate max-w-[200px]">{metadata.name}</span>
              <a
                href={metadata.url}
                download
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

