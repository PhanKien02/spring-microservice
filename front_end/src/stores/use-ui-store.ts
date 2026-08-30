import { create } from 'zustand';

interface UIState {
  isDetailsOpen: boolean;
  isSearchOpen: boolean;
  isCommandPaletteOpen: boolean;
  currentView: 'chat' | 'settings';
  settingsTab: 'profile' | 'account' | 'appearance' | 'notifications' | 'privacy' | 'security' | 'language' | 'calls';
  isMobileSidebarOpen: boolean;

  setDetailsOpen: (isOpen: boolean) => void;
  toggleDetails: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setCurrentView: (view: 'chat' | 'settings') => void;
  setSettingsTab: (tab: UIState['settingsTab']) => void;
  setMobileSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDetailsOpen: false,
  isSearchOpen: false,
  isCommandPaletteOpen: false,
  currentView: 'chat',
  settingsTab: 'profile',
  isMobileSidebarOpen: true, // true means showing the list of chats on mobile

  setDetailsOpen: (isOpen) => set({ isDetailsOpen: isOpen }),
  toggleDetails: () => set((state) => ({ isDetailsOpen: !state.isDetailsOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setCurrentView: (view) => set({ currentView: view }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),
  setMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen })
}));

