import { CallMetadata } from './call';

export type MessageType = 'text' | 'image' | 'file' | 'emoji' | 'call';

export interface FileMetadata {
        name: string;
        url: string;
        size: number; // in bytes
        type: string; // mime type
        uploadProgress?: number;
        uploadStatus?: 'uploading' | 'completed' | 'failed' | 'cancelled';
}

export interface MessageReaction {
        emoji: string;
        userIds: string[];
}

export interface Message {
        id: string;
        conversationId: string;
        senderId: string;
        senderName: string;
        senderAvatar: string;
        content: string;
        type: MessageType;
        timestamp: string;
        reactions?: MessageReaction[];
        replyToId?: string;
        replyToMessage?: {
                senderName: string;
                content: string;
                type: MessageType;
        };
        isEdited?: boolean;
        isDeleted?: boolean;
        fileMetadata?: FileMetadata;
        callMetadata?: CallMetadata;
}
