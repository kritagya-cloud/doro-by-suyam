import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return <footer className="footer">
    <div>
      <Image src="/logo.png" alt="Doro by Suyam" width={100} height={100}/>
      <p>Little things, beautifully gifted.</p>
      <div style={{marginTop:8,display:'flex',gap:10,alignItems:'center'}}>
        <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="secondary-button">Instagram</a>
        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''}`} target="_blank" rel="noreferrer" className="secondary-button">Order on WhatsApp</a>
      </div>
    </div>
    <div className="footer-links">
      <Link href="/shop">Shop</Link>
      <Link href="/cart">Cart</Link>
      <Link href="/admin">Admin</Link>
    </div>
    <p className="copyright">© {new Date().getFullYear()} Doro by Suyam. All rights reserved.</p>
  </footer>;
}
