import { create } from 'zustand';
import { Conversation, Message, MessageType, ConversationType } from '@/types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/lib/mock-data';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  replyingToMessage: Message | null;
  activeTab: 'all' | 'unread' | 'groups';
  searchQuery: string;
  searchMessagesQuery: string;

  setActiveConversationId: (id: string | null) => void;
  setActiveTab: (tab: 'all' | 'unread' | 'groups') => void;
  setSearchQuery: (query: string) => void;
  setSearchMessagesQuery: (query: string) => void;
  setReplyingToMessage: (message: Message | null) => void;

  sendMessage: (content: string, type: MessageType, extra?: Partial<Message>) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  addReaction: (messageId: string, emoji: string, userId: string) => void;
  removeReaction: (messageId: string, emoji: string, userId: string) => void;

  pinConversation: (id: string) => void;
  muteConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  markAsRead: (id: string) => void;

  createConversation: (name: string, type: ConversationType, members: string[]) => string;
  addMembersToGroup: (conversationId: string, userIds: string[]) => void;
  removeMemberFromGroup: (conversationId: string, userId: string) => void;
  leaveGroup: (conversationId: string, userId: string) => void;
  updateGroupDetails: (conversationId: string, details: Partial<Conversation>) => void;

  // Realtime events triggers
  triggerTypingIndicator: (conversationId: string, userId: string, isTyping: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  messages: MOCK_MESSAGES,
  replyingToMessage: null,
  activeTab: 'all',
  searchQuery: '',
  searchMessagesQuery: '',

  setActiveConversationId: (id) => {
    set({ activeConversationId: id, replyingToMessage: null, searchMessagesQuery: '' });
    if (id) {
      get().markAsRead(id);
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchMessagesQuery: (query) => set({ searchMessagesQuery: query }),
  setReplyingToMessage: (message) => set({ replyingToMessage: message }),

  sendMessage: (content, type, extra) => {
    const { activeConversationId, replyingToMessage } = get();
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `m_${Math.random().toString(36).substr(2, 9)}`,
      conversationId: activeConversationId,
      senderId: 'currentUser',
      senderName: 'Alex Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      content,
      type,
      timestamp: new Date().toISOString(),
      reactions: [],
      ...(replyingToMessage && {
        replyToId: replyingToMessage.id,
        replyToMessage: {
          senderName: replyingToMessage.senderName,
          content: replyingToMessage.content,
          type: replyingToMessage.type
        }
      }),
      ...extra
    };

    set((state) => {
      const chatMessages = state.messages[activeConversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [activeConversationId]: [...chatMessages, newMessage]
      };

      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            unreadCount: 0
          };
        }
        return conv;
      });

      return {
        messages: updatedMessages,
        conversations: updatedConversations,
        replyingToMessage: null
      };
    });
  },

  editMessage: (messageId, newContent) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    set((state) => {
      const chatMessages = state.messages[activeConversationId] || [];
      const updatedMessagesList = chatMessages.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, content: newContent, isEdited: true };
        }
        return msg;
      });

      // Update lastMessage inside conversation details if applicable
      const conversation = state.conversations.find((c) => c.id === activeConversationId);
      const isLastMessage = conversation?.lastMessage?.id === messageId;
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === activeConversationId && isLastMessage && conv.lastMessage) {
          return {
            ...conv,
            lastMessage: { ...conv.lastMessage, content: newContent, isEdited: true }
          };
        }
        return conv;
      });

      return {
        messages: {
          ...state.messages,
          [activeConversationId]: updatedMessagesList
        },
        conversations: updatedConversations
      };
    });
  },

  deleteMessage: (messageId) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    set((state) => {
      const chatMessages = state.messages[activeConversationId] || [];
      const updatedMessagesList = chatMessages.map((msg) => {
        if (msg.id === messageId) {
          return { ...msg, content: 'This message was deleted', isDeleted: true, type: 'text' as const };
        }
        return msg;
      });

      const conversation = state.conversations.find((c) => c.id === activeConversationId);
      const isLastMessage = conversation?.lastMessage?.id === messageId;
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === activeConversationId && isLastMessage && conv.lastMessage) {
          return {
            ...conv,
            lastMessage: { ...conv.lastMessage, content: 'This message was deleted', isDeleted: true, type: 'text' as const }
          };
        }
        return conv;
      });

      return {
        messages: {
          ...state.messages,
          [activeConversationId]: updatedMessagesList
        },
        conversations: updatedConversations
      };
    });
  },

  addReaction: (messageId, emoji, userId) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    set((state) => {
      const chatMessages = state.messages[activeConversationId] || [];
      const updatedMessagesList = chatMessages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions ? [...msg.reactions] : [];
          const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingReactionIndex > -1) {
            const reaction = reactions[existingReactionIndex];
            if (!reaction.userIds.includes(userId)) {
              reactions[existingReactionIndex] = {
                ...reaction,
                userIds: [...reaction.userIds, userId]
              };
            }
          } else {
            reactions.push({ emoji, userIds: [userId] });
          }

          return { ...msg, reactions };
        }
        return msg;
      });

      return {
        messages: {
          ...state.messages,
          [activeConversationId]: updatedMessagesList
        }
      };
    });
  },

  removeReaction: (messageId, emoji, userId) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    set((state) => {
      const chatMessages = state.messages[activeConversationId] || [];
      const updatedMessagesList = chatMessages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions ? [...msg.reactions] : [];
          const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

          if (existingReactionIndex > -1) {
            const reaction = reactions[existingReactionIndex];
            const updatedUserIds = reaction.userIds.filter((uid) => uid !== userId);

            if (updatedUserIds.length === 0) {
              reactions.splice(existingReactionIndex, 1);
            } else {
              reactions[existingReactionIndex] = {
                ...reaction,
                userIds: updatedUserIds
              };
            }
          }
          return { ...msg, reactions };
        }
        return msg;
      });

      return {
        messages: {
          ...state.messages,
          [activeConversationId]: updatedMessagesList
        }
      };
    });
  },

  pinConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    }));
  },

  muteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isMuted: !c.isMuted } : c
      )
    }));
  },

  archiveConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isArchived: !c.isArchived } : c
      )
    }));
  },

  deleteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId: state.activeConversationId === id ? null : state.activeConversationId
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      )
    }));
  },

  createConversation: (name, type, members) => {
    const newId = `c_${Math.random().toString(36).substr(2, 9)}`;
    const newConversation: Conversation = {
      id: newId,
      name,
      type,
      members: ['currentUser', ...members],
      adminId: type === 'group' ? 'currentUser' : undefined,
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      isTyping: []
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      messages: {
        ...state.messages,
        [newId]: []
      }
    }));

    return newId;
  },

  addMembersToGroup: (conversationId, userIds) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, members: Array.from(new Set([...c.members, ...userIds])) };
        }
        return c;
      })
    }));
  },

  removeMemberFromGroup: (conversationId, userId) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, members: c.members.filter((uid) => uid !== userId) };
        }
        return c;
      })
    }));
  },

  leaveGroup: (conversationId, userId) => {
    set((state) => {
      const updatedConversations = state.conversations.map((c) => {
        if (c.id === conversationId) {
          return { ...c, members: c.members.filter((uid) => uid !== userId) };
        }
        return c;
      });
      const leavingActive = state.activeConversationId === conversationId;
      return {
        conversations: updatedConversations,
        activeConversationId: leavingActive ? null : state.activeConversationId
      };
    });
  },

  updateGroupDetails: (conversationId, details) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, ...details } : c
      )
    }));
  },

  triggerTypingIndicator: (conversationId, userId, isTyping) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id === conversationId) {
          const currentTyping = c.isTyping || [];
          const updatedTyping = isTyping
            ? Array.from(new Set([...currentTyping, userId]))
            : currentTyping.filter((uid) => uid !== userId);
          return { ...c, isTyping: updatedTyping };
        }
        return c;
      })
    }));
  }
}));

