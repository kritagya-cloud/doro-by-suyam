# Doro by Suyam

A production-ready starter for Doro: gifting + jewellery store with cart, checkout, Supabase order storage and WhatsApp ordering.

## 1. Run it in VS Code

Install Node.js (LTS), then open this folder in VS Code.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Connect the free Supabase backend

Create a free Supabase project.

Open **SQL Editor** and run:

`supabase/schema.sql`

Then copy `.env.example` to `.env.local` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
WHATSAPP_NUMBER=91XXXXXXXXXX
```

The service-role key is server-only. Never put it in client-side code or commit `.env.local`.

Restart the dev server after changing environment variables.

## 3. WhatsApp ordering

Set `WHATSAPP_NUMBER` to the Doro business WhatsApp number with country code, digits only.

Example:

```env
WHATSAPP_NUMBER=919876543210
```

A checkout first creates the order in Supabase, then opens a pre-filled WhatsApp message.

## 4. Current catalogue

The project includes the supplied Doro logo and the product images you uploaded.

Prices supplied by you are pre-filled:
- Evil-eye Bracelet — ₹479
- Minimal Bow Necklace & Studs — ₹399
- Minimal 11:11 Necklace — ₹329
- Elegant Pink Tulip Chain — ₹349
- Elegant Red Tulip Chain — ₹349
- Dainty White Heart Chain — ₹299

Other supplied products are present but marked "Price coming soon" until you decide their prices.

## 5. Before public launch

The `/admin` page is a development view. **Do not publish it as-is.**

Next production steps:
1. Add Supabase Auth for admin.
2. Move product catalogue fully into Supabase.
3. Add secure product CRUD.
4. Add stock management and order status updates.
5. Add a proper privacy policy / terms / shipping & returns pages.
6. Connect a production domain.
7. Deploy using a host whose plan permits commercial use.
8. Put all infrastructure under the client's accounts for clean ownership transfer.

## Project structure

- `app/` — Next.js pages and API routes
- `components/` — reusable UI
- `lib/products.ts` — initial catalogue
- `lib/supabase.ts` — server database client
- `app/api/orders/` — order creation backend
- `supabase/schema.sql` — database schema
- `public/logo.png` — Doro logo
- `public/products/` — supplied product imagery
