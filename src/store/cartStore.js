import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product, qty = 1) => set((state) => {
        const ex = state.cart.find((i) => (i._id || i.id) === (product._id || product.id))
        const currentQty = ex ? ex.quantity : 0
        const newQty = currentQty + qty
        
        // Stock check
        if (product.stock !== undefined && newQty > product.stock) {
          return { cart: state.cart } // Or cap it at product.stock
        }

        const updated = ex 
          ? state.cart.map((i) => (i._id || i.id) === (product._id || product.id) ? { ...i, quantity: newQty } : i) 
          : [...state.cart, { ...product, quantity: qty }]
        return { cart: updated }
      }),
      updateQuantity: (id, amount) => set((state) => {
        const item = state.cart.find(i => (i._id || i.id) === id)
        if (!item) return { cart: state.cart }
        
        const newQty = Math.max(1, item.quantity + amount)
        if (item.stock !== undefined && newQty > item.stock) {
          return { cart: state.cart }
        }

        return {
          cart: state.cart.map(i => (i._id || i.id) === id ? { ...i, quantity: newQty } : i)
        }
      }),
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
