 "use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

export default function Header() {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <Image src="/logo.png" alt="Doro by Suyam" width={64} height={64} priority />
        <div className="brand-copy"><strong className="brand-title">doro BY SUYAM</strong><small className="brand-tag">Gifts that say what words can't.</small></div>
      </Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/shop?category=Jewellery">Jewellery</Link>
        <Link href="/shop?category=Handmade%20Art">Handmade Art</Link>
        <Link href="/shop?category=Scrunchies">Scrunchies</Link>
      </nav>
      <button className="icon-button mobile-menu" onClick={() => setOpen(s => !s)} aria-label="Menu">{open ? <X/> : <Menu/>}</button>
      {open && <div className="mobile-nav"><Link href="/">Home</Link><Link href="/shop">Shop</Link><Link href="/shop?category=Jewellery">Jewellery</Link><Link href="/shop?category=Handmade%20Art">Handmade Art</Link><Link href="/shop?category=Scrunchies">Scrunchies</Link></div>}
      <div className="header-actions">
        <Link href="/shop?view=wishlist" className="icon-button" aria-label="Wishlist">
          <Heart size={19} />
          <span style={{marginLeft:6}}>{wishlistCount}</span>
        </Link>
        <Link href="/cart" className="cart-button" aria-label="Cart">
          <ShoppingBag size={19} />
          <span>{count}</span>
        </Link>
      </div>
    </header>
  );
}
