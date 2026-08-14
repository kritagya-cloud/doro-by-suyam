 "use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type CartItem = { product: Product; quantity: number };
type CartContextType = {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("doro-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("doro-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    add: (product: Product) => setItems(prev => {
      const existing = prev.find(x => x.product.id === product.id);
      if (existing) return prev.map(x => x.product.id === product.id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { product, quantity: 1 }];
    }),
    remove: (id: string) => setItems(prev => prev.filter(x => x.product.id !== id)),
    setQty: (id: string, quantity: number) => setItems(prev => quantity <= 0 ? prev.filter(x => x.product.id !== id) : prev.map(x => x.product.id === id ? { ...x, quantity } : x)),
    clear: () => setItems([]),
    subtotal: items.reduce((sum, x) => sum + (x.product.price || 0) * x.quantity, 0),
    count: items.reduce((sum, x) => sum + x.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
