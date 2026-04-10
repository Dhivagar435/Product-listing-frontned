import api from "../interceptor/jwtToken";
import { useEffect, useState } from "react";

interface Brand { id: number; name: string; }
interface Category { id: number; name: string; }
interface Product {
    id: number; name: string; sku: string; price: number;
    discountPrice: number | null; discountPercentage: number | null;
    category: Category; brand: Brand; isActive: boolean; images?: string[];
    description?: string;
}

const API_URL = import.meta.env.VITE_API || "http://10.50.201.93:5000/api";
const getImageUrl = (filename: string) => `${API_URL.replace(/\/$/, "")}/uploads/${filename}`;

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e8e8e8",
    borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif", background: "#fafafa", color: "#1a1a2e"
};

function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState<any>({
        name: "", description: "", sku: "", price: "",
        discountPrice: "", discountPercentage: "", categoryId: "",
        brandId: "", isActive: true, createdBy: "admin", updatedBy: "admin",
    });
    const [editId, setEditId] = useState<number | null>(null);

    const fetchProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data.data.data);
    };
    const fetchBrands = async () => {
        const res = await api.get("/brands");
        setBrands(res.data.data.data);
    };
    const fetchCategories = async () => {
        const res = await api.get("/categories");
        setCategories(res.data.data.data);
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchCategories();
    }, []);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const newFiles = Array.from(e.target.files);
        const newUrls = newFiles.map(file => URL.createObjectURL(file));
        setImageFiles(prev => [...prev, ...newFiles]);
        setPreviewUrls(prev => [...prev, ...newUrls]);
        setTimeout(() => { e.target.value = ""; }, 100);
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
        imageFiles.forEach(file => formData.append("images", file));
        formData.append("existingImages", JSON.stringify(existingImages));
        const deletedImages = originalImages.filter(img => !existingImages.includes(img));
        formData.append("deletedImages", JSON.stringify(deletedImages));

        try {
            if (editId) {
                await api.patch(`/products/${editId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            } else {
                await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
            }
            resetForm();
            fetchProducts();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setImageFiles([]);
        setPreviewUrls([]);
        setExistingImages([]);
        setOriginalImages([]);
        setEditId(null);
        setShowForm(false);
        setForm({ name: "", description: "", sku: "", price: "", discountPrice: "", discountPercentage: "", categoryId: "", brandId: "", isActive: true, createdBy: "admin", updatedBy: "admin" });
    };
    const handleEdit = (p: Product) => {
        setForm({ name: p.name, description: p.description || "", sku: p.sku, price: p.price, discountPrice: p.discountPrice || "", discountPercentage: p.discountPercentage || "", categoryId: p.category?.id, brandId: p.brand?.id, isActive: p.isActive, createdBy: "admin", updatedBy: "admin" });
        const imgs = p.images || [];
        setExistingImages(imgs); setOriginalImages(imgs); setImageFiles([]);
        setEditId(p.id); setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this product?")) return;
        await api.delete(`/products/${id}`);
        fetchProducts();
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={{ background: "#1a1a2e", padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 8, height: 36, background: "#f0a500", borderRadius: 4 }} />
                    <div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 24, margin: 0 }}>Products</h1>
                        <p style={{ color: "#888", margin: 0, fontSize: 13 }}>{products.length} total products</p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    style={{ padding: "12px 24px", background: "#f0a500", color: "#1a1a2e", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                >
                    + Add Product
                </button>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

                {/* Form Panel */}
                {showForm && (
                    <div style={{ background: "#fff", borderRadius: 16, padding: 36, boxShadow: "0 8px 40px rgba(0,0,0,0.10)", marginBottom: 36, border: editId ? "2px solid #f0a500" : "2px solid #1a1a2e" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
                                {editId ? "✏️ Edit Product" : "➕ Add New Product"}
                            </h2>
                            <button onClick={resetForm} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa" }}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>CATEGORY</label>
                                    <select name="categoryId" value={form.categoryId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" as any }}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>BRAND</label>
                                    <select name="brandId" value={form.brandId} onChange={handleChange} style={{ ...inputStyle, appearance: "none" as any }}>
                                        <option value="">Select Brand</option>
                                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PRODUCT NAME</label>
                                    <input name="name" placeholder="e.g. iPhone 15 Pro" value={form.name} onChange={handleChange} style={inputStyle} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>SKU</label>
                                    <input name="sku" placeholder="e.g. IPH-15-PRO-256" value={form.sku} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                                <textarea name="description" placeholder="Product description..." value={form.description} onChange={handleChange}
                                    style={{ ...inputStyle, minHeight: 90, resize: "vertical" as any }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PRICE (₹)</label>
                                    <input name="price" placeholder="0.00" value={form.price} onChange={handleChange} style={inputStyle} type="number" />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>DISCOUNT PRICE (₹)</label>
                                    <input name="discountPrice" placeholder="0.00" value={form.discountPrice} onChange={handleChange} style={inputStyle} type="number" />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>DISCOUNT %</label>
                                    <input name="discountPercentage" placeholder="0" value={form.discountPercentage} onChange={handleChange} style={inputStyle} type="number" />
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: "#888", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PRODUCT IMAGES</label>
                                <div style={{ border: "2px dashed #e0e0e0", borderRadius: 10, padding: "16px 20px", background: "#fafafa", textAlign: "center" }}>
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{ display: "block", width: "100%", cursor: "pointer" }} />
                                    <p style={{ color: "#aaa", fontSize: 12, margin: "8px 0 0" }}>Select multiple images. Click again to add more.</p>
                                </div>

                                {imageFiles.length > 0 && (
                                    <div style={{ marginTop: 12 }}>
                                        <p style={{ fontSize: 12, color: "#888", marginBottom: 8, fontWeight: 600 }}>NEW IMAGES</p>
                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                            {imageFiles.map((_, i) => (
                                                <div key={i} style={{ position: "relative" }}>
                                                    <img
                                                        src={previewUrls[i]}   
                                                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "2px solid #e0e0e0", display: "block" }}
                                                        alt={`preview-${i}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(i)}
                                                        style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, background: "#e53e3e", color: "#fff", border: "none", borderRadius: "50%", fontSize: 13, cursor: "pointer" }}
                                                    >×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {existingImages.length > 0 && (
                                    <div style={{ marginTop: 12 }}>
                                        <p style={{ fontSize: 12, color: "#888", marginBottom: 8, fontWeight: 600 }}>EXISTING IMAGES</p>
                                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                            {existingImages.map((img, i) => (
                                                <div key={i} style={{ position: "relative" }}>
                                                    <img src={getImageUrl(img)} style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "2px solid #e0e0e0" }} alt=""
                                                        onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/72?text=Err"; }} />
                                                    <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                                                        style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, background: "#e53e3e", color: "#fff", border: "none", borderRadius: "50%", fontSize: 12, cursor: "pointer" }}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} style={{ width: 18, height: 18, accentColor: "#f0a500" }} />
                                    <span style={{ fontWeight: 500, color: "#1a1a2e" }}>Active / Visible</span>
                                </label>
                                <div style={{ display: "flex", gap: 12 }}>
                                    <button type="button" onClick={resetForm} style={{ padding: "12px 20px", background: "#f5f5f5", color: "#666", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer" }}>Cancel</button>
                                    <button type="submit" disabled={loading} style={{ padding: "12px 32px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                                        {loading ? "Saving..." : editId ? "Update Product" : "Add Product"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

              
                <div style={{ marginBottom: 24 }}>
                    <input type="text" placeholder="🔍  Search by name, SKU or category..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ ...inputStyle, background: "#fff", padding: "13px 18px", fontSize: 15, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }} />
                </div>

             
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 40 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#1a1a2e" }}>
                                {["#", "PRODUCT", "SKU", "PRICE", "CATEGORY", "BRAND", "STATUS", "ACTIONS"].map(h => (
                                    <th key={h} style={{ padding: "14px 16px", color: "#888", fontSize: 11, fontWeight: 600, textAlign: h === "ACTIONS" ? "right" : "left", letterSpacing: 0.8 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} style={{ textAlign: "center", padding: 60, color: "#bbb", fontSize: 15 }}>No products found</td></tr>
                            ) : filtered.map((p, i) => (
                                <tr key={p.id} style={{ borderBottom: "1px solid #f4f4f4" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <td style={{ padding: "14px 16px", color: "#ccc", fontSize: 13 }}>{i + 1}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            {p.images?.length ? (
                                                <img src={getImageUrl(p.images[0])} style={{ width: 42, height: 42, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} alt=""
                                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                            ) : (
                                                <div style={{ width: 42, height: 42, background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 18 }}>📦</div>
                                            )}
                                            <span style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px", color: "#888", fontSize: 13, fontFamily: "monospace" }}>{p.sku}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ color: "#1a1a2e", fontWeight: 700, fontSize: 14 }}>₹{p.price}</span>
                                        {p.discountPrice && <div style={{ color: "#f0a500", fontSize: 12 }}>↓ ₹{p.discountPrice}</div>}
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ background: "#f0f4ff", color: "#4a6cf7", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{p.category?.name}</span>
                                    </td>
                                    <td style={{ padding: "14px 16px", color: "#555", fontSize: 13 }}>{p.brand?.name}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{ background: p.isActive ? "#e8f8f0" : "#fff0f0", color: p.isActive ? "#27ae60" : "#e53e3e", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                            {p.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                        <button onClick={() => handleEdit(p)} style={{ padding: "7px 14px", background: "#fff8e8", color: "#f0a500", border: "1px solid #f0d090", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 8 }}>Edit</button>
                                        <button onClick={() => handleDelete(p.id)} style={{ padding: "7px 14px", background: "#fff0f0", color: "#e53e3e", border: "1px solid #f5c6c6", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card Grid */}
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#1a1a2e", marginBottom: 20 }}>Product Showcase</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
                    {products.map(p => (
                        <div key={p.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; }}
                        >
                            <div style={{ position: "relative", height: 180, background: "#f8f7f4", overflow: "hidden" }}>
                                {p.images?.length ? (
                                    <img src={getImageUrl(p.images[0])} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={p.name}
                                        onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x180?text=No+Image"; }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#ddd" }}>📦</div>
                                )}
                                {p.discountPercentage && (
                                    <div style={{ position: "absolute", top: 12, right: 12, background: "#e53e3e", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                                        -{p.discountPercentage}%
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: "16px 18px" }}>
                                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                                    <span style={{ background: "#f0f4ff", color: "#4a6cf7", padding: "3px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.category?.name}</span>
                                    <span style={{ background: "#f5f5f5", color: "#888", padding: "3px 8px", borderRadius: 20, fontSize: 11 }}>{p.brand?.name}</span>
                                </div>
                                <h3 style={{ fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px", fontSize: 15 }}>{p.name}</h3>
                                <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 12px", fontFamily: "monospace" }}>{p.sku}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>
                                        <span style={{ color: "#1a1a2e", fontWeight: 800, fontSize: 18 }}>₹{p.discountPrice || p.price}</span>
                                        {p.discountPrice && <span style={{ color: "#bbb", fontSize: 13, textDecoration: "line-through", marginLeft: 6 }}>₹{p.price}</span>}
                                    </div>
                                    <button onClick={() => handleEdit(p)} style={{ padding: "7px 14px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductPage;