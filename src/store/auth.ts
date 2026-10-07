import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: { name: string; email: string } | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email, name = 'Assembly Member') => set({ user: { email, name } }),
      signOut: () => set({ user: null }),
    }),
    { name: 'assembly-auth' },
  ),
);
