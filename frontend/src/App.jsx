// App.jsx
// Root component — fetches data from Express API using axios
// Manages all CRUD operations and passes data down via props

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";

const API = "/api/products";

function App() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [editProduct, setEdit]    = useState(null);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("");
  const [sortBy, setSortBy]       = useState("newest");
  const [toast, setToast]         = useState(null);

  // Fetch all products from backend on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Unable to connect to the API server. Please verify that the Express backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  // Create
  async function handleCreate(formData) {
    try {
      const res = await axios.post(API, formData);
      setProducts(prev => [res.data, ...prev]);
      showToast("Product successfully created!", "success");
      setShowForm(false);
    } catch (err) {
      showToast(err.response?.data?.error || "Creation failed", "error");
    }
  }

  // Update
  async function handleUpdate(formData) {
    try {
      const res = await axios.put(`${API}/${editProduct._id}`, formData);
      setProducts(prev => prev.map(p => p._id === editProduct._id ? res.data : p));
      showToast("Product details updated!", "success");
      setEdit(null);
    } catch (err) {
      showToast(err.response?.data?.error || "Update failed", "error");
    }
  }

  // Delete
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      showToast("Product deleted successfully", "info");
    } catch (err) {
      showToast(err.response?.data?.error || "Deletion failed", "error");
    }
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Filter & Sort
  const categories = [...new Set(products.map(p => p.category))].sort();
  
  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const avgPrice = products.length
    ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length)
    : 0;

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background radial glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "1400px",
        height: "500px",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Header */}
      <header style={{
        background: "var(--surface)",
        backdropFilter: "var(--glass-blur)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "70px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: "36px", 
              height: "36px", 
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
              borderRadius: "10px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
            }}>
              <span style={{ fontSize: "18px" }}>📦</span>
            </div>
            <div>
              <span style={{ fontWeight: "700", fontSize: "17px", letterSpacing: "-0.02em", color: "var(--text)" }}>Apex Inventory</span>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                <span style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%", display: "inline-block" }}></span>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "500" }}>Atlas Connected</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setEdit(null); setShowForm(true); }}
            style={{ 
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
              color: "#fff", 
              padding: "10px 20px", 
              borderRadius: "10px", 
              fontSize: "14px", 
              fontWeight: "600",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Product
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", position: "relative", zIndex: 1 }}>

        {/* Dashboard Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { 
              label: "Total Inventory items", 
              value: products.length, 
              icon: "📦",
              gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.02) 100%)",
              border: "rgba(99, 102, 241, 0.2)"
            },
            { 
              label: "Average Product Price", 
              value: `₹${avgPrice.toLocaleString("en-IN")}`, 
              icon: "📈",
              gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)",
              border: "rgba(16, 185, 129, 0.2)"
            },
            { 
              label: "Active Categories", 
              value: categories.length, 
              icon: "🗂️",
              gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)",
              border: "rgba(245, 158, 11, 0.2)"
            },
          ].map((s, i) => (
            <div key={i} style={{ 
              background: "var(--surface)", 
              backdropFilter: "var(--glass-blur)",
              border: `1px solid ${s.border}`, 
              borderRadius: "var(--radius)", 
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "var(--shadow)"
            }}>
              <div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500", marginBottom: "6px" }}>{s.label}</p>
                <p style={{ fontSize: "28px", fontWeight: "800", color: "var(--text)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.04em" }}>{s.value}</p>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: s.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px"
              }}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar & Filters */}
        <div style={{ 
          background: "var(--surface)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--radius)",
          padding: "20px",
          marginBottom: "24px",
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
          alignItems: "center",
          boxShadow: "var(--shadow)"
        }}>
          {/* Search bar */}
          <div style={{ flex: "2", minWidth: "260px", position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2.5" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search products by title or details…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: "42px" }}
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                style={{ 
                  position: "absolute", 
                  right: "12px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  background: "none", 
                  padding: "4px", 
                  color: "var(--text-dim)" 
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div style={{ flex: "1", minWidth: "160px" }}>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div style={{ flex: "1", minWidth: "160px" }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical: A-Z</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchProducts}
            style={{ 
              background: "rgba(255, 255, 255, 0.05)", 
              border: "1px solid var(--border)",
              color: "var(--text)", 
              padding: "11px 16px", 
              borderRadius: "var(--radius-sm)" 
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Reload
          </button>
        </div>

        {/* Loading Skeleton Indicator */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                height: "240px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <div style={{ width: "70px", height: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                <div style={{ width: "70%", height: "24px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                <div style={{ width: "100%", height: "40px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between" }}>
                  <div style={{ width: "80px", height: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                  <div style={{ width: "60px", height: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Screen */}
        {error && (
          <div style={{ 
            background: "rgba(244, 63, 94, 0.08)", 
            border: "1px solid var(--danger-glow)", 
            borderRadius: "var(--radius)", 
            padding: "32px", 
            color: "#fca5a5", 
            textAlign: "center",
            boxShadow: "var(--shadow)",
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
            <strong style={{ display: "block", fontSize: "16px", marginBottom: "8px", color: "var(--text)" }}>Database Communication Error</strong>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 20px" }}>{error}</p>
            <button
              onClick={fetchProducts}
              style={{ 
                background: "var(--danger)", 
                color: "#fff", 
                padding: "10px 24px", 
                borderRadius: "var(--radius-sm)",
                boxShadow: "0 4px 12px var(--danger-glow)"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--danger-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--danger)"}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {sortedAndFiltered.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "80px 20px", 
                color: "var(--text-muted)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)",
                animation: "scaleIn 0.25s ease both"
              }}>
                <p style={{ fontSize: "48px", marginBottom: "16px" }}>📭</p>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", marginBottom: "6px" }}>No inventory products found</h3>
                <p style={{ fontSize: "14px" }}>
                  {search || category ? "Try clearing or relaxing your search query filter fields." : "Your catalog is empty. Click 'Add Product' to get started."}
                </p>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}>
                {sortedAndFiltered.map((product, i) => (
                  <div key={product._id} style={{ animation: "fadeUp 0.4s ease both", animationDelay: `${i * 0.05}s` }}>
                    <ProductCard
                      product={product}
                      onEdit={(p) => { setEdit(p); setShowForm(true); }}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Center Modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          onSubmit={editProduct ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEdit(null); }}
        />
      )}

      {/* Floating Notifications */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "32px",
          right: "32px",
          background: toast.type === "error" ? "var(--danger)" : toast.type === "info" ? "#3b82f6" : "var(--success)",
          color: "#fff",
          padding: "14px 22px",
          borderRadius: "var(--radius-sm)",
          fontSize: "13px",
          fontWeight: "600",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          zIndex: 2000,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span>
            {toast.type === "error" ? "❌" : toast.type === "info" ? "ℹ️" : "✓"}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default App;
