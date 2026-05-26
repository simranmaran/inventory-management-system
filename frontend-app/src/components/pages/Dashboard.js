import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  const ADMIN_AUTH_HEADER = {
    Authorization: "Bearer admin123",
  };

  const handleAdminLogin = () => {
    const password = window.prompt("Enter admin password:");
    if (password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      alert("Admin mode enabled");
    } else {
      alert("Invalid admin password");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    alert("Admin mode disabled");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((result) => setData(result));
  };

  const categories = [...new Set(data.map((item) => item.category).filter(Boolean))];

  const filteredData = data
    .filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || item.category === category)
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  const saveCart = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const addToCart = (item) => {
    saveCart([...cart, item]);
  };

  // ❌ Delete
  const handleDelete = (id) => {
    if (!isAdmin) {
      alert("Admin access required to delete products.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: "DELETE",
      headers: ADMIN_AUTH_HEADER,
    }).then(() => {
      alert("Deleted");
      getData();
    });
  };

  // 📄 Product PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["Name", "Code", "Price"]],
      body: filteredData.map((item) => [
        item.name,
        item.code,
        item.price,
      ]),
    });

    doc.save("products.pdf");
  };

  // 🛒 Cart PDF (🔥 NEW)
  const downloadCartPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["Name", "Price"]],
      body: cart.map((item) => [
        item.name,
        item.price
      ]),
    });

    doc.save("cart.pdf");
  };

  return (
    <div className="card">
      <div className="topbar">
        <h2 className="page-title">Dashboard</h2>
        {!isAdmin ? (
          <button className="button-pill" onClick={handleAdminLogin}>Admin Login</button>
        ) : (
          <button className="button-pill" onClick={handleAdminLogout}>Logout Admin</button>
        )}
        <Link to="/add">
          <button className="button-pill">Add Product</button>
        </Link>
        <Link to="/cart">
          <button className="button-pill">Go to Cart</button>
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="input-field"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="select-field" onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select className="select-field" onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      <br /><br />

      <div className="toolbar">
        <button className="button-pill" onClick={downloadPDF}>Download Product PDF</button>
        <button className="button-pill" onClick={downloadCartPDF}>Download Cart PDF</button>
      </div>

      <br />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Category</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.code}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>

              <td>
                {isAdmin && (
                  <button className="button-pill" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                )}

                {isAdmin ? (
                  <Link to={`/edit/${item.id}`}>
                    <button className="button-pill">Edit</button>
                  </Link>
                ) : (
                  <span className="badge">Admin only</span>
                )}

                <Link to={`/product/${item.id}`}>
                  <button className="button-pill">View</button>
                </Link>

                <button className="button-pill" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {/* 🛒 Cart */}
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item) => (
          <div key={item.id}>
            {item.name} - ₹{item.price}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;