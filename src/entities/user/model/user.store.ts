import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  likedContentIds: string[];
  login: (user: User) => void;
  logout: () => void;
  toggleLike: (contentId: string) => void;
}

export const useUsersStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      likedContentIds: [],
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false, likedContentIds: [] }),
      toggleLike: (contentId) =>
        set((state) => ({
          likedContentIds: state.likedContentIds.includes(contentId)
            ? state.likedContentIds.filter((id) => id !== contentId)
            : [...state.likedContentIds, contentId],
        })),
    }),
    { name: 'coreahoy-user' },
  ),
);
