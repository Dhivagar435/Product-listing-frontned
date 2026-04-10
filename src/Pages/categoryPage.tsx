import api from "../interceptor/jwtToken";
import { useEffect, useState } from "react";

interface Category {
    id: number;
    name: string;
}

function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await api.patch(`/categories/${editId}`, { name, updatedBy: "admin" });
            } else {
                await api.post("/categories", { name, createdBy: "admin" });
            }
            setName("");
            setEditId(null);
            fetchCategories();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat: Category) => {
        setName(cat.name);
        setEditId(cat.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setName("");
        setEditId(null);
    };

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={{ background: "#1a1a2e", padding: "28px 40px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 8, height: 36, background: "#f0a500", borderRadius: 4 }} />
                <div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 24, margin: 0 }}>Categories</h1>
                    <p style={{ color: "#888", margin: 0, fontSize: 13 }}>{categories.length} total categories</p>
                </div>
            </div>

            <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

                {/* Form Card */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 32, border: editId ? "2px solid #f0a500" : "2px solid transparent" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a2e", marginBottom: 20, marginTop: 0 }}>
                        {editId ? "✏️ Edit Category" : "➕ Add New Category"}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12 }}>
                        <input
                            type="text"
                            placeholder="Category name (e.g. Electronics, Clothing...)"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={{
                                flex: 1, padding: "12px 16px", border: "1.5px solid #e0e0e0",
                                borderRadius: 10, fontSize: 15, outline: "none",
                                fontFamily: "'DM Sans', sans-serif",
                                transition: "border-color 0.2s"
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
                            {loading ? "Saving..." : editId ? "Update" : "Add Category"}
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
                        placeholder="🔍  Search categories..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width: "100%", padding: "11px 16px", border: "1.5px solid #e0e0e0",
                            borderRadius: 10, fontSize: 14, outline: "none",
                            fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
                            background: "#fff"
                        }}
                    />
                </div>

                {/* Table */}
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#1a1a2e" }}>
                                <th style={{ padding: "14px 20px", color: "#888", fontSize: 12, fontWeight: 600, textAlign: "left", letterSpacing: 1 }}>#</th>
                                <th style={{ padding: "14px 20px", color: "#888", fontSize: 12, fontWeight: 600, textAlign: "left", letterSpacing: 1 }}>CATEGORY NAME</th>
                                <th style={{ padding: "14px 20px", color: "#888", fontSize: 12, fontWeight: 600, textAlign: "right", letterSpacing: 1 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: "center", padding: 48, color: "#aaa", fontSize: 15 }}>
                                        No categories found
                                    </td>
                                </tr>
                            ) : filtered.map((cat, i) => (
                                <tr key={cat.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.15s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                >
                                    <td style={{ padding: "16px 20px", color: "#bbb", fontSize: 13 }}>{i + 1}</td>
                                    <td style={{ padding: "16px 20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontWeight: 500, color: "#1a1a2e", fontSize: 15 }}>{cat.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            style={{ padding: "7px 16px", background: "#fff8e8", color: "#f0a500", border: "1px solid #f0d090", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 8 }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
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

export default CategoryPage;