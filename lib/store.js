import { create }  from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // رقم الطاولة
      tableNumber: null,
      setTableNumber: (num) => set({ tableNumber: String(num) }),

      // اللغة
      lang: 'ar',
      setLang: (lang) => set({ lang }),

      // السلة  { itemId: qty }
      cart: {},
      addItem: (itemId) =>
        set((s) => ({ cart: { ...s.cart, [itemId]: (s.cart[itemId] || 0) + 1 } })),
      changeQty: (itemId, delta) =>
        set((s) => {
          const q = (s.cart[itemId] || 0) + delta
          const c = { ...s.cart }
          if (q <= 0) delete c[itemId]; else c[itemId] = q
          return { cart: c }
        }),
      clearCart:  () => set({ cart: {} }),
      totalItems: () => Object.values(get().cart).reduce((a, b) => a + b, 0),

      // Toast
      toast:      null,
      showToast:  (message, color = 'gold') => set({ toast: { message, color } }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name:        'restaurant-store',
      partialize:  (s) => ({ tableNumber: s.tableNumber, lang: s.lang }),
    }
  )
)

export default useStore
