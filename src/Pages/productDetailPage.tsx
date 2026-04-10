import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Product {
    id: number; name: string; sku: string; price: number;
    discountPrice: number | null; discountPercentage: number | null;
    description?: string; isActive: boolean; images?: string[];
    category: { id: number; name: string };
    brand: { id: number; name: string };
}

const API_URL = import.meta.env.VITE_API || "http://10.50.201.93:5000/api";
const getImageUrl = (filename: string) => `${API_URL.replace(/\/$/, "")}/uploads/${filename}`;

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(0);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`${API_URL}/products/${id}`)
            .then(res => {
                setProduct(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const savings = product?.price && product?.discountPrice
        ? product.price - product.discountPrice : 0;

    if (loading) return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f8f7f4" }}>
            <div style={{ textAlign: "center", color: "#888" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                <p>Loading product...</p>
            </div>
        </div>
    );

    if (!product) return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f8f7f4" }}>
            <div style={{ textAlign: "center", color: "#888" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
                <h2 style={{ color: "#1a1a2e" }}>Product not found</h2>
                <button onClick={() => navigate(-1)} style={{ padding: "12px 24px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 16 }}>← Go Back</button>
            </div>
        </div>
    );

    const images = product.images?.length ? product.images : [];

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap" rel="stylesheet" />

            {/* Navbar */}
            <div style={{ background: "#1a1a2e", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("/products")}>
                    <div style={{ width: 6, height: 24, background: "#f0a500", borderRadius: 3 }} />
                    <span style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 20 }}>SuperLabs Store</span>
                </div>
                <button onClick={() => navigate(-1)} style={{ background: "none", border: "1px solid #444", color: "#aaa", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
                    ← Back
                </button>
            </div>

            {/* Breadcrumb */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px" }}>
                <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
                    <span style={{ cursor: "pointer", color: "#f0a500" }} onClick={() => navigate("/products")}>Products</span>
                    {" / "}
                    <span style={{ cursor: "pointer", color: "#888" }}>{product.category?.name}</span>
                    {" / "}
                    <span style={{ color: "#1a1a2e", fontWeight: 500 }}>{product.name}</span>
                </p>
            </div>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 24px 60px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

                    {/* Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", marginBottom: 16, position: "relative", aspectRatio: "1" }}>
                            {images.length > 0 ? (
                                <img
                                    src={getImageUrl(images[selectedImg])}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    alt={product.name}
                                    onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/500?text=No+Image"; }}
                                />
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, color: "#ddd", minHeight: 400 }}>📦</div>
                            )}
                            {product.discountPercentage && (
                                <div style={{ position: "absolute", top: 16, left: 16, background: "#e53e3e", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                                    -{product.discountPercentage}% OFF
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {images.map((img, i) => (
                                    <div key={i} onClick={() => setSelectedImg(i)}
                                        style={{ width: 72, height: 72, borderRadius: 10, overflow: "hidden", cursor: "pointer", border: selectedImg === i ? "3px solid #f0a500" : "3px solid transparent", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "border-color 0.15s" }}
                                    >
                                        <img src={getImageUrl(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt=""
                                            onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/72?text=Err"; }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Badges */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                            <span style={{ background: "#f0f4ff", color: "#4a6cf7", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{product.category?.name}</span>
                            <span style={{ background: "#f5f5f5", color: "#666", padding: "5px 12px", borderRadius: 20, fontSize: 12 }}>{product.brand?.name}</span>
                            <span style={{ background: product.isActive ? "#e8f8f0" : "#fff0f0", color: product.isActive ? "#27ae60" : "#e53e3e", padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                {product.isActive ? "✓ In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#1a1a2e", margin: "0 0 8px", lineHeight: 1.25 }}>{product.name}</h1>
                        <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 20px", fontFamily: "monospace" }}>SKU: {product.sku}</p>

                        {/* Price Block */}
                        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: savings > 0 ? 10 : 0 }}>
                                <span style={{ fontSize: 36, fontWeight: 800, color: "#1a1a2e", lineHeight: 1 }}>
                                    ₹{product.discountPrice || product.price}
                                </span>
                                {product.discountPrice && (
                                    <span style={{ fontSize: 20, color: "#bbb", textDecoration: "line-through", lineHeight: 1.6 }}>₹{product.price}</span>
                                )}
                            </div>
                            {savings > 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ background: "#e8f8f0", color: "#27ae60", padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                                        You save ₹{savings}!
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#888", letterSpacing: 0.8, margin: "0 0 10px" }}>DESCRIPTION</h3>
                                <p style={{ color: "#555", lineHeight: 1.7, margin: 0, fontSize: 15 }}>{product.description}</p>
                            </div>
                        )}

                        {/* Quantity */}
                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#888", letterSpacing: 0.8, margin: "0 0 10px" }}>QUANTITY</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e0e0e0", borderRadius: 10, overflow: "hidden" }}>
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                                        style={{ padding: "10px 16px", border: "none", background: "#f8f7f4", cursor: "pointer", fontSize: 18, color: "#1a1a2e", fontWeight: 700 }}>−</button>
                                    <span style={{ padding: "10px 20px", fontSize: 16, fontWeight: 700, color: "#1a1a2e", minWidth: 40, textAlign: "center" }}>{qty}</span>
                                    <button onClick={() => setQty(q => q + 1)}
                                        style={{ padding: "10px 16px", border: "none", background: "#f8f7f4", cursor: "pointer", fontSize: 18, color: "#1a1a2e", fontWeight: 700 }}>+</button>
                                </div>
                                <span style={{ color: "#aaa", fontSize: 13 }}>Total: <strong style={{ color: "#1a1a2e" }}>₹{((product.discountPrice || product.price) * qty).toLocaleString()}</strong></span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.isActive}
                                style={{
                                    flex: 1, padding: "16px", background: added ? "#27ae60" : "#1a1a2e",
                                    color: "#fff", border: "none", borderRadius: 12,
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                                    cursor: product.isActive ? "pointer" : "not-allowed",
                                    transition: "background 0.3s"
                                }}
                            >
                                {added ? "✓ Added to Cart!" : "Add to Cart"}
                            </button>
                            <button
                                disabled={!product.isActive}
                                style={{
                                    flex: 1, padding: "16px", background: "#f0a500",
                                    color: "#1a1a2e", border: "none", borderRadius: 12,
                                    fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                                    cursor: product.isActive ? "pointer" : "not-allowed"
                                }}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Product Meta */}
                        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#888", letterSpacing: 0.8, margin: "0 0 14px" }}>PRODUCT DETAILS</h3>
                            {[
                                ["SKU", product.sku],
                                ["Category", product.category?.name],
                                ["Brand", product.brand?.name],
                                ["Availability", product.isActive ? "In Stock" : "Out of Stock"],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f4f4f4" }}>
                                    <span style={{ color: "#888", fontSize: 14 }}>{label}</span>
                                    <span style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600 }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}