import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product, qty = 1) => set((state) => {
        const ex = state.cart.find((i) => (i._id || i.id) === (product._id || product.id))
        const updated = ex 
          ? state.cart.map((i) => (i._id || i.id) === (product._id || product.id) ? { ...i, quantity: i.quantity + qty } : i) 
          : [...state.cart, { ...product, quantity: qty }]
        return { cart: updated }
      }),
      updateQuantity: (id, amount) => set((state) => ({
        cart: state.cart.map(i => (i._id || i.id) === id ? { ...i, quantity: Math.max(1, i.quantity + amount) } : i)
      })),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(i => (i._id || i.id) !== id)
      })),
      clearCart: () => set({ cart: [] }),
      getCartCount: () => {
        // We'll compute this in components, store shouldn't really have getter functions like this unless it's a computed signal.
      }
    }),
    {
      name: 'jshop_cart_v3',
    }
  )
)
