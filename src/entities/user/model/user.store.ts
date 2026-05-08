import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  likedContentIds?: string[];
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (name: string, image: string) => void;
  toggleLike: (contentId: string) => void;
}

export const useUsersStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateProfile: (name, image) =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, name, image } };
          }
          return state;
        }),
      toggleLike: (contentId) =>
        set((state) => {
          if (!state.user) return state;
          const likedContentIds = state.user.likedContentIds || [];
          const isLiked = likedContentIds.includes(contentId);
          return {
            user: {
              ...state.user,
              likedContentIds: isLiked
                ? likedContentIds.filter((id) => id !== contentId)
                : [...likedContentIds, contentId],
            },
          };
        }),
    }),
    { name: 'coreahoy-google-user' },
  ),
);

export const AVATAR_PRESETS = [
  { id: '1', emoji: '🐨', color: '#e5d5b0' },
  { id: '2', emoji: '🦊', color: '#ffd0a8' },
  { id: '3', emoji: '🐼', color: '#d8d8d8' },
  { id: '4', emoji: '🐸', color: '#b8e4b8' },
  { id: '5', emoji: '🐯', color: '#ffd9a0' },
  { id: '6', emoji: '🐧', color: '#b8d8f0' },
  { id: '7', emoji: '🦄', color: '#e8d0f8' },
  { id: '8', emoji: '🐻', color: '#d8c4b8' },
  { id: '9', emoji: '🦁', color: '#f8f0b0' },
  { id: '10', emoji: '🐳', color: '#a8e8f0' },
  { id: '11', emoji: '🦩', color: '#f8d0e0' },
  { id: '12', emoji: '🦝', color: '#d8c8e8' },
];
