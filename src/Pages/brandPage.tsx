import api from "../interceptor/axios";
import { useEffect, useState } from "react";

interface Brand {
    id: number;
    name: string;
}

function BrandPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchBrands = async () => {
        try {
            const res = await api.get("/brands");
            setBrands(res.data.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await api.patch(`/brands/${editId}`, { name, updatedBy: "admin" });
            } else {
                await api.post("/brands", { name, createdBy: "admin" });
            }
            setName("");
            setEditId(null);
            fetchBrands();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (brand: Brand) => {
        setName(brand.name);
        setEditId(brand.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this brand?")) return;
        try {
            await api.delete(`/brands/${id}`);
            fetchBrands();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setName("");
        setEditId(null);
    };

    const filtered = brands.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={{ background: "#1a1a2e", padding: "28px 40px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 8, height: 36, background: "#f0a500", borderRadius: 4 }} />
                <div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 24, margin: 0 }}>Brands</h1>
                    <p style={{ color: "#888", margin: 0, fontSize: 13 }}>{brands.length} total brands</p>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

                {/* Form Card */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 32, border: editId ? "2px solid #f0a500" : "2px solid transparent" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a2e", marginBottom: 20, marginTop: 0 }}>
                        {editId ? "✏️ Edit Brand" : "➕ Add New Brand"}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
                        <input
                            type="text"
                            placeholder="Brand name (e.g. Nike, Apple, Samsung...)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={{
                                flex: 1, padding: "12px 16px", border: "1.5px solid #e0e0e0",
                                borderRadius: 10, fontSize: 15, outline: "none",
                                fontFamily: "'DM Sans', sans-serif"
                            }}
                            onFocus={e => e.target.style.borderColor = "#f0a500"}
                            onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "12px 28px", background: "#1a1a2e", color: "#fff",
                                border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                                fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
                            }}
                        >
                            {loading ? "Saving..." : editId ? "Update" : "Add Brand"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    padding: "12px 20px", background: "#f5f5f5", color: "#666",
                                    border: "none", borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
                                    fontSize: 15, cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                {/* Search */}
                <div style={{ marginBottom: 20 }}>
                    <input
                        type="text"
                        placeholder="🔍  Search brands..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: "100%", padding: "11px 16px", border: "1.5px solid #e0e0e0",
                            borderRadius: 10, fontSize: 14, outline: "none",
                            fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", background: "#fff"
                        }}
                    />
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#1a1a2e" }}>
                                <th style={{ padding: "14px 20px", color: "#888", fontSize: 12, fontWeight: 600, textAlign: "left", letterSpacing: 1 }}>#</th>
                                <th style={{ padding: "14px 20px", color: "#888", fontSize: 12, fontWeight: 600, textAlign: "left", letterSpacing: 1 }}>BRAND NAME</th>
                                <th style={{ padding: "14px 20px", color: "#888", fontSize: 12, fontWeight: 600, textAlign: "right", letterSpacing: 1 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "center", padding: 48, color: "#aaa", fontSize: 15 }}>
                                        No brands found
                                    </td>
                                </tr>
                            ) : filtered.map((brand, i) => (
                                <tr key={brand.id} style={{ borderBottom: "1px solid #f0f0f0" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <td style={{ padding: "16px 20px", color: "#bbb", fontSize: 13 }}>{i + 1}</td>
                                    <td style={{ padding: "16px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontWeight: 500, color: "#1a1a2e", fontSize: 15 }}>{brand.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            style={{ padding: "7px 16px", background: "#fff8e8", color: "#f0a500", border: "1px solid #f0d090", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 8 }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand.id)}
                                            style={{ padding: "7px 16px", background: "#fff0f0", color: "#e53e3e", border: "1px solid #f5c6c6", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BrandPage;