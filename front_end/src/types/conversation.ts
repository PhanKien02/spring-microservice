import { Message } from './message';

export type ConversationType = 'direct' | 'group';

export interface Conversation {
        id: string;
        name: string;
        avatar?: string;
        type: ConversationType;
        members: string[]; // User IDs
        adminId?: string; // Group admin User ID
        lastMessage?: Message;
        unreadCount: number;
        isPinned: boolean;
        isMuted: boolean;
        isArchived: boolean;
        isTyping?: string[]; // List of user IDs typing
}
