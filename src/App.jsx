import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./Pages/categoryPage";
import BrandPage from "./Pages/brandPage";
import ProductPage from "./Pages/productPage";
import ProductSearchPage from "./Pages/productSearchPage";
import ProductDetailPage from "./Pages/productDetailPage";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const adminLinks = [
    { label: "Brands", desc: "Add, edit, delete brands", path: "/admin/brands", color: "#E6F1FB", text: "#185FA5", letter: "B" },
    { label: "Categories", desc: "Add, edit, delete brands", path: "/admin/categories", color: "#E1F5EE", text: "#0F6E56", letter: "C" },
    { label: "Products", desc: "Add, update, remove products", path: "/admin/products", color: "#FAEEDA", text: "#854F0B", letter: "P" },
  ];

  const storeLinks = [
    { label: "Browse products", desc: "Search and filter all products", path: "/products", color: "#FBEAF0", text: "#993556", letter: "S" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
      <div style={{ background: "#1a1a2e", padding: "28px 40px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 8, height: 36, background: "#f0a500", borderRadius: 4 }} />
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: 24, margin: 0 }}>Dashboard</h1>
          <p style={{ color: "#888", margin: 0, fontSize: 13 }}>Manage your store</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        <p style={{ fontSize: 12, fontWeight: 600, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Admin panel</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
          {adminLinks.map(link => (
            <button key={link.path} onClick={() => navigate(link.path)}
              style={{ background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: 16, padding: 24, cursor: "pointer", textAlign: "left", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#f0a500")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: link.color, color: link.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
                {link.letter}
              </div>
              <p style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 15, margin: "0 0 4px" }}>{link.label}</p>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{link.desc}</p>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, fontWeight: 600, color: "#aaa", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Store</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {storeLinks.map(link => (
            <button key={link.path} onClick={() => navigate(link.path)}
              style={{ background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: 16, padding: 24, cursor: "pointer", textAlign: "left" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#f0a500")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: link.color, color: link.text, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
                {link.letter}
              </div>
              <p style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 15, margin: "0 0 4px" }}>{link.label}</p>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{link.desc}</p>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductSearchPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/admin/products" element={<ProductPage />} />
        <Route path="/admin/categories" element={<CategoryPage />} />
        <Route path="/admin/brands" element={<BrandPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;