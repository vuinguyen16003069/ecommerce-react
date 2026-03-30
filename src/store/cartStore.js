import { create } from "zustand";
import { persist } from "zustand/middleware";

const updateUserCart = (state, updatedCart) => {
  if (!state.activeUserId) return state.cartsByUser;
  return {
    ...state.cartsByUser,
    [state.activeUserId]: updatedCart,
  };
};

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      cartsByUser: {},
      activeUserId: null,
      hydrateCartForUser: (userId) =>
        set((state) => {
          if (!userId) {
            return { activeUserId: null, cart: [] };
          }
          return {
            activeUserId: userId,
            cart: state.cartsByUser[userId] || [],
          };
        }),
      addToCart: (product, qty = 1) =>
        set((state) => {
          if (!state.activeUserId) return state;
          const targetCart = state.cart;
          const existing = targetCart.find(
            (i) => (i._id || i.id) === (product._id || product.id),
          );
          const updated = existing
            ? targetCart.map((i) =>
                (i._id || i.id) === (product._id || product.id)
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              )
            : [...targetCart, { ...product, quantity: qty }];
          return {
            cart: updated,
            cartsByUser: updateUserCart(state, updated),
          };
        }),
      updateQuantity: (id, amount) =>
        set((state) => {
          if (!state.activeUserId) return state;
          const updated = state.cart.map((item) =>
            (item._id || item.id) === id
              ? { ...item, quantity: Math.max(1, item.quantity + amount) }
              : item,
          );
          return {
            cart: updated,
            cartsByUser: updateUserCart(state, updated),
          };
        }),
      removeFromCart: (id) =>
        set((state) => {
          if (!state.activeUserId) return state;
          const updated = state.cart.filter(
            (item) => (item._id || item.id) !== id,
          );
          return {
            cart: updated,
            cartsByUser: updateUserCart(state, updated),
          };
        }),
      clearCart: () =>
        set((state) => ({
          cart: [],
          cartsByUser: updateUserCart(state, []),
        })),
    }),
    {
      name: "jshop_cart_v3",
    },
  ),
);
