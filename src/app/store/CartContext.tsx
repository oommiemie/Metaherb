import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  option: string;
  quantity: number;
  inStock: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.option === item.option);
      if (existing) {
        return prev.map((i) => (i.productId === item.productId && i.option === item.option ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId));
  const updateQuantity = (productId: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clearCart = () => setItems([]);
  const total = items.filter((i) => i.inStock).reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
