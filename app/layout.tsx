import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import WishlistProvider from "@/components/WishlistProvider";

export const metadata: Metadata = {
  title: "Doro by Suyam — Gifts that say what words can't",
  description: "Thoughtfully chosen jewellery, handmade art and little treasures by Doro.",
  keywords: ["gifts","handmade","jewellery","Doro by Suyam","premium gifts","Indian gifts"],
  openGraph: {
    title: "Doro by Suyam — Gifts that say what words can't",
    description: "Thoughtfully chosen jewellery, handmade art and little treasures by Doro.",
    url: "https://your-doro-store.example/",
    siteName: "Doro by Suyam",
    images: ["/products/evil-eye-bracelet.jpg"],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><WishlistProvider><CartProvider><Header/><main>{children}</main><Footer/></CartProvider></WishlistProvider></body></html>;
}
