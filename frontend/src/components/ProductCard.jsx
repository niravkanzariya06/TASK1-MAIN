// ProductCard.jsx
// Receives product data via props and displays it in a premium card structure

import { useState } from "react";

// Category configuration containing banner gradients, badge colors, and representative SVGs
const categoryThemes = {
  Electronics: {
    gradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)",
    badgeBg: "rgba(99, 102, 241, 0.15)",
    badgeText: "#818cf8",
    glowColor: "rgba(99, 102, 241, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    )
  },
  Accessories: {
    gradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.05) 100%)",
    badgeBg: "rgba(236, 72, 153, 0.15)",
    badgeText: "#f472b6",
    glowColor: "rgba(236, 72, 153, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <polyline points="12 9 12 12 13.5 13.5" />
        <path d="M16.51 16.51L21 21M3 3l4.49 4.49" />
      </svg>
    )
  },
  Footwear: {
    gradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#34d399",
    glowColor: "rgba(16, 185, 129, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17h18l-4-9h-5L8 14H3v3z" />
        <path d="M8 14l-1-5H3v3h1l3 2z" />
      </svg>
    )
  },
  Home: {
    gradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "#fbbf24",
    glowColor: "rgba(245, 158, 11, 0.3)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  General: {
    gradient: "linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(148, 163, 184, 0.05) 100%)",
    badgeBg: "rgba(148, 163, 184, 0.15)",
    badgeText: "#cbd5e1",
    glowColor: "rgba(148, 163, 184, 0.25)",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    )
  }
};

function ProductCard({ product, onEdit, onDelete }) {
  const { _id, name, price, description, category } = product;
  const [hovered, setHovered] = useState(false);

  const theme = categoryThemes[category] || categoryThemes.General;

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: hovered ? `1px solid ${theme.badgeText}` : "1px solid var(--border)",
        borderRadius: "var(--radius)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: hovered ? `0 10px 30px -5px ${theme.glowColor}` : "var(--shadow)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Category Banner Graphic */}
      <div style={{
        background: theme.gradient,
        height: "110px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderBottom: "1px solid var(--border)",
        transition: "all 0.3s ease"
      }}>
        {theme.icon}
        <span style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          background: theme.badgeBg,
          color: theme.badgeText,
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          padding: "3px 9px",
          borderRadius: "6px",
          border: `1px solid rgba(255,255,255,0.05)`
        }}>
          {category}
        </span>
      </div>

      {/* Content Details */}
      <div style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flexGrow: 1
      }}>
        {/* Title */}
        <h3 style={{ 
          fontSize: "16px", 
          fontWeight: "600", 
          color: "var(--text)", 
          lineHeight: 1.3,
          letterSpacing: "-0.01em" 
        }}>
          {name}
        </h3>

        {/* Description (max 3 lines clamp) */}
        <p style={{ 
          fontSize: "13px", 
          color: "var(--text-muted)", 
          lineHeight: 1.5,
          margin: "2px 0 6px 0",
          flexGrow: 1,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {description || "No description provided."}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

        {/* Price & Actions Row */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: "4px" 
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", fontFamily: "'JetBrains Mono', monospace" }}>₹</span>
            <span style={{ 
              fontSize: "20px", 
              fontWeight: "700", 
              color: "var(--text)", 
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "-0.02em" 
            }}>
              {price.toLocaleString("en-IN")}
            </span>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => onEdit(product)}
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "12px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(_id)}
              style={{
                background: "rgba(244, 63, 94, 0.08)",
                border: "1px solid rgba(244, 63, 94, 0.2)",
                color: "#fca5a5",
                fontSize: "12px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--danger)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "var(--danger)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(244, 63, 94, 0.08)";
                e.currentTarget.style.color = "#fca5a5";
                e.currentTarget.style.borderColor = "rgba(244, 63, 94, 0.2)";
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
