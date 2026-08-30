export interface CallMetadata {
        type: 'voice' | 'video';
        status: 'calling' | 'connecting' | 'connected' | 'ended' | 'declined' | 'missed';
        duration?: number; // in seconds
        participants: string[];
}

export interface ActiveCall {
        id: string;
        conversationId: string;
        callerId: string;
        receiverId?: string; // for direct calls
        type: 'voice' | 'video';
        status: CallMetadata['status'];
        startTime?: string;
        duration: number; // seconds elapsed
        isMuted: boolean;
        isCameraOff: boolean;
        isScreenSharing: boolean;
        participants: string[];
}
