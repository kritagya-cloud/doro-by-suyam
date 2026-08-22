export function makeWhatsAppUrl(
  message: string,
  overrideNumber?: string
) {
  // WhatsApp number
  const raw = (
    overrideNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.WHATSAPP_NUMBER ||
    ""
  ).toString();

  const number = raw.replace(/\D/g, "");

  // Convert literal "\n" characters into real line breaks.
  // This fixes messages generated as "\\n\\n".
  const cleanMessage = message
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  const encoded = encodeURIComponent(cleanMessage);

  return number
    ? `https://wa.me/${number}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}