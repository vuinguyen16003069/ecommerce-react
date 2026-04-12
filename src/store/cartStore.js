import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      couponDiscount: 0,
      couponCode: '',
      cartOwnerId: null,
      cartByUser: {},
      hydrateCartForUser: (userId) =>
        set((state) => {
          if (!userId)
            return {
              cartOwnerId: null,
              cart: [],
              couponDiscount: 0,
              couponCode: '',
            };
          const saved = state.cartByUser[userId] || {
            cart: [],
            couponDiscount: 0,
            couponCode: '',
          };
          return {
            cartOwnerId: userId,
            cart: saved.cart || [],
            couponDiscount: saved.couponDiscount || 0,
            couponCode: saved.couponCode || '',
          };
        }),
      saveCurrentCartForOwner: () =>
        set((state) => {
          if (!state.cartOwnerId) return {};
          return {
            cartByUser: {
              ...state.cartByUser,
              [state.cartOwnerId]: {
                cart: state.cart,
                couponDiscount: state.couponDiscount,
                couponCode: state.couponCode,
              },
            },
          };
        }),
      resetCartSession: () =>
        set({ cartOwnerId: null, cart: [], couponDiscount: 0, couponCode: '' }),
      addToCart: (product, qty = 1) =>
        set((state) => {
          const ex = state.cart.find((i) => (i._id || i.id) === (product._id || product.id));
          const currentQty = ex ? ex.quantity : 0;
          const newQty = currentQty + qty;

          // Stock check
          if (product.stock !== undefined && newQty > product.stock) {
            return { cart: state.cart }; // Or cap it at product.stock
          }

          const updated = ex
            ? state.cart.map((i) =>
                (i._id || i.id) === (product._id || product.id) ? { ...i, quantity: newQty } : i
              )
            : [...state.cart, { ...product, quantity: qty }];
          const next = { cart: updated };
          if (state.cartOwnerId) {
            next.cartByUser = {
              ...state.cartByUser,
              [state.cartOwnerId]: {
                cart: updated,
                couponDiscount: state.couponDiscount,
                couponCode: state.couponCode,
              },
            };
          }
          return next;
        }),
      updateQuantity: (id, amount) =>
        set((state) => {
          const item = state.cart.find((i) => (i._id || i.id) === id);
          if (!item) return { cart: state.cart };

          const newQty = Math.max(1, item.quantity + amount);
          if (item.stock !== undefined && newQty > item.stock) {
            return { cart: state.cart };
          }

          const updated = state.cart.map((i) =>
            (i._id || i.id) === id ? { ...i, quantity: newQty } : i
          );
          const next = { cart: updated };
          if (state.cartOwnerId) {
            next.cartByUser = {
              ...state.cartByUser,
              [state.cartOwnerId]: {
                cart: updated,
                couponDiscount: state.couponDiscount,
                couponCode: state.couponCode,
              },
            };
          }
          return next;
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => (i._id || i.id) !== id),
          ...(state.cartOwnerId
            ? {
                cartByUser: {
                  ...state.cartByUser,
                  [state.cartOwnerId]: {
                    cart: state.cart.filter((i) => (i._id || i.id) !== id),
                    couponDiscount: state.couponDiscount,
                    couponCode: state.couponCode,
                  },
                },
              }
            : {}),
        })),
      clearCart: () =>
        set((state) => ({
          cart: [],
          couponDiscount: 0,
          couponCode: '',
          ...(state.cartOwnerId
            ? {
                cartByUser: {
                  ...state.cartByUser,
                  [state.cartOwnerId]: {
                    cart: [],
                    couponDiscount: 0,
                    couponCode: '',
                  },
                },
              }
            : {}),
        })),
      applyCoupon: (code, amount) =>
        set((state) => ({
          couponCode: code,
          couponDiscount: amount,
          ...(state.cartOwnerId
            ? {
                cartByUser: {
                  ...state.cartByUser,
                  [state.cartOwnerId]: {
                    cart: state.cart,
                    couponDiscount: amount,
                    couponCode: code,
                  },
                },
              }
            : {}),
        })),
      clearCoupon: () =>
        set((state) => ({
          couponCode: '',
          couponDiscount: 0,
          ...(state.cartOwnerId
            ? {
                cartByUser: {
                  ...state.cartByUser,
                  [state.cartOwnerId]: {
                    cart: state.cart,
                    couponDiscount: 0,
                    couponCode: '',
                  },
                },
              }
            : {}),
        })),
      getCartCount: () => {
        // We'll compute this in components, store shouldn't really have getter functions like this unless it's a computed signal.
      },
    }),
    {
      name: 'jshop_cart_v3',
    }
  )
);
