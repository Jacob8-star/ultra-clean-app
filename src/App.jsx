import React, { useState, useEffect, useMemo } from "react";
import {
  Home, Search, ShoppingCart, ClipboardList, User, Plus, Minus,
  Heart, Star, ChevronLeft, ChevronRight, Check, MapPin, CreditCard,
  Sparkles, Filter, X, Package, Truck, TrendingUp, Users, BarChart3,
  Edit3, Trash2, AlertTriangle, Tag, LayoutGrid, Droplet
} from "lucide-react";
import { supabase } from "./supabaseClient";

// Only this email can access the Admin Dashboard.
const ADMIN_EMAIL = "jacobjuwon08@gmail.com";

/* ---------------------------------------------------------
   ULTRA CLEAN — Home Care e-commerce app prototype
   Brand: deep green / white / gold-yellow
   Signature element: the "clean streak" — a diagonal gloss
   swipe used on the hero + a droplet badge system for
   categories, echoing a wiped-clean surface.
--------------------------------------------------------- */

const BRAND = {
  green: "#0F6B3A",
  greenDark: "#0A4E2A",
  greenSoft: "#EAF5EE",
  yellow: "#F6B90A",
  yellowSoft: "#FFF6DC",
  ink: "#12261B",
  sub: "#5B7267",
  line: "#DCEAE1",
  white: "#FFFFFF",
  danger: "#C0392B",
};

const CATS = [
  { id: "air", name: "Air Care", icon: Sparkles },
  { id: "kitchen", name: "Kitchen Care", icon: Droplet },
  { id: "bathroom", name: "Bathroom Care", icon: LayoutGrid },
  { id: "surface", name: "Surface Care", icon: Package },
];

const FRAGRANCES = ["Lemon", "Lavender", "Fresh Breeze", "Tropical", "Ocean"];
const SIZES = [
  { id: "sm", label: "Small", mult: 1 },
  { id: "md", label: "Medium", mult: 1.8 },
  { id: "lg", label: "Large", mult: 3.2 },
];

const seedProducts = [
  { id: "p1", cat: "air", name: "Gel Air Freshener", tag: "Best Seller", price: 1200, stock: 84, rating: 4.8, reviews: 132, hasFragrance: true,
    desc: "Long-lasting freshness for your home. A slow-release gel that keeps rooms smelling clean for weeks, not hours.",
    benefits: ["Lasts up to 30 days", "Non-spill gel formula", "Safe around children & pets"],
    instructions: "Remove lid fully and place in a well-ventilated area, away from direct sunlight." },
  { id: "p2", cat: "air", name: "Car Freshener", tag: "New", price: 900, stock: 60, rating: 4.6, reviews: 54, hasFragrance: true,
    desc: "Clip-on freshness for your dashboard or vent that survives Lagos traffic and Lagos heat.",
    benefits: ["Vent & mirror clip included", "Adjustable scent intensity", "Compact, spill-proof"],
    instructions: "Clip to the air vent or rearview mirror. Adjust the vent dial to control scent strength." },
  { id: "p3", cat: "air", name: "Odor Eliminator", tag: "", price: 1500, stock: 6, rating: 4.7, reviews: 41, hasFragrance: true,
    desc: "A fast-acting spray that neutralizes tough odors instead of masking them — kitchens, bins, shoe racks.",
    benefits: ["Neutralizes, doesn't just mask", "Fabric-safe", "Fast-drying spray"],
    instructions: "Shake well. Spray from 20cm away onto the source of the odor or into the air." },
  { id: "p4", cat: "kitchen", name: "Dishwashing Liquid", tag: "Best Seller", price: 800, stock: 120, rating: 4.9, reviews: 210, hasFragrance: true,
    desc: "Cuts through oil and grease fast, even in cold water — built for pepper soup pots and jollof pans.",
    benefits: ["Grease-cutting formula", "Gentle on hands", "Rinses clean, no residue"],
    instructions: "Apply a small amount to a damp sponge. Rinse dishes thoroughly with clean water." },
  { id: "p5", cat: "kitchen", name: "Kitchen Cleaner", tag: "", price: 1100, stock: 45, rating: 4.5, reviews: 38, hasFragrance: true,
    desc: "An all-surface spray for counters, stoves and tiles that lifts baked-on stains without scrubbing for ages.",
    benefits: ["Cuts grease on contact", "Safe on tiles, steel & laminate", "Leaves no streaks"],
    instructions: "Spray on surface, leave for 30 seconds, then wipe with a clean cloth." },
  { id: "p6", cat: "bathroom", name: "Toilet Cleaner", tag: "Best Seller", price: 1000, stock: 70, rating: 4.7, reviews: 96, hasFragrance: true,
    desc: "Thick-cling formula that clings to the bowl to fight limescale and stains where they start.",
    benefits: ["Thick-cling gel", "Kills 99.9% of germs", "Removes limescale"],
    instructions: "Squeeze under the rim, leave for 10 minutes, then brush and flush." },
  { id: "p7", cat: "bathroom", name: "Bathroom Cleaner", tag: "", price: 1300, stock: 3, rating: 4.4, reviews: 22, hasFragrance: true,
    desc: "A foaming spray for tiles, tubs and sinks that tackles soap scum and mildew.",
    benefits: ["Foaming action reaches tile grout", "Anti-mildew", "Fresh scent after use"],
    instructions: "Spray liberally, let sit 2 minutes, scrub lightly and rinse with water." },
  { id: "p8", cat: "surface", name: "Floor Cleaner", tag: "Best Seller", price: 1400, stock: 55, rating: 4.8, reviews: 150, hasFragrance: true,
    desc: "A concentrated mop solution for tiles, terrazzo and vinyl that dries fast with a light shine.",
    benefits: ["Highly concentrated", "Fast-drying, low residue", "Safe for tiles & terrazzo"],
    instructions: "Dilute 1 cap in 4 litres of water. Mop as usual and allow to air dry." },
  { id: "p9", cat: "surface", name: "Multipurpose Cleaner", tag: "New", price: 1000, stock: 40, rating: 4.6, reviews: 29, hasFragrance: true,
    desc: "One bottle for counters, doors, switches and furniture — for households that want to keep it simple.",
    benefits: ["Works on most hard surfaces", "Cuts through dust & grime", "Quick-dry, no streaks"],
    instructions: "Spray directly onto surface and wipe with a dry or damp cloth." },
  { id: "p10", cat: "surface", name: "Glass Cleaner", tag: "", price: 950, stock: 0, rating: 4.5, reviews: 18, hasFragrance: false,
    desc: "A streak-free formula for windows, mirrors and glass tables that dries clear, every time.",
    benefits: ["Streak-free finish", "Fast evaporating", "Ammonia-light formula"],
    instructions: "Spray from 20cm and wipe with a lint-free cloth or newspaper in one direction." },
];

const money = (n) => "\u20a6" + Math.round(n).toLocaleString("en-NG");

const STATUSES = ["Order Received", "Confirmed", "Processing", "Ready for Delivery", "Out for Delivery", "Delivered"];

/* ---------- shared bits ---------- */

function Logo({ size = 26, dark }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        width: size, height: size, borderRadius: 8, background: BRAND.yellow,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: "0 2px 0 rgba(0,0,0,0.08)"
      }}>
        <Droplet size={size * 0.62} color={BRAND.greenDark} fill={BRAND.greenDark} strokeWidth={0} />
      </div>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontWeight: 900, fontSize: size * 0.62, letterSpacing: 0.5, color: dark ? BRAND.ink : BRAND.white }}>
          ULTRA <span style={{ color: BRAND.yellow }}>CLEAN</span>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "green" }) {
  const map = {
    green: { bg: BRAND.greenSoft, fg: BRAND.green },
    yellow: { bg: BRAND.yellowSoft, fg: "#8A6400" },
    danger: { bg: "#FCEAE8", fg: BRAND.danger },
  };
  const c = map[tone];
  return (
    <span style={{
      background: c.bg, color: c.fg, fontSize: 11, fontWeight: 800, padding: "3px 8px",
      borderRadius: 999, letterSpacing: 0.3, textTransform: "uppercase"
    }}>{children}</span>
  );
}

function Stars({ rating, size = 12 }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? BRAND.yellow : "none"} color={BRAND.yellow} strokeWidth={1.5} />
      ))}
    </div>
  );
}

function PrimaryButton({ children, onClick, style, disabled, variant = "solid" }) {
  const base = {
    border: "none", borderRadius: 12, padding: "13px 18px", fontWeight: 800, fontSize: 14.5,
    cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, letterSpacing: 0.2, transition: "transform 0.1s",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    solid: { background: BRAND.green, color: BRAND.white },
    yellow: { background: BRAND.yellow, color: BRAND.greenDark },
    outline: { background: "transparent", color: BRAND.green, border: `1.5px solid ${BRAND.green}` },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function ProductCard({ p, onOpen, isFav, onToggleFav }) {
  const outOfStock = p.stock === 0;
  return (
    <div onClick={() => onOpen(p)} style={{
      background: BRAND.white, borderRadius: 16, border: `1px solid ${BRAND.line}`, overflow: "hidden",
      cursor: "pointer", display: "flex", flexDirection: "column", position: "relative"
    }}>
      <div style={{
        height: 108, background: `linear-gradient(135deg, ${BRAND.greenSoft}, #DCF0E3)`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
      }}>
        <div style={{
          width: 46, height: 62, borderRadius: "6px 6px 14px 14px", background: BRAND.white,
          border: `2px solid ${BRAND.green}`, position: "relative", display: "flex", alignItems: "flex-end",
          justifyContent: "center", overflow: "hidden"
        }}>
          <div style={{ width: "100%", height: "55%", background: BRAND.green }} />
          <div style={{ position: "absolute", top: -6, width: 16, height: 8, background: BRAND.yellow, borderRadius: 2 }} />
        </div>
        {p.tag ? <div style={{ position: "absolute", top: 8, left: 8 }}><Badge tone={p.tag === "New" ? "yellow" : "green"}>{p.tag}</Badge></div> : null}
        <button onClick={(e) => { e.stopPropagation(); onToggleFav(p.id); }} style={{
          position: "absolute", top: 6, right: 6, background: "rgba(255,255,255,0.9)", border: "none",
          borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
        }}>
          <Heart size={14} color={isFav ? BRAND.danger : BRAND.sub} fill={isFav ? BRAND.danger : "none"} />
        </button>
        {outOfStock && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Badge tone="danger">Out of stock</Badge>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: BRAND.sub, textTransform: "uppercase", letterSpacing: 0.4 }}>ULTRA CLEAN</div>
        <div style={{ fontWeight: 800, fontSize: 13.5, color: BRAND.ink, marginTop: 1, lineHeight: 1.25 }}>{p.name}</div>
        <div style={{ marginTop: 5 }}><Stars rating={p.rating} /></div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 6 }}>
          <div style={{ fontWeight: 900, color: BRAND.green, fontSize: 15 }}>{money(p.price)}</div>
          {p.stock > 0 && p.stock <= 8 && <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.danger }}>Only {p.stock} left</span>}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 16px 10px" }}>
      <div style={{ fontWeight: 900, fontSize: 16.5, color: BRAND.ink }}>{title}</div>
      {action && <button onClick={onAction} style={{ background: "none", border: "none", color: BRAND.green, fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>{action} <ChevronRight size={14} /></button>}
    </div>
  );
}

/* ---------- screens ---------- */

function ScreenHome({ products, onOpenProduct, favorites, toggleFav, setScreen, setActiveCat, search, setSearch }) {
  const featured = products.filter(p => p.tag === "New").slice(0, 4);
  const bestSellers = products.filter(p => p.tag === "Best Seller").slice(0, 4);

  return (
    <div>
      <div style={{
        background: `linear-gradient(155deg, ${BRAND.green} 0%, ${BRAND.greenDark} 100%)`,
        padding: "16px 16px 28px", position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -40, right: -60, width: 220, height: 220, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)"
        }} />
        <div style={{
          position: "absolute", inset: 0, background: `linear-gradient(120deg, transparent 40%, rgba(246,185,10,0.15) 48%, transparent 56%)`,
        }} />
        <Logo size={28} />
        <div style={{ marginTop: 18, color: BRAND.white, fontWeight: 900, fontSize: 22, lineHeight: 1.2, position: "relative" }}>
          Clean Better.<br />Live Fresher.
        </div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12.5, marginTop: 6, maxWidth: 240, position: "relative" }}>
          Affordable, powerful home-care products made for Nigerian homes & businesses.
        </div>
        <div style={{
          marginTop: 16, background: BRAND.white, borderRadius: 12, padding: "11px 14px",
          display: "flex", alignItems: "center", gap: 8, position: "relative"
        }}>
          <Search size={16} color={BRAND.sub} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setScreen("shop")}
            placeholder="Search Ultra Clean products"
            style={{ border: "none", outline: "none", fontSize: 13.5, flex: 1, color: BRAND.ink }}
          />
        </div>
      </div>

      {/* Special offer */}
      <div style={{ margin: "16px 16px 0", background: BRAND.yellowSoft, border: `1px solid #F3DFA0`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: BRAND.yellow, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Tag size={18} color={BRAND.greenDark} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>Buy 3, Get 10% Off</div>
          <div style={{ fontSize: 11.5, color: BRAND.sub }}>Applies automatically at checkout on any 3 items</div>
        </div>
      </div>

      {/* Categories */}
      <SectionHeader title="Shop by Category" action="See all" onAction={() => setScreen("shop")} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, padding: "0 16px" }}>
        {CATS.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setScreen("shop"); }} style={{
              background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: "12px 6px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer"
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: BRAND.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={17} color={BRAND.green} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: BRAND.ink, textAlign: "center", lineHeight: 1.15 }}>{c.name}</div>
            </button>
          );
        })}
      </div>

      <SectionHeader title="Featured Products" action="Shop now" onAction={() => setScreen("shop")} />
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 4px" }}>
        {featured.map(p => (
          <div key={p.id} style={{ minWidth: 140, maxWidth: 140 }}>
            <ProductCard p={p} onOpen={onOpenProduct} isFav={favorites.includes(p.id)} onToggleFav={toggleFav} />
          </div>
        ))}
      </div>

      <SectionHeader title="Best Sellers" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
        {bestSellers.map(p => <ProductCard key={p.id} p={p} onOpen={onOpenProduct} isFav={favorites.includes(p.id)} onToggleFav={toggleFav} />)}
      </div>

      <SectionHeader title="Why Choose Ultra Clean?" />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          ["Affordable pricing", "Premium quality without the premium price tag."],
          ["Made for Nigerian homes", "Formulated for local conditions — heat, dust & humidity."],
          ["Fast, trackable delivery", "Know exactly where your order is, every step of the way."],
        ].map(([t, d]) => (
          <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: BRAND.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={14} color={BRAND.green} strokeWidth={3} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>{t}</div>
              <div style={{ fontSize: 11.5, color: BRAND.sub, marginTop: 1 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Customer Reviews" />
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 16px 6px" }}>
        {[
          ["Chiamaka O.", "The gel air freshener actually lasts the whole month. Repeat customer since March."],
          ["Tunde A.", "Dishwashing liquid cuts through egusi soup grease with barely any water."],
          ["Blessing Hotel Suites", "We switched all our rooms to Ultra Clean — guests notice the difference."],
        ].map(([name, text]) => (
          <div key={name} style={{ minWidth: 210, background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 12 }}>
            <Stars rating={5} />
            <div style={{ fontSize: 12, color: BRAND.ink, marginTop: 6, lineHeight: 1.4 }}>"{text}"</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: BRAND.sub, marginTop: 8 }}>{name}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: "18px 16px 8px", background: BRAND.greenDark, borderRadius: 16, padding: 16, color: BRAND.white }}>
        <div style={{ fontWeight: 900, fontSize: 14.5 }}>Need help with an order?</div>
        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>Our support team replies within a few hours.</div>
        <PrimaryButton variant="yellow" style={{ marginTop: 10, width: "100%" }} onClick={() => setScreen("account")}>Contact Us</PrimaryButton>
      </div>
    </div>
  );
}

function ScreenShop({ products, onOpenProduct, favorites, toggleFav, activeCat, setActiveCat, search, setSearch }) {
  const [sort, setSort] = useState("relevance");
  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (activeCat === "all" || p.cat === activeCat) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCat, search, sort]);

  return (
    <div>
      <div style={{ background: BRAND.green, padding: "14px 16px 16px" }}>
        <div style={{ color: BRAND.white, fontWeight: 900, fontSize: 18 }}>Shop All Products</div>
        <div style={{ marginTop: 10, background: BRAND.white, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Search size={15} color={BRAND.sub} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
            style={{ border: "none", outline: "none", fontSize: 13, flex: 1 }} />
          {search && <X size={14} color={BRAND.sub} style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "12px 16px 4px", overflowX: "auto" }}>
        {[{ id: "all", name: "All" }, ...CATS].map(c => (
          <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
            padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${activeCat === c.id ? BRAND.green : BRAND.line}`,
            background: activeCat === c.id ? BRAND.green : BRAND.white, color: activeCat === c.id ? BRAND.white : BRAND.ink,
            fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer"
          }}>{c.name}</button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px" }}>
        <div style={{ fontSize: 11.5, color: BRAND.sub, fontWeight: 700 }}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
          border: `1px solid ${BRAND.line}`, borderRadius: 8, fontSize: 11.5, padding: "5px 8px", color: BRAND.ink, fontWeight: 700
        }}>
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "4px 16px 16px" }}>
        {filtered.map(p => <ProductCard key={p.id} p={p} onOpen={onOpenProduct} isFav={favorites.includes(p.id)} onToggleFav={toggleFav} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: BRAND.sub, fontSize: 13 }}>
            No products match "{search}".
          </div>
        )}
      </div>
    </div>
  );
}

function ScreenProduct({ product, onBack, onAddToCart, onBuyNow, isFav, onToggleFav }) {
  const [size, setSize] = useState("md");
  const [fragrance, setFragrance] = useState(product.hasFragrance ? FRAGRANCES[0] : null);
  const [qty, setQty] = useState(1);
  const sizeObj = SIZES.find(s => s.id === size);
  const unitPrice = product.price * sizeObj.mult;
  const outOfStock = product.stock === 0;

  return (
    <div>
      <div style={{ background: `linear-gradient(155deg, ${BRAND.green}, ${BRAND.greenDark})`, padding: "14px 16px 40px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <ChevronLeft size={18} color={BRAND.white} />
          </button>
          <Logo size={20} />
          <button onClick={() => onToggleFav(product.id)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Heart size={16} color={BRAND.white} fill={isFav ? BRAND.white : "none"} />
          </button>
        </div>
      </div>

      <div style={{ margin: "-28px 16px 0", background: BRAND.white, borderRadius: 20, padding: 16, boxShadow: "0 8px 24px rgba(15,107,58,0.12)", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 16px" }}>
          <div style={{
            width: 90, height: 118, borderRadius: "10px 10px 22px 22px", background: BRAND.greenSoft,
            border: `2.5px solid ${BRAND.green}`, position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden"
          }}>
            <div style={{ width: "100%", height: "55%", background: BRAND.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: BRAND.yellow, fontWeight: 900, fontSize: 9, letterSpacing: 0.5 }}>ULTRA<br/>CLEAN</span>
            </div>
            <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 28, height: 12, background: BRAND.yellow, borderRadius: 3 }} />
          </div>
        </div>

        {product.tag && <Badge tone={product.tag === "New" ? "yellow" : "green"}>{product.tag}</Badge>}
        <div style={{ fontSize: 11, fontWeight: 800, color: BRAND.sub, textTransform: "uppercase", marginTop: 8, letterSpacing: 0.5 }}>ULTRA CLEAN</div>
        <div style={{ fontWeight: 900, fontSize: 21, color: BRAND.ink, marginTop: 2 }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <Stars rating={product.rating} size={14} />
          <span style={{ fontSize: 12, color: BRAND.sub, fontWeight: 700 }}>{product.rating} ({product.reviews} reviews)</span>
        </div>
        <div style={{ fontWeight: 900, fontSize: 24, color: BRAND.green, marginTop: 10 }}>{money(unitPrice)}</div>
        <div style={{ fontSize: 12, color: outOfStock ? BRAND.danger : BRAND.sub, fontWeight: 700, marginTop: 2 }}>
          {outOfStock ? "Out of stock" : product.stock <= 8 ? `Only ${product.stock} left in stock` : "In stock"}
        </div>

        <div style={{ fontSize: 13, color: BRAND.ink, marginTop: 14, lineHeight: 1.5 }}>{product.desc}</div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: BRAND.ink, marginBottom: 8 }}>Size</div>
          <div style={{ display: "flex", gap: 8 }}>
            {SIZES.map(s => (
              <button key={s.id} onClick={() => setSize(s.id)} style={{
                flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer",
                border: `1.5px solid ${size === s.id ? BRAND.green : BRAND.line}`,
                background: size === s.id ? BRAND.greenSoft : BRAND.white,
                color: size === s.id ? BRAND.green : BRAND.ink, fontWeight: 700, fontSize: 12.5
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        {product.hasFragrance && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 12.5, color: BRAND.ink, marginBottom: 8 }}>Fragrance</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FRAGRANCES.map(f => (
                <button key={f} onClick={() => setFragrance(f)} style={{
                  padding: "7px 12px", borderRadius: 999, cursor: "pointer",
                  border: `1.5px solid ${fragrance === f ? BRAND.green : BRAND.line}`,
                  background: fragrance === f ? BRAND.green : BRAND.white,
                  color: fragrance === f ? BRAND.white : BRAND.ink, fontWeight: 700, fontSize: 12
                }}>{f}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: BRAND.ink, marginBottom: 8 }}>Quantity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${BRAND.line}`, background: BRAND.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={14} /></button>
            <span style={{ fontWeight: 800, fontSize: 15, minWidth: 18, textAlign: "center" }}>{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.stock || 1, q + 1))} style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${BRAND.line}`, background: BRAND.white, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={14} /></button>
          </div>
        </div>

        <div style={{ marginTop: 18, background: BRAND.greenSoft, borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: BRAND.ink, marginBottom: 6 }}>Benefits</div>
          {product.benefits.map(b => (
            <div key={b} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 4 }}>
              <Check size={13} color={BRAND.green} strokeWidth={3} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: BRAND.ink }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 12.5, color: BRAND.ink, marginBottom: 4 }}>Instructions</div>
          <div style={{ fontSize: 12, color: BRAND.sub, lineHeight: 1.5 }}>{product.instructions}</div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22, paddingBottom: 6 }}>
          <PrimaryButton variant="outline" style={{ flex: 1 }} disabled={outOfStock}
            onClick={() => onAddToCart({ product, size: sizeObj, fragrance, qty, unitPrice })}>
            <ShoppingCart size={16} /> Add to Cart
          </PrimaryButton>
          <PrimaryButton style={{ flex: 1 }} disabled={outOfStock}
            onClick={() => onBuyNow({ product, size: sizeObj, fragrance, qty, unitPrice })}>
            Buy Now
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ScreenCart({ cart, updateQty, removeItem, onCheckout, setScreen }) {
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discount = cart.reduce((s, i) => s + i.qty, 0) >= 3 ? subtotal * 0.1 : 0;
  const delivery = cart.length ? 1000 : 0;
  const total = subtotal - discount + delivery;

  if (cart.length === 0) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: BRAND.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <ShoppingCart size={26} color={BRAND.green} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: BRAND.ink, marginTop: 14 }}>Your cart is empty</div>
        <div style={{ fontSize: 12.5, color: BRAND.sub, marginTop: 4 }}>Add some Ultra Clean products to get started.</div>
        <PrimaryButton style={{ marginTop: 18, margin: "18px auto 0" }} onClick={() => setScreen("shop")}>Shop Now</PrimaryButton>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "16px 16px 6px", fontWeight: 900, fontSize: 18, color: BRAND.ink }}>Your Cart</div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {cart.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: 10, background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 10 }}>
            <div style={{ width: 46, height: 58, borderRadius: "6px 6px 12px 12px", background: BRAND.greenSoft, border: `2px solid ${BRAND.green}`, flexShrink: 0, display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: "55%", background: BRAND.green }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>{item.product.name}</div>
              <div style={{ fontSize: 11, color: BRAND.sub, marginTop: 1 }}>{item.size.label}{item.fragrance ? ` · ${item.fragrance}` : ""}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => updateQty(idx, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${BRAND.line}`, background: BRAND.white, cursor: "pointer" }}>−</button>
                  <span style={{ fontWeight: 700, fontSize: 12.5 }}>{item.qty}</span>
                  <button onClick={() => updateQty(idx, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${BRAND.line}`, background: BRAND.white, cursor: "pointer" }}>+</button>
                </div>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: BRAND.green }}>{money(item.unitPrice * item.qty)}</div>
              </div>
            </div>
            <button onClick={() => removeItem(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: BRAND.sub, alignSelf: "flex-start" }}><X size={15} /></button>
          </div>
        ))}
      </div>

      <div style={{ margin: "16px 16px 0", background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 14 }}>
        <Row label="Subtotal" value={money(subtotal)} />
        {discount > 0 && <Row label="Discount (10%)" value={"−" + money(discount)} valueColor={BRAND.green} />}
        <Row label="Delivery" value={money(delivery)} />
        <div style={{ borderTop: `1px dashed ${BRAND.line}`, margin: "8px 0" }} />
        <Row label="Total" value={money(total)} bold />
      </div>

      <div style={{ padding: 16 }}>
        <PrimaryButton style={{ width: "100%" }} onClick={() => onCheckout(total)}>Proceed to Checkout</PrimaryButton>
      </div>
    </div>
  );
}

function Row({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
      <span style={{ fontSize: bold ? 14 : 12.5, color: bold ? BRAND.ink : BRAND.sub, fontWeight: bold ? 800 : 600 }}>{label}</span>
      <span style={{ fontSize: bold ? 15 : 12.5, color: valueColor || (bold ? BRAND.ink : BRAND.ink), fontWeight: bold ? 900 : 700 }}>{value}</span>
    </div>
  );
}

function ScreenCheckout({ total, onPlaceOrder, onBack, userEmail }) {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [payment, setPayment] = useState("card");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const canPlace = address.trim().length > 3;

  const handlePlaceOrder = () => {
    setPayError("");

    // Pay on delivery skips the payment gateway entirely.
    if (payment === "cod") {
      onPlaceOrder({ address, city, payment });
      return;
    }

    if (!window.PaystackPop) {
      setPayError("Payment system is still loading. Please try again in a moment.");
      return;
    }

    setPaying(true);
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: userEmail || "guest@ultraclean.app",
      amount: Math.round(total * 100), // Paystack expects kobo
      currency: "NGN",
      channels: payment === "transfer" ? ["bank_transfer"] : ["card"],
      ref: "UC-" + Date.now(),
      callback: function (response) {
        setPaying(false);
        onPlaceOrder({ address, city, payment, paystackRef: response.reference });
      },
      onClose: function () {
        setPaying(false);
      },
    });
    handler.openIframe();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 4px" }}>
        <button onClick={onBack} style={{ background: BRAND.greenSoft, border: "none", borderRadius: 999, width: 30, height: 30, cursor: "pointer" }}><ChevronLeft size={16} color={BRAND.green} /></button>
        <div style={{ fontWeight: 900, fontSize: 17, color: BRAND.ink }}>Checkout</div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink, display: "flex", alignItems: "center", gap: 6 }}><MapPin size={15} color={BRAND.green} /> Delivery Location</div>
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address, e.g. 14 Allen Avenue"
          style={{ width: "100%", marginTop: 8, border: `1.5px solid ${BRAND.line}`, borderRadius: 10, padding: "11px 12px", fontSize: 13, boxSizing: "border-box" }} />
        <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%", marginTop: 8, border: `1.5px solid ${BRAND.line}`, borderRadius: 10, padding: "11px 12px", fontSize: 13 }}>
          {["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink, display: "flex", alignItems: "center", gap: 6 }}><CreditCard size={15} color={BRAND.green} /> Payment Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[["card", "Debit / Credit Card"], ["transfer", "Bank Transfer"], ["cod", "Pay on Delivery"]].map(([id, label]) => (
            <button key={id} onClick={() => setPayment(id)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10,
              border: `1.5px solid ${payment === id ? BRAND.green : BRAND.line}`, background: payment === id ? BRAND.greenSoft : BRAND.white, cursor: "pointer"
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.ink }}>{label}</span>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${payment === id ? BRAND.green : BRAND.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {payment === id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: BRAND.green }} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: "20px 16px 0", background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 14 }}>
        <Row label="Order total" value={money(total)} bold />
      </div>

      <div style={{ padding: 16 }}>
        {payError && <div style={{ color: BRAND.danger, fontSize: 12, marginBottom: 10, fontWeight: 600, textAlign: "center" }}>{payError}</div>}
        <PrimaryButton style={{ width: "100%" }} disabled={!canPlace || paying} onClick={handlePlaceOrder}>
          {paying ? "Waiting for payment…" : payment === "cod" ? `Place Order · ${money(total)}` : `Pay ${money(total)}`}
        </PrimaryButton>
        {!canPlace && <div style={{ fontSize: 11, color: BRAND.sub, textAlign: "center", marginTop: 6 }}>Enter a delivery address to continue</div>}
      </div>
    </div>
  );
}

function ScreenOrderConfirm({ order, setScreen }) {
  return (
    <div style={{ padding: "50px 24px", textAlign: "center" }}>
      <div style={{ width: 68, height: 68, borderRadius: "50%", background: BRAND.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
        <Check size={30} color={BRAND.white} strokeWidth={3} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 18, color: BRAND.ink, marginTop: 16 }}>Order Confirmed!</div>
      <div style={{ fontSize: 12.5, color: BRAND.sub, marginTop: 6 }}>Order #{order.id} · {money(order.total)}</div>
      <div style={{ fontSize: 12.5, color: BRAND.sub, marginTop: 2 }}>We'll deliver to {order.address}, {order.city}.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
        <PrimaryButton onClick={() => setScreen("track", order.id)}>Track Order</PrimaryButton>
        <PrimaryButton variant="outline" onClick={() => setScreen("shop")}>Continue Shopping</PrimaryButton>
      </div>
    </div>
  );
}

function ScreenOrders({ orders, setScreen, setTrackId }) {
  if (orders.length === 0) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        <Package size={30} color={BRAND.green} style={{ margin: "0 auto" }} />
        <div style={{ fontWeight: 800, fontSize: 15, color: BRAND.ink, marginTop: 12 }}>No orders yet</div>
        <div style={{ fontSize: 12.5, color: BRAND.sub, marginTop: 4 }}>Your order history will show up here.</div>
        <PrimaryButton style={{ margin: "18px auto 0" }} onClick={() => setScreen("shop")}>Shop Now</PrimaryButton>
      </div>
    );
  }
  return (
    <div>
      <div style={{ padding: "16px 16px 8px", fontWeight: 900, fontSize: 18, color: BRAND.ink }}>Order History</div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.slice().reverse().map(o => (
          <button key={o.id} onClick={() => { setTrackId(o.id); setScreen("track"); }} style={{
            textAlign: "left", background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 14, cursor: "pointer"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 13.5, color: BRAND.ink }}>Order #{o.id}</span>
              <Badge tone={o.status === "Delivered" ? "green" : "yellow"}>{o.status}</Badge>
            </div>
            <div style={{ fontSize: 11.5, color: BRAND.sub, marginTop: 4 }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {money(o.total)}</div>
            <div style={{ fontSize: 11, color: BRAND.sub, marginTop: 2 }}>{o.address}, {o.city}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenTrack({ order, setScreen }) {
  if (!order) return null;
  const idx = STATUSES.indexOf(order.status);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 4px" }}>
        <button onClick={() => setScreen("orders")} style={{ background: BRAND.greenSoft, border: "none", borderRadius: 999, width: 30, height: 30, cursor: "pointer" }}><ChevronLeft size={16} color={BRAND.green} /></button>
        <div style={{ fontWeight: 900, fontSize: 17, color: BRAND.ink }}>Order #{order.id}</div>
      </div>
      <div style={{ margin: "14px 16px 0", background: BRAND.greenSoft, borderRadius: 14, padding: 16, textAlign: "center" }}>
        <Truck size={26} color={BRAND.green} style={{ margin: "0 auto" }} />
        <div style={{ fontWeight: 800, fontSize: 14, color: BRAND.ink, marginTop: 8 }}>{order.status}</div>
        <div style={{ fontSize: 11.5, color: BRAND.sub, marginTop: 2 }}>Delivering to {order.address}, {order.city}</div>
      </div>

      <div style={{ margin: "20px 16px 0" }}>
        {STATUSES.map((s, i) => (
          <div key={s} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i <= idx ? BRAND.green : BRAND.line, flexShrink: 0
              }}>
                {i <= idx && <Check size={12} color={BRAND.white} strokeWidth={3} />}
              </div>
              {i < STATUSES.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: i < idx ? BRAND.green : BRAND.line }} />}
            </div>
            <div style={{ paddingBottom: 20 }}>
              <div style={{ fontWeight: i <= idx ? 800 : 600, fontSize: 13, color: i <= idx ? BRAND.ink : BRAND.sub }}>{s}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ margin: "0 16px", background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink, marginBottom: 8 }}>Items</div>
        {order.items.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", color: BRAND.ink }}>
            <span>{it.qty}× {it.product.name} ({it.size.label})</span>
            <span style={{ fontWeight: 700 }}>{money(it.unitPrice * it.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px dashed ${BRAND.line}`, margin: "8px 0" }} />
        <Row label="Total" value={money(order.total)} bold />
      </div>
    </div>
  );
}

function ScreenAuth() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${BRAND.line}`,
    fontSize: 13.5, color: BRAND.ink, outline: "none", boxSizing: "border-box", marginBottom: 10
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setNotice("Account created! Check your email to confirm, then sign in.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <Logo size={30} dark />
        <div style={{ fontWeight: 800, fontSize: 16, color: BRAND.ink, marginTop: 14 }}>
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </div>
        <div style={{ fontSize: 12.5, color: BRAND.sub, marginTop: 4 }}>
          {mode === "signin" ? "Sign in to view your orders and favorites" : "Sign up to start shopping with Ultra Clean"}
        </div>
      </div>

      <form onSubmit={submit}>
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoCapitalize="none" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

        {error && <div style={{ color: BRAND.danger, fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{error}</div>}
        {notice && <div style={{ color: BRAND.green, fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{notice}</div>}

        <PrimaryButton style={{ width: "100%" }} disabled={loading}>
          {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Sign Up"}
        </PrimaryButton>
      </form>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 12.5, color: BRAND.sub }}>
        {mode === "signin" ? (
          <>Don't have an account?{" "}
            <span onClick={() => { setMode("signup"); setError(""); setNotice(""); }} style={{ color: BRAND.green, fontWeight: 700, cursor: "pointer" }}>Sign up</span>
          </>
        ) : (
          <>Already have an account?{" "}
            <span onClick={() => { setMode("signin"); setError(""); setNotice(""); }} style={{ color: BRAND.green, fontWeight: 700, cursor: "pointer" }}>Sign in</span>
          </>
        )}
      </div>
    </div>
  );
}

function ScreenAccount({ favorites, products, setScreen, onOpenProduct, toggleFav, setAdminMode, session }) {
  const favProducts = products.filter(p => favorites.includes(p.id));

  if (!session) {
    return <ScreenAuth />;
  }

  const email = session.user.email;
  const initial = email ? email[0].toUpperCase() : "?";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(155deg, ${BRAND.green}, ${BRAND.greenDark})`, padding: "18px 16px 22px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: BRAND.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: BRAND.greenDark }}>{initial}</div>
        <div>
          <div style={{ color: BRAND.white, fontWeight: 800, fontSize: 15 }}>My Account</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11.5 }}>{email}</div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 8px", fontWeight: 900, fontSize: 15, color: BRAND.ink }}>Favorites</div>
      {favProducts.length === 0 ? (
        <div style={{ padding: "0 16px", fontSize: 12, color: BRAND.sub }}>No favorites yet — tap the heart on any product.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
          {favProducts.map(p => <ProductCard key={p.id} p={p} onOpen={onOpenProduct} isFav={true} onToggleFav={toggleFav} />)}
        </div>
      )}

      <div style={{ padding: "20px 16px 8px", fontWeight: 900, fontSize: 15, color: BRAND.ink }}>Settings</div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {["Saved Addresses", "Payment Methods", "Notifications", "Customer Support"].map(t => (
          <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: "13px 14px" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: BRAND.ink }}>{t}</span>
            <ChevronRight size={15} color={BRAND.sub} />
          </div>
        ))}
        {session?.user?.email === ADMIN_EMAIL && (
          <button onClick={() => setAdminMode(true)} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", background: BRAND.greenSoft,
            border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: "13px 14px", cursor: "pointer", marginTop: 6
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: BRAND.green }}>Admin Dashboard</span>
            <ChevronRight size={15} color={BRAND.green} />
          </button>
        )}
        <button onClick={handleSignOut} style={{
          display: "flex", justifyContent: "center", alignItems: "center", background: "#FCEAE8",
          border: "none", borderRadius: 12, padding: "13px 14px", cursor: "pointer", marginTop: 10
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: BRAND.danger }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Admin ---------- */

function ScreenAdmin({ products, setProducts, orders, setOrders, setAdminMode }) {
  const [tab, setTab] = useState("overview");
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 8);
  const outStock = products.filter(p => p.stock === 0);

  const updateStock = (id, delta) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };
  const removeProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));
  const advanceOrder = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const idx = STATUSES.indexOf(o.status);
      const next = STATUSES[Math.min(STATUSES.length - 1, idx + 1)];
      supabase.from("orders").update({ status: next }).eq("id", id).then(({ error }) => {
        if (error) console.error("Could not update order status:", error);
      });
      return { ...o, status: next };
    }));
  };

  return (
    <div style={{ minHeight: "100%", background: "#F5F7F5" }}>
      <div style={{ background: BRAND.greenDark, padding: "16px 16px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5 }}>ULTRA CLEAN</div>
          <div style={{ color: BRAND.white, fontWeight: 900, fontSize: 16 }}>Admin Dashboard</div>
        </div>
        <button onClick={() => setAdminMode(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "7px 12px", color: BRAND.white, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>Exit</button>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "12px 16px 0", overflowX: "auto" }}>
        {[["overview", "Overview", BarChart3], ["products", "Products", Package], ["orders", "Orders", ClipboardList], ["customers", "Customers", Users]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 999, whiteSpace: "nowrap",
            border: `1.5px solid ${tab === id ? BRAND.green : BRAND.line}`, background: tab === id ? BRAND.green : BRAND.white,
            color: tab === id ? BRAND.white : BRAND.ink, fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}><Icon size={13} /> {label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <StatCard label="Total Revenue" value={money(revenue)} icon={TrendingUp} />
            <StatCard label="Orders" value={orders.length} icon={ClipboardList} />
            <StatCard label="Products" value={products.length} icon={Package} />
            <StatCard label="Low Stock" value={lowStock.length + outStock.length} icon={AlertTriangle} tone="warn" />
          </div>

          {(lowStock.length > 0 || outStock.length > 0) && (
            <div style={{ marginTop: 14, background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 14 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={14} color={BRAND.danger} /> Inventory Alerts
              </div>
              {[...outStock, ...lowStock].map(p => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 12 }}>
                  <span style={{ color: BRAND.ink }}>{p.name}</span>
                  <Badge tone={p.stock === 0 ? "danger" : "yellow"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</Badge>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink, marginBottom: 8 }}>Business Channels</div>
            {["Retail Orders", "Wholesale Orders", "Distributor Accounts", "Promotions & Discounts"].map(t => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${BRAND.line}` }}>
                <span style={{ fontSize: 12.5, color: BRAND.ink, fontWeight: 600 }}>{t}</span>
                <Badge tone="yellow">Coming soon</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: BRAND.sub }}>{CATS.find(c => c.id === p.cat)?.name} · {money(p.price)}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ background: BRAND.greenSoft, border: "none", borderRadius: 7, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={12} color={BRAND.green} /></button>
                  <button onClick={() => removeProduct(p.id)} style={{ background: "#FCEAE8", border: "none", borderRadius: 7, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={12} color={BRAND.danger} /></button>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11.5, color: BRAND.sub, fontWeight: 700 }}>Stock: {p.stock}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => updateStock(p.id, -5)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${BRAND.line}`, background: BRAND.white, cursor: "pointer" }}>−</button>
                  <button onClick={() => updateStock(p.id, 5)} style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${BRAND.line}`, background: BRAND.white, cursor: "pointer" }}>+</button>
                </div>
              </div>
            </div>
          ))}
          <PrimaryButton variant="outline" style={{ marginTop: 4 }}><Plus size={15} /> Add New Product</PrimaryButton>
        </div>
      )}

      {tab === "orders" && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {orders.length === 0 && <div style={{ fontSize: 12.5, color: BRAND.sub, textAlign: "center", padding: "30px 0" }}>No orders placed yet.</div>}
          {orders.slice().reverse().map(o => (
            <div key={o.id} style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>#{o.id}</span>
                <Badge tone={o.status === "Delivered" ? "green" : "yellow"}>{o.status}</Badge>
              </div>
              <div style={{ fontSize: 11.5, color: BRAND.sub, marginTop: 3 }}>{o.items.length} items · {money(o.total)} · {o.city}</div>
              {o.status !== "Delivered" && (
                <button onClick={() => advanceOrder(o.id)} style={{ marginTop: 8, background: BRAND.greenSoft, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11.5, fontWeight: 700, color: BRAND.green, cursor: "pointer" }}>
                  Advance to next stage →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "customers" && (
        <div style={{ padding: 16 }}>
          <div style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: BRAND.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: BRAND.greenDark }}>A</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: BRAND.ink }}>Ada Okafor</div>
              <div style={{ fontSize: 11, color: BRAND.sub }}>{orders.length} order{orders.length !== 1 ? "s" : ""} · ada.okafor@email.com</div>
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: BRAND.sub, textAlign: "center", marginTop: 16 }}>Full customer database available once wholesale & distributor accounts launch.</div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div style={{ background: BRAND.white, border: `1px solid ${BRAND.line}`, borderRadius: 14, padding: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: tone === "warn" ? "#FCEAE8" : BRAND.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={14} color={tone === "warn" ? BRAND.danger : BRAND.green} />
      </div>
      <div style={{ fontWeight: 900, fontSize: 17, color: BRAND.ink, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: BRAND.sub, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

/* ---------- root app ---------- */

export default function UltraCleanApp() {
  const [products, setProducts] = useState(seedProducts);

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const [{ data: categories, error: catErr }, { data: rows, error: prodErr }, { data: fragranceRows, error: fragErr }] =
          await Promise.all([
            supabase.from("categories").select("id, name"),
            supabase.from("product").select("id, name, category_id, price, tag, description"),
            supabase.from("product_fragrances").select("product_id, name"),
          ]);

        if (catErr) throw catErr;
        if (prodErr) throw prodErr;
        if (fragErr) throw fragErr;

        // Map DB category names ("Air Care") to the slug the UI uses ("air")
        const nameToSlug = {};
        CATS.forEach((c) => { nameToSlug[c.name] = c.id; });
        const categoryIdToSlug = {};
        (categories || []).forEach((c) => {
          categoryIdToSlug[c.id] = nameToSlug[c.name] || "surface";
        });

        // Group fragrance rows by product
        const fragrancesByProduct = {};
        (fragranceRows || []).forEach((f) => {
          if (!fragrancesByProduct[f.product_id]) fragrancesByProduct[f.product_id] = [];
          fragrancesByProduct[f.product_id].push(f.name);
        });

        const liveProducts = (rows || []).map((r) => ({
          id: String(r.id),
          cat: categoryIdToSlug[r.category_id] || "surface",
          name: r.name,
          tag: r.tag || "",
          price: r.price,
          // Not yet columns in the DB — safe defaults so the UI doesn't break.
          // Add these columns in Supabase later to make them live too.
          stock: 50,
          rating: 4.5,
          reviews: 0,
          benefits: [],
          instructions: "",
          hasFragrance: (fragrancesByProduct[r.id] || []).length > 0,
          desc: r.description || "",
        }));

        if (liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      } catch (err) {
        // If anything goes wrong (e.g. RLS not configured yet), keep showing
        // the sample data instead of breaking the live app.
        console.error("Could not load live products, showing sample data:", err);
      }
    }

    loadLiveProducts();
  }, []);

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const [screen, setScreenRaw] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [trackId, setTrackId] = useState(null);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [lastOrder, setLastOrder] = useState(null);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [adminMode, setAdminMode] = useState(false);

  // Load this customer's order history from Supabase whenever they sign in.
  useEffect(() => {
    async function loadOrders() {
      if (!session) {
        setOrders([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("id, items, total, address, city, payment, paystack_ref, status, created_at")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders((data || []).map((o) => ({
          id: o.id,
          items: o.items,
          total: o.total,
          address: o.address,
          city: o.city,
          payment: o.payment,
          paystackRef: o.paystack_ref,
          status: o.status,
        })));
      } catch (err) {
        console.error("Could not load order history:", err);
      }
    }
    loadOrders();
  }, [session]);

  const setScreen = (s, id) => {
    if (id) setTrackId(id);
    setScreenRaw(s);
    window.scrollTo?.(0, 0);
  };

  const openProduct = (p) => { setSelectedProduct(p); setScreen("product"); };
  const toggleFav = (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
    setScreen("cart");
  };
  const buyNow = (item) => {
    setCart(prev => [...prev, item]);
    setScreen("cart");
  };
  const updateQty = (idx, d) => setCart(prev => prev.map((it, i) => i === idx ? { ...it, qty: Math.max(1, it.qty + d) } : it));
  const removeItem = (idx) => setCart(prev => prev.filter((_, i) => i !== idx));

  const goCheckout = (total) => {
    if (!session) {
      setScreen("account");
      return;
    }
    setPendingTotal(total);
    setScreen("checkout");
  };

  const placeOrder = async ({ address, city, payment, paystackRef }) => {
    if (!session) {
      setScreen("account");
      return;
    }
    const row = {
      user_id: session.user.id,
      items: cart,
      total: pendingTotal,
      address, city, payment,
      paystack_ref: paystackRef || null,
      status: STATUSES[0],
    };
    try {
      const { data, error } = await supabase.from("orders").insert(row).select().single();
      if (error) throw error;
      const order = {
        id: data.id,
        items: data.items,
        total: data.total,
        address: data.address,
        city: data.city,
        payment: data.payment,
        paystackRef: data.paystack_ref,
        status: data.status,
      };
      setOrders(prev => [order, ...prev]);
      setCart([]);
      setLastOrder(order);
      setTrackId(order.id);
      setScreen("confirm");
    } catch (err) {
      console.error("Could not save order to your account, showing local confirmation instead:", err);
      const order = {
        id: String(1000 + orders.length + 1),
        items: cart, total: pendingTotal, address, city, payment,
        paystackRef: paystackRef || null, status: STATUSES[0],
      };
      setOrders(prev => [order, ...prev]);
      setCart([]);
      setLastOrder(order);
      setTrackId(order.id);
      setScreen("confirm");
    }
  };

  const trackedOrder = orders.find(o => o.id === trackId) || lastOrder;

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Shop", icon: Search },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: cart.length },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "account", label: "Account", icon: User },
  ];

  if (adminMode && session?.user?.email === ADMIN_EMAIL) {
    return (
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 420, margin: "0 auto", background: "#F5F7F5", minHeight: 700 }}>
        <ScreenAdmin products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} setAdminMode={setAdminMode} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", maxWidth: 420, margin: "0 auto", background: "#F7FAF8", minHeight: 700, position: "relative" }}>
      <div style={{ paddingBottom: 76 }}>
        {screen === "home" && (
          <ScreenHome products={products} onOpenProduct={openProduct} favorites={favorites} toggleFav={toggleFav}
            setScreen={setScreen} setActiveCat={setActiveCat} search={search} setSearch={setSearch} />
        )}
        {screen === "shop" && (
          <ScreenShop products={products} onOpenProduct={openProduct} favorites={favorites} toggleFav={toggleFav}
            activeCat={activeCat} setActiveCat={setActiveCat} search={search} setSearch={setSearch} />
        )}
        {screen === "product" && selectedProduct && (
          <ScreenProduct product={selectedProduct} onBack={() => setScreen("shop")} onAddToCart={addToCart} onBuyNow={buyNow}
            isFav={favorites.includes(selectedProduct.id)} onToggleFav={toggleFav} />
        )}
        {screen === "cart" && (
          <ScreenCart cart={cart} updateQty={updateQty} removeItem={removeItem} onCheckout={goCheckout} setScreen={setScreen} />
        )}
        {screen === "checkout" && (
          <ScreenCheckout total={pendingTotal} onPlaceOrder={placeOrder} onBack={() => setScreen("cart")} userEmail={session?.user?.email} />
        )}
        {screen === "confirm" && lastOrder && (
          <ScreenOrderConfirm order={lastOrder} setScreen={setScreen} />
        )}
        {screen === "orders" && (
          <ScreenOrders orders={orders} setScreen={setScreen} setTrackId={setTrackId} />
        )}
        {screen === "track" && (
          <ScreenTrack order={trackedOrder} setScreen={setScreen} />
        )}
        {screen === "account" && (
          <ScreenAccount favorites={favorites} products={products} setScreen={setScreen} onOpenProduct={openProduct} toggleFav={toggleFav} setAdminMode={setAdminMode} session={session} />
        )}
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420,
        background: BRAND.white, borderTop: `1px solid ${BRAND.line}`, display: "flex", padding: "8px 4px 14px",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.05)"
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = screen === item.id || (item.id === "orders" && screen === "track") || (item.id === "shop" && screen === "product");
          return (
            <button key={item.id} onClick={() => setScreen(item.id)} style={{
              flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, position: "relative", padding: "4px 0"
            }}>
              <Icon size={19} color={active ? BRAND.green : BRAND.sub} strokeWidth={active ? 2.4 : 2} />
              {item.badge > 0 && (
                <div style={{ position: "absolute", top: -2, right: "28%", background: BRAND.yellow, color: BRAND.greenDark, borderRadius: 999, minWidth: 15, height: 15, fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>{item.badge}</div>
              )}
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, color: active ? BRAND.green : BRAND.sub }}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
