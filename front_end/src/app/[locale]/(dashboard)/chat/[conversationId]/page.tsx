"use client";

import * as React from "react";
import { useConversationStore } from "@/stores/use-conversation-store";
import { ChatLayout } from "@/components/chat/chat-layout";

export default function LocalChatConversationPage({
  params
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const setActiveConversationId = useConversationStore((s) => s.setActiveConversationId);
  const unwrappedParams = React.use(params);

  React.useEffect(() => {
    if (unwrappedParams?.conversationId) {
      setActiveConversationId(unwrappedParams.conversationId);
    }
  }, [unwrappedParams?.conversationId, setActiveConversationId]);

  return <ChatLayout />;
}

