"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function InstagramGrid() {
  const [settings, setSettings] = useState<any>({});
  const images = ["/products/evil-eye-bracelet.jpg","/products/bow-bracelet.jpg","/products/11-11-necklace.jpg","/products/pink-tulip-necklace.jpg"];
  useEffect(() => { fetch('/api/settings').then(r=>r.json()).then(d=>setSettings(d.settings || {})).catch(()=>{}); }, []);
  const insta = settings.instagram_url || process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/';
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <h3 style={{margin:0}}>Follow Doro on Instagram</h3>
        <a href={insta} target="_blank" rel="noreferrer" className="primary-button">Follow</a>
      </div>
      <div className="instagram-grid">
        {images.map((src,i)=> <div key={i} className="insta-item"><Image src={src} alt={`Insta ${i}`} fill sizes="(max-width:600px) 50vw, 25vw"/></div>)}
      </div>
    </div>
  );
}
