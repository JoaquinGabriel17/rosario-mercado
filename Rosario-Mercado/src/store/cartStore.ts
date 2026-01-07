import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  productId: string;
  name: string;
  price: number;
  availableStock: number;
  sellerId: string; // <-- Nueva propiedad necesaria
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  currentSellerId: string | null; // <-- Estado para trackear al vendedor actual
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currentSellerId: null,

      addItem: (product) => {
        const { currentSellerId } = get();
        // 1. VALIDACIÓN DE SELLER:
        // Si ya hay productos y el seller del nuevo producto es diferente al actual
        if (currentSellerId && product.sellerId !== currentSellerId) {
          alert("No puedes agregar productos de diferentes vendedores. Vacía el carrito para comprar a este vendedor.");
          return;
        }

        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.productId);

          // 2. VALIDACIÓN DE STOCK (Producto existente)
          if (existingItem) {
            if (existingItem.quantity >= product.availableStock) {
              return { items: state.items };
            }

            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          // 3. AGREGAR PRODUCTO NUEVO
          if (product.availableStock > 0) {
            return { 
              items: [...state.items, { ...product, quantity: 1 }],
              // Seteamos el sellerId si es el primer producto
              currentSellerId: product.sellerId 
            };
          }

          return { items: state.items };
        });
      },

      decreaseItem: (productId) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === productId);
          if (!existingItem) return { items: state.items };

          if (existingItem.quantity === 1) {
            const newItems = state.items.filter((item) => item.productId !== productId);
            return { 
              items: newItems,
              // Si el carrito queda vacío, reseteamos el sellerId
              currentSellerId: newItems.length === 0 ? null : state.currentSellerId 
            };
          }
          
          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.productId !== productId);
          return {
            items: newItems,
            // Si el carrito queda vacío, reseteamos el sellerId
            currentSellerId: newItems.length === 0 ? null : state.currentSellerId
          };
        });
      },

      clearCart: () => set({ 
        items: [], 
        currentSellerId: null // Importante limpiar el seller también
      }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'shopping-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);