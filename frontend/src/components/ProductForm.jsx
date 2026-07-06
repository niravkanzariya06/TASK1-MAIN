// ProductForm.jsx
// Modal form for adding or editing a product
// Uses controlled inputs and passes data up via onSubmit prop

import { useState, useEffect } from "react";

const CATEGORIES = ["Electronics", "Accessories", "Footwear", "Home", "General"];

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(4, 6, 12, 0.75)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  backdropFilter: "blur(6px)",
  animation: "fadeIn 0.2s ease-out both",
};

const modalStyle = {
  background: "linear-gradient(135deg, rgba(22, 26, 46, 0.95) 0%, rgba(13, 16, 30, 0.98) 100%)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "var(--radius)",
  padding: "30px",
  width: "100%",
  maxWidth: "440px",
  margin: "0 16px",
  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
  animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--text-muted)",
  marginBottom: "6px",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

function ProductForm({ product, onSubmit, onClose }) {
  const isEditing = Boolean(product?._id);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "Electronics",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        category: product.category || "Electronics",
      });
    }
  }, [product]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      e.price = "Enter a valid positive price";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await onSubmit({ ...form, price: Number(form.price) });
    setLoading(false);
  }

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  }

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.02em" }}>
              {isEditing ? "Edit Product Details" : "Create New Product"}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "2px" }}>
              {isEditing ? "Modify the product details below" : "Add a new item to your catalog"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ 
              background: "rgba(255, 255, 255, 0.04)", 
              border: "1px solid var(--border)",
              color: "var(--text-muted)", 
              width: "32px",
              height: "32px",
              padding: 0,
              borderRadius: "50%" 
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Name */}
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              style={{
                borderColor: errors.name ? "rgba(244, 63, 94, 0.4)" : "var(--border)"
              }}
            />
            {errors.name && (
              <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>⚠️</span> {errors.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label style={labelStyle}>Price (INR ₹) *</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={e => handleChange("price", e.target.value)}
              placeholder="e.g. 2999"
              style={{
                borderColor: errors.price ? "rgba(244, 63, 94, 0.4)" : "var(--border)",
                fontFamily: form.price ? "'JetBrains Mono', monospace" : "inherit"
              }}
            />
            {errors.price && (
              <p style={{ color: "var(--danger)", fontSize: "12px", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>⚠️</span> {errors.price}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={e => handleChange("description", e.target.value)}
              placeholder="Provide key features or technical specifications…"
              rows="3"
              style={{
                width: "100%",
                padding: "11px 16px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                background: "rgba(13, 16, 30, 0.7)",
                color: "var(--text)",
                outline: "none",
                transition: "all 0.2s ease",
                resize: "none"
              }}
              onFocus={e => {
                e.target.style.borderColor = "var(--accent)";
                e.target.style.boxShadow = "0 0 0 3px var(--accent-glow)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "var(--border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={e => handleChange("category", e.target.value)}
              style={{
                cursor: "pointer"
              }}
            >
              {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#111422" }}>{c}</option>)}
            </select>
          </div>

        </div>

        {/* Modal Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "28px" }}>
          <button
            onClick={onClose}
            style={{ 
              background: "rgba(255, 255, 255, 0.04)", 
              border: "1px solid var(--border)",
              color: "var(--text)", 
              padding: "11px 22px" 
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ 
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
              color: "#fff", 
              padding: "11px 24px", 
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.2)"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ animation: "pulseGlow 1s infinite" }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Saving…
              </>
            ) : isEditing ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
