import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCartStore } from './cartStore'

export const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      justLoggedOut: false,
      setCurrentUser: (user) => set({ currentUser: user, justLoggedOut: false }),
      logout: () => {
        useCartStore.getState().clearCart()
        set({ currentUser: null, justLoggedOut: true })
      },
      clearJustLoggedOut: () => set({ justLoggedOut: false }),
      toggleWishlist: (productId) => set((state) => {
        if (!state.currentUser) return state
        const wl = state.currentUser.wishlist || []
        const newWl = wl.includes(productId) ? wl.filter(id => id !== productId) : [...wl, productId]
        return { currentUser: { ...state.currentUser, wishlist: newWl } }
      })
    }),
    {
      name: 'jshop_user_v3',
    }
  )
)
