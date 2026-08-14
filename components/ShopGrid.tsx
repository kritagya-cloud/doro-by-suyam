 "use client";

import { useMemo, useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

import { useWishlist } from "@/components/WishlistProvider";

export default function ShopGrid({ initialCategory = "All", initialView }: { initialCategory?: string; initialView?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const wishlist = useWishlist();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/products').then(r => r.json()).then(d => { if (!mounted) return; setProducts(d.products || []); }).catch(() => { /* ignore */ });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => products.filter(p => {
    if (category !== "All" && p.category !== category) return false;
    if (!p.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (minPrice !== "" && (p.price == null || p.price < Number(minPrice))) return false;
    if (maxPrice !== "" && (p.price == null || p.price > Number(maxPrice))) return false;
    return true;
  }), [category, query, minPrice, maxPrice]);

  // If wishlist view requested, filter by wishlist ids
  const viewFiltered = useMemo(() => {
    if (initialView === 'wishlist') return products.filter(p => wishlist.has(p.id));
    return filtered;
  }, [initialView, wishlist, filtered]);

  const sorted = useMemo(() => {
    const copy = [...viewFiltered];
    if (sort === "low") return copy.sort((a,b) => (a.price||0) - (b.price||0));
    if (sort === "high") return copy.sort((a,b) => (b.price||0) - (a.price||0));
    return copy;
  }, [viewFiltered, sort]);

  return (
    <>
      <div className="shop-toolbar">
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div className="category-pills">
            {categories.map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}
          </div>
          <button className="secondary-button" onClick={() => setShowFilters(s => !s)}><Filter size={14}/> Filters</button>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <label className="search-box"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search Doro..." /></label>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:'1px solid var(--line)',padding:'8px'}}>
            <option value="featured">Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showFilters && <div className="shop-filters" style={{display:'flex',gap:12,marginBottom:18,alignItems:'center'}}>
        <label style={{display:'flex',gap:8,alignItems:'center'}}><small>Min</small><input type="number" value={minPrice as any} onChange={e=>setMinPrice(e.target.value === "" ? "" : Number(e.target.value))} /></label>
        <label style={{display:'flex',gap:8,alignItems:'center'}}><small>Max</small><input type="number" value={maxPrice as any} onChange={e=>setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))} /></label>
        <button className="secondary-button" onClick={() => { setMinPrice(""); setMaxPrice(""); }}>Clear</button>
      </div>}

      <div className="product-grid">{sorted.map(p => <ProductCard key={p.id} product={p} />)}</div>
      {filtered.length === 0 && <div className="empty-state">No treasures found. Try another search.</div>}
    </>
  );
}
