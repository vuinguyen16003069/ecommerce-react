import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cartStore';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      justLoggedOut: false,
      setCurrentUser: (user) => {
        const prevUser = get().currentUser;
        const prevId = prevUser?._id || prevUser?.id || null;
        const nextId = user?._id || user?.id || null;

        set({ currentUser: user, justLoggedOut: false });

        if (nextId && nextId !== prevId) {
          useCartStore.getState().hydrateCartForUser(nextId);
        }
      },
      logout: () => {
        useCartStore.getState().saveCurrentCartForOwner();
        useCartStore.getState().resetCartSession();
        set({ currentUser: null, justLoggedOut: true });
      },
      clearJustLoggedOut: () => set({ justLoggedOut: false }),
      toggleWishlist: (productId) =>
        set((state) => {
          if (!state.currentUser) return state;
          const wl = state.currentUser.wishlist || [];
          const newWl = wl.includes(productId)
            ? wl.filter((id) => id !== productId)
            : [...wl, productId];
          return { currentUser: { ...state.currentUser, wishlist: newWl } };
        }),
    }),
    {
      name: 'jshop_user_v3',
      onRehydrateStorage: () => (state) => {
        const userId = state?.currentUser?._id || state?.currentUser?.id;
        if (userId) {
          useCartStore.getState().hydrateCartForUser(userId);
        } else {
          useCartStore.getState().resetCartSession();
        }
      },
    }
  )
);
