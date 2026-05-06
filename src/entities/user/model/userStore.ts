import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  email: string;
  avatarEmoji: string;
  avatarColor: string;
  likedContentIds: string[];
}

interface UserState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  login: () => void;
  completeOnboarding: (name: string, avatarEmoji: string, avatarColor: string) => void;
  updateProfile: (name: string, avatarEmoji: string, avatarColor: string) => void;
  toggleLike: (contentId: string) => void;
  logout: () => void;
  deleteAccount: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isOnboarded: false,

      login: () => set({ isLoggedIn: true }),

      completeOnboarding: (name, avatarEmoji, avatarColor) =>
        set({
          user: {
            name,
            email: 'user@gmail.com',
            avatarEmoji,
            avatarColor,
            likedContentIds: ['c1', 'c3'],
          },
          isOnboarded: true,
        }),

      updateProfile: (name, avatarEmoji, avatarColor) =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, name, avatarEmoji, avatarColor } };
          }
          return {
            user: {
              name,
              email: 'test@example.com',
              avatarEmoji,
              avatarColor,
              likedContentIds: ['c1', 'c3'],
            },
            isLoggedIn: true,
          };
        }),

      toggleLike: (contentId) =>
        set((state) => {
          if (!state.user) return state;
          const isLiked = state.user.likedContentIds.includes(contentId);
          return {
            user: {
              ...state.user,
              likedContentIds: isLiked
                ? state.user.likedContentIds.filter((id) => id !== contentId)
                : [...state.user.likedContentIds, contentId],
            },
          };
        }),

      logout: () => set({ user: null, isLoggedIn: false, isOnboarded: false }),
      deleteAccount: () => set({ user: null, isLoggedIn: false, isOnboarded: false }),
    }),
    { name: 'coreahoy-user' },
  ),
);

export const AVATAR_PRESETS = [
  { emoji: '🐨', color: '#e5d5b0' },
  { emoji: '🦊', color: '#ffd0a8' },
  { emoji: '🐼', color: '#d8d8d8' },
  { emoji: '🐸', color: '#b8e4b8' },
  { emoji: '🐯', color: '#ffd9a0' },
  { emoji: '🐧', color: '#b8d8f0' },
  { emoji: '🦄', color: '#e8d0f8' },
  { emoji: '🐻', color: '#d8c4b8' },
  { emoji: '🦁', color: '#f8f0b0' },
  { emoji: '🐳', color: '#a8e8f0' },
  { emoji: '🦩', color: '#f8d0e0' },
  { emoji: '🦝', color: '#d8c8e8' },
];
