import { create } from 'zustand';
import { User } from '@/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: MOCK_USERS.find(u => u.id === 'currentUser') || null,
  isAuthenticated: true, // Default to true for ease of development / live demo
  login: async (email) => {
    const user = MOCK_USERS.find(u => u.email === email) || {
      id: 'currentUser',
      fullName: 'Alex Johnson',
      userName: 'alexj',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      status: 'online',
      bio: 'Frontend Engineer. React & Next.js specialist.'
    } as User;
    set({ currentUser: user, isAuthenticated: true });
    return true;
  },
  register: async (name, email, username) => {
    const newUser: User = {
      id: 'currentUser',
      fullName: name,
      userName: username,
      email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      status: 'online',
      bio: 'New user profile bio.'
    };
    set({ currentUser: newUser, isAuthenticated: true });
    return true;
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
  updateProfile: (data) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
  }))
}));

