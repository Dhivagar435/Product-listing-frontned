import { BrowserRouter, Routes, Route } from "react-router-dom";
import CategoryPage from "./Pages/categoryPage";
import BrandPage from "./Pages/brandPage";
import ProductPage from "./Pages/productPage";
import ProductSearchPage from "./Pages/productSearchPage";
import ProductDetailPage from "./Pages/productDetailPage";
function Home() {
  return <h1 className="text-2xl font-bold p-4">Product Listing</h1>;
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