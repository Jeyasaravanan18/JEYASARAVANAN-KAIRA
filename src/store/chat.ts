import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

interface ChatState {
  open: boolean;
  messages: ChatMessage[];
  setOpen: (open: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      open: false,
      messages: [],
      setOpen: (open) => set({ open }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      clear: () => set({ messages: [] }),
    }),
    { name: 'assembly-chat', storage: createJSONStorage(() => sessionStorage) },
  ),
);
