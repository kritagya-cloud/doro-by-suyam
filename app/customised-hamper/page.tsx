"use client";

import { useEffect, useMemo, useState } from "react";
import { Gift, Minus, Plus, Check, ShoppingBag } from "lucide-react";
import { categories, type Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";



export default function CustomisedHamperPage() {
  const { add } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.price == null) return false;
      if (category !== "All" && product.category !== category) return false;
      return true;
    });
  }, [products, category]);

  const selectedProducts = products.filter(
    (product) => (selected[product.id] || 0) > 0
  );

  const totalItems = selectedProducts.reduce(
    (total, product) => total + selected[product.id],
    0
  );

  const totalPrice = selectedProducts.reduce(
    (total, product) =>
      total + (product.price || 0) * selected[product.id],
    0
  );

  function changeQuantity(product: Product, change: number) {
    setSelected((current) => {
      const currentQty = current[product.id] || 0;
      const newQty = Math.max(0, currentQty + change);

      const updated = { ...current };

      if (newQty === 0) {
        delete updated[product.id];
      } else {
        updated[product.id] = newQty;
      }

      return updated;
    });

    setAdded(false);
  }

  function addHamperToCart() {
    selectedProducts.forEach((product) => {
      const quantity = selected[product.id];

      for (let i = 0; i < quantity; i++) {
        add(product);
      }
    });

    setAdded(true);
  }

  return (
    <main>
      {/* Header */}
      <section className="section customised-hero">
        <div className="customised-hero-copy">
          <p className="eyebrow">CUSTOMISE YOUR GIFT</p>

          <h1>Create Your Customised Hamper</h1>

          <p>
            Choose the pieces that mean something to you and create a gift
            that feels completely personal.
          </p>
        </div>
      </section>

      {/* Builder */}
      <section className="section customised-builder">
        <div className="customised-layout">

          {/* Products */}
          <div>
            <div className="section-heading customised-heading">
              <div>
                <p className="eyebrow">CHOOSE YOUR FAVOURITES</p>
                <h2>Build your hamper</h2>
              </div>

              <div className="customised-count">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </div>
            </div>

            {/* Categories */}
            <div className="category-pills customised-pills">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Product grid */}
            <div className="product-grid customised-product-grid">
              {filteredProducts.map((product) => {
                const quantity = selected[product.id] || 0;

                return (
                  <div
                    key={product.id}
                    className={`product-card customised-product-card ${
                      quantity > 0 ? "selected" : ""
                    }`}
                  >
                    <div className="product-image">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      {quantity > 0 && (
                        <div className="customised-selected">
                          <Check size={16} />
                          Selected
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <div>
                        <p className="eyebrow">{product.category}</p>

                        <h3>{product.name}</h3>

                        <p className="price">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>

                    <div className="customised-product-action">
                      {quantity === 0 ? (
                        <button
                          className="secondary-button"
                          onClick={() => changeQuantity(product, 1)}
                        >
                          <Plus size={15} />
                          Add to hamper
                        </button>
                      ) : (
                        <div className="customised-quantity">
                          <button
                            onClick={() => changeQuantity(product, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>

                          <span>{quantity}</span>

                          <button
                            onClick={() => changeQuantity(product, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="empty-state">
                No products available in this category yet.
              </div>
            )}
          </div>

          {/* Hamper Summary */}
          <aside className="customised-summary">
            <div className="summary">
              <div className="customised-summary-title">
                <div className="customised-gift-icon">
                  <Gift size={21} />
                </div>

                <div>
                  <p className="eyebrow">YOUR CREATION</p>
                  <h2>Your Hamper</h2>
                </div>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="customised-empty">
                  <ShoppingBag size={35} />

                  <h3>Your hamper is empty</h3>

                  <p>
                    Select products from the collection and they'll appear
                    here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="customised-items">
                    {selectedProducts.map((product) => (
                      <div
                        className="customised-summary-item"
                        key={product.id}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                        />

                        <div>
                          <h4>{product.name}</h4>

                          <p>
                            ₹{product.price} × {selected[product.id]}
                          </p>
                        </div>

                        <strong>
                          ₹{(product.price || 0) * selected[product.id]}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="customised-total-row">
                    <span>Total</span>
                    <strong>₹{totalPrice}</strong>
                  </div>

                  <button
                    className="primary-button full"
                    onClick={addHamperToCart}
                  >
                    {added ? (
                      <>
                        <Check size={17} />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        Add Hamper to Cart
                      </>
                    )}
                  </button>

                  {added && (
                    <p className="customised-success">
                      Your customised hamper has been added to your cart.
                    </p>
                  )}
                </>
              )}
            </div>
          </aside>

        </div>
      </section>
    </main>
  );
}