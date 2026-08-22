import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { makeWhatsAppUrl } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.customer?.name || !body?.customer?.phone || !body?.customer?.address || !body?.items?.length) {
      return NextResponse.json({ error: "Please complete your customer details and cart." }, { status: 400 });
    }

    const orderNumber = `DORO-${Date.now().toString().slice(-8)}`;
    const shipping = Number(body.shipping || 0);
    const subtotal = Number(body.subtotal || 0);
    const total = Number(body.total || subtotal + shipping);
   const supabase = getSupabaseAdmin();

if (!supabase) {
  throw new Error(
    "Supabase admin client is not configured. Check SUPABASE_SERVICE_ROLE_KEY."
  );
}

const { data: order, error } = await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: body.customer.name,
        customer_phone: body.customer.phone,
        address: body.customer.address,
        city: body.customer.city,
        state: body.customer.state,
        pincode: body.customer.pincode,
        gift_message: body.giftMessage || null,
        subtotal, shipping, total, status: "pending"
      }).select("id").single();

      if (error) throw new Error(error.message);

      const items = body.items.map((x: any) => ({
        order_id: order.id, product_id: x.productId, product_name: x.name,
        quantity: Number(x.quantity), unit_price: Number(x.price || 0)
      }));
      const { error: itemError } = await supabase.from("order_items").insert(items);
      if (itemError) throw new Error(itemError.message);
    

    const itemLines = body.items.map((x: any) => `• ${x.name} × ${x.quantity} — ₹${Number(x.price || 0) * Number(x.quantity)}`).join("\\n");
    const giftSection = body.giftMessage ? `\\n\\n*Gift message*\\n${body.giftMessage}` : "";
    const message = `🎀 *New Doro Order*\\n\\n*Order:* ${orderNumber}\\n\\n*Items*\\n${itemLines}\\n\\n*Subtotal:* ₹${subtotal}\\n*Shipping:* ₹${shipping}\\n*Total:* *₹${total}*\\n\\n*Customer*\\n${body.customer.name}\\n📞 ${body.customer.phone}\\n📍 ${body.customer.address}, ${body.customer.city}, ${body.customer.state} - ${body.customer.pincode}${giftSection}\\n\\nPlease confirm my order.`;

    // Prefer WhatsApp number from settings if available
    let overrideNumber: string | undefined = undefined;
    if (supabase) {
      try {
        const { data: settings } = await supabase.from('settings').select('*').eq('key', 'whatsapp_number').limit(1).maybeSingle();
        if (settings && settings.value) overrideNumber = settings.value;
      } catch {}
    }

    return NextResponse.json({ orderNumber, whatsappUrl: makeWhatsAppUrl(message, overrideNumber) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create order." }, { status: 500 });
  }
}
