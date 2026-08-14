"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { UploadCloud } from "lucide-react";

type AdminProduct = {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  category?: string;
  image?: string | null;
  primary_image?: string | null;
  images?: string[] | null;
  stock?: number;
  is_active?: boolean;
};

type UploadItem = {
  id: string;
  name: string;
  preview: string;
  status: "pending" | "uploading" | "uploaded" | "error";
  url?: string;
  error?: string;
};

const categories = ["Gifts", "Jewellery", "Handmade Art", "Scrunchies"];

const emptyProduct = (): AdminProduct => ({
  id: "",
  name: "",
  description: "",
  price: null,
  category: "Gifts",
  image: null,
  primary_image: null,
  images: [],
  stock: 0,
  is_active: true,
});

export default function AdminProductEditor({
  products,
  session,
  refreshProducts,
}: {
  products: AdminProduct[];
  session: any;
  refreshProducts: () => void;
}) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [formValues, setFormValues] = useState<AdminProduct>(emptyProduct());
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedProductId) {
      setFormValues(emptyProduct());
      return;
    }
    const product = products.find((item) => item.id === selectedProductId);
    if (product) {
      setFormValues({
        ...emptyProduct(),
        ...product,
        images: product.images || (product.image ? [product.image] : []),
        primary_image: product.primary_image || product.image || null,
      });
    }
  }, [selectedProductId, products]);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const token = session?.access_token;

  function updateForm(field: keyof AdminProduct, value: any) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function addMessage(message: string) {
    setMessages([message]);
  }

  function clearMessages() {
    setMessages([]);
  }

  async function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (!token) {
      addMessage("You must be signed in to upload images.");
      return;
    }

    const nextItems: UploadItem[] = files.map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));
    setUploadItems((current) => [...current, ...nextItems]);
    clearMessages();

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    setUploadItems((current) => current.map((item) => ({ ...item, status: "uploading" })));

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data?.error || "Upload failed. Please try again.";
        setUploadItems((current) =>
          current.map((item) => ({ ...item, status: "error", error: message }))
        );
        addMessage(message);
        return;
      }

      const uploadedUrls = data.files?.map((file: any) => file.url) || [];
      setUploadItems((current) =>
        current.map((item, index) => ({
          ...item,
          status: uploadedUrls[index] ? "uploaded" : "error",
          url: uploadedUrls[index],
          error: uploadedUrls[index] ? undefined : item.error,
        }))
      );

      setFormValues((current) => {
        const nextImages = [
          ...(current.images || []),
          uploadedUrls.filter((url: string) => url && !(current.images || []).includes(url))
        ];
        return {
          ...current,
          images: nextImages,
          primary_image: current.primary_image || nextImages[0] || null,
        };
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Upload request failed.";
      setUploadItems((current) =>
        current.map((item) => ({ ...item, status: "error", error: errorMessage }))
      );
      addMessage(errorMessage);
    }
  }

  function removeImage(url: string) {
    setFormValues((current) => {
      const images = (current.images || []).filter((item) => item !== url);
      return {
        ...current,
        images,
        primary_image: current.primary_image === url ? images[0] || null : current.primary_image,
      };
    });
  }

  function setPrimaryImage(url: string) {
    setFormValues((current) => ({ ...current, primary_image: url }));
  }

  async function saveProduct() {
    if (!formValues.id.trim()) {
      addMessage("Product slug is required.");
      return;
    }
    if (!formValues.name.trim()) {
      addMessage("Product name is required.");
      return;
    }
    if (!token) {
      addMessage("You must be signed in to save products.");
      return;
    }

    setSaving(true);
    clearMessages();

    const payload: any = {
      ...formValues,
      price: formValues.price === null || Number.isNaN(formValues.price) ? null : Number(formValues.price),
      stock: Number(formValues.stock || 0),
      images: formValues.images || [],
      primary_image: formValues.primary_image || (formValues.images?.[0] ?? null),
      image: formValues.primary_image || formValues.image || (formValues.images?.[0] ?? null),
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: selectedProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        addMessage(data?.error || "Could not save product.");
        return;
      }
      setSelectedProductId(data.product?.id || formValues.id);
      refreshProducts();
      addMessage("Product saved successfully.");
    } catch (error: any) {
      addMessage(error?.message || "Save request failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct() {
    if (!selectedProduct) return;
    if (!confirm("Delete this product permanently?")) return;
    if (!token) {
      addMessage("You must be signed in to delete products.");
      return;
    }
    try {
      const response = await fetch(`/api/admin/products?id=${encodeURIComponent(selectedProduct.id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        addMessage(data?.error || "Could not delete product.");
        return;
      }
      setSelectedProductId("");
      setFormValues(emptyProduct());
      refreshProducts();
      addMessage("Product deleted.");
    } catch (error: any) {
      addMessage(error?.message || "Delete request failed.");
    }
  }

  function chooseExistingProduct(productId: string) {
    setSelectedProductId(productId);
    clearMessages();
    setUploadItems([]);
  }

  return (
    <div className="admin-product-panel">
      <div className="admin-product-toolbar" style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <button className="primary-button" type="button" onClick={() => { setSelectedProductId(""); setFormValues(emptyProduct()); setUploadItems([]); clearMessages(); }}>
          Add new product
        </button>
        <button className="secondary-button" type="button" onClick={refreshProducts}>
          Refresh product list
        </button>
      </div>

      <div className="admin-product-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
        <aside className="admin-product-list" style={{ padding: 20, border: "1px solid var(--line)", borderRadius: 16, background: "var(--surface)" }}>
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>Products</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => chooseExistingProduct(product.id)}
                className={selectedProductId === product.id ? "secondary-button" : "secondary-button"}
                style={{ justifyContent: "space-between", width: "100%" }}
              >
                <span>{product.name || product.id}</span>
                {selectedProductId === product.id ? <span>Selected</span> : null}
              </button>
            ))}
          </div>
        </aside>

        <main className="admin-product-form" style={{ padding: 24, border: "1px solid var(--line)", borderRadius: 16, background: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 18 }}>
            <div>
              <h2 style={{ margin: 0 }}>{selectedProduct ? "Edit product" : "New product"}</h2>
              <p className="admin-note" style={{ marginTop: 8 }}>
                Upload images, choose a featured photo, and save updates for storefront visibility.
              </p>
            </div>
            {selectedProduct && (
              <button className="secondary-button" type="button" onClick={deleteProduct}>
                Delete product
              </button>
            )}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <label style={{ display: "grid", gap: 8 }}>
              Product slug
              <input
                value={formValues.id}
                onChange={(event) => updateForm("id", event.target.value)}
                placeholder="example-silver-necklace"
              />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              Product name
              <input
                value={formValues.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Elegant silver necklace"
              />
            </label>
            <label style={{ display: "grid", gap: 8 }}>
              Description
              <textarea
                rows={4}
                value={formValues.description || ""}
                onChange={(event) => updateForm("description", event.target.value)}
                placeholder="Short product description"
              />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label style={{ display: "grid", gap: 8 }}>
                Price
                <input
                  type="number"
                  value={formValues.price ?? ""}
                  onChange={(event) => updateForm("price", event.target.value === "" ? null : Number(event.target.value))}
                  placeholder="0"
                />
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                Stock
                <input
                  type="number"
                  min={0}
                  value={formValues.stock ?? 0}
                  onChange={(event) => updateForm("stock", Number(event.target.value))}
                />
              </label>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label style={{ display: "grid", gap: 8 }}>
                Category
                <select value={formValues.category} onChange={(event) => updateForm("category", event.target.value)}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: 8 }}>
                Active
                <select value={formValues.is_active ? "active" : "inactive"} onChange={(event) => updateForm("is_active", event.target.value === "active") }>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div style={{ padding: 16, border: "1px dashed var(--line)", borderRadius: 14, background: "rgba(255,255,255,.7)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <UploadCloud size={18} />
                <div>
                  <strong>Upload product images</strong>
                  <p style={{ margin: 0, color: "var(--muted)" }}>
                    JPG, PNG, WEBP only. Up to 4MB each.
                  </p>
                </div>
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileSelect} />
              {uploadItems.length > 0 && (
                <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                  {uploadItems.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: "1px solid var(--line)", borderRadius: 12 }}>
                      <img src={item.preview} alt={item.name} width={64} height={64} style={{ objectFit: "cover", borderRadius: 12 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                          <strong>{item.name}</strong>
                          <span style={{ color: item.status === "error" ? "var(--red)" : "var(--olive)" }}>
                            {item.status === "uploading" ? "Uploading…" : item.status === "uploaded" ? "Uploaded" : item.status === "error" ? "Failed" : "Pending"}
                          </span>
                        </div>
                        {item.error ? <p style={{ margin: 4, color: "var(--red)", fontSize: "0.9rem" }}>{item.error}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 style={{ margin: "0 0 12px" }}>Image gallery</h3>
              <p className="muted">Choose the featured image and remove any photos you don’t want to show.</p>
              {(!formValues.images || formValues.images.length === 0) && (
                <div className="empty-state" style={{ padding: 24, marginTop: 12 }}>
                  No images added yet. Upload at least one image to show on the shop.
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginTop: 12 }}>
                {(formValues.images || []).map((imageUrl) => (
                  <div key={imageUrl} style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: formValues.primary_image === imageUrl ? "2px solid var(--olive)" : "1px solid var(--line)" }}>
                    <img src={imageUrl} alt="Product upload" style={{ width: "100%", height: 120, objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 8, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,.55) 100%)" }}>
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(imageUrl)}
                        className="secondary-button"
                        style={{ width: "100%", fontSize: "0.85rem", padding: "6px 10px", opacity: 0.95 }}
                      >
                        {formValues.primary_image === imageUrl ? "Featured" : "Set featured"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(imageUrl)}
                        className="secondary-button"
                        style={{ width: "100%", fontSize: "0.85rem", padding: "6px 10px", opacity: 0.95 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {messages.length > 0 && (
              <div className="admin-note" style={{ color: "var(--red)", padding: 12, borderRadius: 12 }}>
                {messages.map((message) => (
                  <p key={message} style={{ margin: 0 }}>{message}</p>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button className="primary-button" type="button" onClick={saveProduct} disabled={saving}>
                {saving ? "Saving…" : "Save product"}
              </button>
              <button className="secondary-button" type="button" onClick={() => { setSelectedProductId(""); setFormValues(emptyProduct()); setUploadItems([]); clearMessages(); }}>
                Reset form
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
