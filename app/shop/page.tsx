import ShopGrid from "@/components/ShopGrid";

export default async function Shop({ searchParams }: { searchParams: Promise<{category?: string, view?: string}> }) {
  const params = await searchParams;
  return <section className="section shop-page"><div className="section-heading"><div><p className="eyebrow">THE DORO COLLECTION</p><h1>Find something lovely.</h1></div></div><ShopGrid initialCategory={params.category || "All"} initialView={params.view || undefined} /></section>;
}
