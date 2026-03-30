import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cartStore";

const mergeWithCachedProfile = (incoming, cached) => {
  if (!incoming) {
    return null;
  }
  if (!cached) {
    return { ...incoming, wishlist: incoming.wishlist || [] };
  }
  return {
    ...cached,
    ...incoming,
    wishlist: cached.wishlist ?? incoming.wishlist ?? [],
  };
};

export const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      profiles: {},
      setCurrentUser: (user) => {
        const userId = user?._id || user?.id || null;
        set((state) => {
          if (!user) {
            return { currentUser: null };
          }
          const cached = userId ? state.profiles[userId] : undefined;
          const merged = mergeWithCachedProfile(user, cached);
          return {
            currentUser: merged,
            profiles: userId
              ? { ...state.profiles, [userId]: merged }
              : state.profiles,
          };
        });
        useCartStore.getState().hydrateCartForUser(userId);
      },
      logout: () => {
        useCartStore.getState().hydrateCartForUser(null);
        set({ currentUser: null });
      },
      toggleWishlist: (productId) =>
        set((state) => {
          if (!state.currentUser) return state;
          const wl = state.currentUser.wishlist || [];
          const newWl = wl.includes(productId)
            ? wl.filter((id) => id !== productId)
            : [...wl, productId];
          const userId = state.currentUser._id || state.currentUser.id;
          const updatedProfile = { ...state.currentUser, wishlist: newWl };
          return {
            currentUser: updatedProfile,
            profiles: userId
              ? { ...state.profiles, [userId]: updatedProfile }
              : state.profiles,
          };
        }),
    }),
    {
      name: "jshop_user_v3",
    },
  ),
);
