import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import AddProduct from "./components/pages/AddProduct";
import EditProduct from "./components/pages/EditProduct";
import ProductDetail from "./components/pages/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <h1>Admin Panel</h1>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;