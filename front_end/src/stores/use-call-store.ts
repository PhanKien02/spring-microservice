import { create } from 'zustand';
import { ActiveCall } from '@/types';

interface CallState {
  activeCall: ActiveCall | null;
  startCall: (conversationId: string, type: 'voice' | 'video', participants: string[], callerId: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenSharing: () => void;
  incrementDuration: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  activeCall: null,

  startCall: (conversationId, type, participants, callerId) => {
    set({
      activeCall: {
        id: `call_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        callerId,
        type,
        status: 'calling',
        duration: 0,
        isMuted: false,
        isCameraOff: type === 'voice',
        isScreenSharing: false,
        participants
      }
    });

    // Simulate connection after 2 seconds
    setTimeout(() => {
      set((state) => {
        if (state.activeCall && state.activeCall.status === 'calling') {
          return {
            activeCall: {
              ...state.activeCall,
              status: 'connected',
              startTime: new Date().toISOString()
            }
          };
        }
        return state;
      });
    }, 2500);
  },

  acceptCall: () => {
    set((state) => {
      if (state.activeCall) {
        return {
          activeCall: {
            ...state.activeCall,
            status: 'connected',
            startTime: new Date().toISOString()
          }
        };
      }
      return state;
    });
  },

  rejectCall: () => {
    set({ activeCall: null });
  },

  endCall: () => {
    set((state) => {
      if (state.activeCall) {
        // Return active call with status 'ended' temporarily so components can transition
        return {
          activeCall: {
            ...state.activeCall,
            status: 'ended'
          }
        };
      }
      return state;
    });
    // Remove the call screen completely after a short delay
    setTimeout(() => {
      set({ activeCall: null });
    }, 1500);
  },

  toggleMute: () => {
    set((state) => {
      if (state.activeCall) {
        return {
          activeCall: {
            ...state.activeCall,
            isMuted: !state.activeCall.isMuted
          }
        };
      }
      return state;
    });
  },

  toggleCamera: () => {
    set((state) => {
      if (state.activeCall) {
        return {
          activeCall: {
            ...state.activeCall,
            isCameraOff: !state.activeCall.isCameraOff
          }
        };
      }
      return state;
    });
  },

  toggleScreenSharing: () => {
    set((state) => {
      if (state.activeCall) {
        return {
          activeCall: {
            ...state.activeCall,
            isScreenSharing: !state.activeCall.isScreenSharing
          }
        };
      }
      return state;
    });
  },

  incrementDuration: () => {
    set((state) => {
      if (state.activeCall && state.activeCall.status === 'connected') {
        return {
          activeCall: {
            ...state.activeCall,
            duration: state.activeCall.duration + 1
          }
        };
      }
      return state;
    });
  }
}));

