"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/lib/supabaseClient";
import AdminProductEditor from "@/components/AdminProductEditor";

export default function AdminPage() {
const [session, setSession] = useState<any>(null);
const [authLoading, setAuthLoading] = useState(true);
const [view, setView] = useState("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
useEffect(() => {
  let mounted = true;

  const getSession = async () => {
    const { data, error } = await supabaseClient.auth.getSession();

    if (!mounted) return;

    if (error) {
      console.error("Failed to restore session:", error);
      setSession(null);
    } else {
      setSession(data.session);
    }

    setAuthLoading(false);
  };

  getSession();

  const {
    data: { subscription },
  } = supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (mounted) {
      setSession(session);
    }
  });

  return () => {
    mounted = false;
    subscription.unsubscribe();
  };
}, []);

  async function signIn(email: string, password: string) {
  setLoading(true);

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

  setLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  // Immediately store the authenticated session
  setSession(data.session);
}
  async function signOut() { await supabaseClient.auth.signOut(); setSession(null); }

  async function fetchProducts() {
    setLoading(true);
    const token = session?.access_token;
    const res = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data?.products) setProducts(data.products);
    else alert(data.error || 'Could not load products');
    setLoading(false);
  }

  async function fetchOrders() {
    setLoading(true);
    const token = session?.access_token;
    const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data?.orders) setOrders(data.orders);
    else alert(data.error || 'Could not load orders');
    setLoading(false);
  }

  useEffect(() => { if (session) { fetchProducts(); fetchOrders(); } }, [session]);

   if (authLoading) {
    return (
      <div className="section admin-page" style={{ padding: 40 }}>
        Loading admin session...
      </div>
    );
  }

 if (!session) return <div className="section admin-page" style={{padding:40}}>
    <h1>Admin sign in</h1>
    <p className="admin-note">Sign in with your Supabase email/password to access the back office.</p>
    <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget as HTMLFormElement); signIn(String(fd.get('email')), String(fd.get('password'))); }}>
      <label style={{display:'block',marginBottom:8}}>Email<input name="email" type="email"/></label>
      <label style={{display:'block',marginBottom:8}}>Password<input name="password" type="password"/></label>
      <button className="primary-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
    </form>
  </div>;

  return <section className="section admin-page">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
      <h1>Doro Back Office</h1>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <button className="secondary-button" onClick={() => setView('dashboard')}>Dashboard</button>
        <button className="secondary-button" onClick={() => setView('products')}>Products</button>
        <button className="secondary-button" onClick={() => setView('orders')}>Orders</button>
        <button className="secondary-button" onClick={() => setView('settings')}>Settings</button>
        <button className="secondary-button" onClick={signOut}>Sign out</button>
      </div>
    </div>

    {view === 'dashboard' && <div>
      <div className="admin-note">Quick overview</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        <div className="table-wrap"><h3>Products</h3><p>{products.length}</p></div>
        <div className="table-wrap"><h3>Orders</h3><p>{orders.length}</p></div>
        <div className="table-wrap"><h3>Settings</h3><p>Manage store settings</p></div>
      </div>
    </div>}

    {view === 'products' && <div>
      <AdminProductEditor products={products} session={session} refreshProducts={fetchProducts} />
    </div>}

    {view === 'orders' && <div>
      <h2>Orders</h2>
      <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map(o => <tr key={o.order_number}><td>{o.order_number}</td><td>{o.customer_name}<br/><small>{o.customer_phone}</small></td><td>₹{o.total}</td><td>{o.status}</td><td>{new Date(o.created_at).toLocaleString()}</td></tr>)}</tbody></table></div>
    </div>}

    {view === 'settings' && <div>
      <h2>Settings</h2>
      <p className="muted">Edit site settings (WhatsApp number, Instagram URL) in Supabase 'settings' table.</p>
      <p>Use Supabase SQL editor or create settings entries: <b>whatsapp_number</b> and <b>instagram_url</b>.</p>
    </div>}

  </section>;
}
