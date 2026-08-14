"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type WishlistContextType = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("doro-wishlist");
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("doro-wishlist", JSON.stringify(ids));
  }, [ids]);

  const value = useMemo(() => ({
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (product: Product) => setIds(prev => prev.includes(product.id) ? prev.filter(x => x !== product.id) : [...prev, product.id]),
    count: ids.length
  }), [ids]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

export default WishlistProvider;
