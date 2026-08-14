 "use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return <button className="primary-button" disabled={product.price == null} onClick={() => add(product)}>
    <ShoppingBag size={18}/> {product.price == null ? "Price coming soon" : "Add to bag"}
  </button>;
}
