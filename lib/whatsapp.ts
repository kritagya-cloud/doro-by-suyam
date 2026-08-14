export function makeWhatsAppUrl(message: string, overrideNumber?: string) {
  // Use overrideNumber if provided, otherwise prefer NEXT_PUBLIC_WHATSAPP_NUMBER, then WHATSAPP_NUMBER
  const raw = (overrideNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER || "").toString();
  const number = raw.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return number ? `https://wa.me/${number}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
