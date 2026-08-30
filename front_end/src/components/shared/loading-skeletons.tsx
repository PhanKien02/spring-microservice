"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ConversationSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-3.5 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {Array.from({ length: 4 }).map((_, idx) => {
        const isLeft = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`flex items-end gap-3 ${isLeft ? "justify-start" : "flex-row-reverse"
              }`}
          >
            {isLeft && <Skeleton className="h-8 w-8 rounded-full" />}
            <div className="space-y-1">
              {isLeft && <Skeleton className="h-3 w-16" />}
              <Skeleton
                className={`h-14 w-60 rounded-lg ${isLeft ? "rounded-bl-none" : "rounded-br-none"
                  }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function UserSkeleton() {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-14" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-48" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4.5 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
        <Skeleton className="h-9 w-24 ml-auto" />
      </div>
    </div>
  );
}

