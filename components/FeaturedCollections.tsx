import Link from "next/link";

export default function FeaturedCollections() {
  const collections = [
    { title: "Jewellery", desc: "Delicate pieces for every day.", href: "/shop?category=Jewellery" },
    { title: "Handmade Art", desc: "Mini canvases & thoughtful art.", href: "/shop?category=Handmade%20Art" },
    { title: "Scrunchies", desc: "Soft satin sets.", href: "/shop?category=Scrunchies" },
    { title: "Gifts", desc: "Curated gift boxes.", href: "/shop?category=Gifts" }
  ];
  return (
    <div className="collections-grid">
      {collections.map(c => <Link key={c.title} href={c.href} className="collection-card"><h3>{c.title}</h3><p>{c.desc}</p></Link>)}
    </div>
  );
}
