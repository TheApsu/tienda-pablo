import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

type AddItemInput = Omit<CartItem, 'quantity'>

type CartState = {
  items: CartItem[]
  addItem: (product: AddItemInput, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.productId)
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, ...product, quantity: clamp(item.quantity + quantity, 1, product.stock) }
                  : item,
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: clamp(quantity, 1, product.stock) }] }
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: clamp(quantity, 1, item.stock) } : item,
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)
