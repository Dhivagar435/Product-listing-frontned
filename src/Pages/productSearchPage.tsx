import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Brand { id: number; name: string; }
interface Category { id: number; name: string; }
interface Product {
    id: number; name: string; sku: string; price: number;
    discountPrice: number | null; discountPercentage: number | null;
    category: Category; brand: Brand; isActive: boolean;
    images?: string[]; description?: string;
}

const API_URL = import.meta.env.VITE_API || "http://10.50.201.93:5000/api";
const getImageUrl = (filename: string) => `${API_URL.replace(/\/$/, "")}/uploads/${filename}`;

export default function ProductSearchPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState("");
    const [inputVal, setInputVal] = useState("");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const limit = 12;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { page, limit };
            if (query) params.q = query;
            if (selectedCategory) params.categoryId = selectedCategory;
            const res = await axios.get(`${API_URL}/products`, { params });
            const data = res.data.data;
            setProducts(data.data || []);
            setTotal(data.total || data.data?.length || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [query, page, selectedCategory]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    useEffect(() => {
        axios.get(`${API_URL}/categories`).then(res => setCategories(res.data.data.data));
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setQuery(inputVal);
        setPage(1);
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />

            {/* Hero Search Header */}
            <div style={{ background: "#1a1a2e", padding: "60px 40px 40px", textAlign: "center" }}>
                <p style={{ color: "#f0a500", fontSize: 13, fontWeight: 600, letterSpacing: 2, marginBottom: 12 }}>SUPERLABS STORE</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 42, margin: "0 0 8px", lineHeight: 1.2 }}>
                    Find Your <em style={{ color: "#f0a500", fontStyle: "italic" }}>Perfect</em> Product
                </h1>
                <p style={{ color: "#888", margin: "0 0 32px", fontSize: 16 }}>{total} products available</p>

                <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: 640, margin: "0 auto", gap: 0 }}>
                    <input
                        type="text"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        placeholder="Search products, brands, categories..."
                        style={{
                            flex: 1, padding: "16px 20px", border: "none", borderRadius: "12px 0 0 12px",
                            fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif",
                            background: "#fff", color: "#1a1a2e"
                        }}
                    />
                    <button type="submit" style={{
                        padding: "16px 28px", background: "#f0a500", color: "#1a1a2e",
                        border: "none", borderRadius: "0 12px 12px 0", fontSize: 15,
                        fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap"
                    }}>
                        Search →
                    </button>
                </form>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ display: "flex", gap: 24 }}>

                    {/* Sidebar Filters */}
                    <div style={{ width: 220, flexShrink: 0 }}>
                        <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: 16 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#888", letterSpacing: 1, margin: "0 0 16px" }}>CATEGORIES</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <button
                                    onClick={() => { setSelectedCategory(""); setPage(1); }}
                                    style={{ textAlign: "left", padding: "8px 12px", border: "none", background: !selectedCategory ? "#1a1a2e" : "transparent", color: !selectedCategory ? "#fff" : "#555", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: !selectedCategory ? 600 : 400 }}
                                >
                                    All Products
                                </button>
                                {categories.map(c => (
                                    <button key={c.id}
                                        onClick={() => { setSelectedCategory(String(c.id)); setPage(1); }}
                                        style={{ textAlign: "left", padding: "8px 12px", border: "none", background: selectedCategory === String(c.id) ? "#1a1a2e" : "transparent", color: selectedCategory === String(c.id) ? "#fff" : "#555", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: selectedCategory === String(c.id) ? 600 : 400 }}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {query && (
                            <div style={{ background: "#fff8e8", borderRadius: 12, padding: 16, border: "1px solid #f0d090" }}>
                                <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Showing results for</p>
                                <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>"{query}"</p>
                                <button onClick={() => { setQuery(""); setInputVal(""); setPage(1); }}
                                    style={{ marginTop: 8, fontSize: 12, color: "#f0a500", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                                    Clear ✕
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Product Grid */}
                    <div style={{ flex: 1 }}>
                        {loading ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} style={{ background: "#fff", borderRadius: 16, height: 300, animation: "pulse 1.5s ease-in-out infinite", opacity: 0.6 }} />
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
                                <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                                <h3 style={{ fontSize: 20, color: "#555", margin: "0 0 8px" }}>No products found</h3>
                                <p style={{ fontSize: 15 }}>Try a different search term or browse all categories</p>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
                                    {products.map(p => (
                                        <div key={p.id}
                                            onClick={() => navigate(`/products/${p.id}`)}
                                            style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)"; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                                        >
                                            <div style={{ position: "relative", height: 200, background: "#f8f7f4", overflow: "hidden" }}>
                                                {p.images?.length ? (
                                                    <img src={getImageUrl(p.images[0])} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }} alt={p.name}
                                                        onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image"; }}
                                                        onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.05)"; }}
                                                        onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                                                    />
                                                ) : (
                                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#ddd" }}>📦</div>
                                                )}
                                                {p.discountPercentage && (
                                                    <div style={{ position: "absolute", top: 10, left: 10, background: "#e53e3e", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                                        -{p.discountPercentage}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ padding: "14px 16px" }}>
                                                <div style={{ marginBottom: 6 }}>
                                                    <span style={{ background: "#f0f4ff", color: "#4a6cf7", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.category?.name}</span>
                                                </div>
                                                <h3 style={{ fontWeight: 700, color: "#1a1a2e", margin: "0 0 2px", fontSize: 14, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.name}</h3>
                                                <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 10px" }}>{p.brand?.name}</p>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <div>
                                                        <span style={{ color: "#1a1a2e", fontWeight: 800, fontSize: 17 }}>₹{p.discountPrice || p.price}</span>
                                                        {p.discountPrice && <span style={{ color: "#bbb", fontSize: 12, textDecoration: "line-through", marginLeft: 5 }}>₹{p.price}</span>}
                                                    </div>
                                                    <span style={{ fontSize: 12, color: "#f0a500", fontWeight: 600 }}>View →</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                            style={{ padding: "10px 18px", background: page === 1 ? "#f0f0f0" : "#1a1a2e", color: page === 1 ? "#ccc" : "#fff", border: "none", borderRadius: 10, cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                                            ← Prev
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                            <button key={n} onClick={() => setPage(n)}
                                                style={{ padding: "10px 16px", background: page === n ? "#f0a500" : "#fff", color: page === n ? "#1a1a2e" : "#555", border: "1px solid #e0e0e0", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: page === n ? 700 : 400 }}>
                                                {n}
                                            </button>
                                        ))}
                                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                            style={{ padding: "10px 18px", background: page === totalPages ? "#f0f0f0" : "#1a1a2e", color: page === totalPages ? "#ccc" : "#fff", border: "none", borderRadius: 10, cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}