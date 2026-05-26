import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((result) => setData(result));
  };

  // 🔍 Filter
  let filteredData = data.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || item.category === category)
    );
  });

  // 🔽 Sort
  if (sort === "low") {
    filteredData.sort((a, b) => a.price - b.price);
  }
  if (sort === "high") {
    filteredData.sort((a, b) => b.price - a.price);
  }

  // ❌ Delete
  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: "DELETE",
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
    <div>
      <h2>Dashboard</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 🎯 Filter */}
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
      </select>

      {/* 🔽 Sort */}
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>

      <br /><br />

      {/* 📄 PDF */}
      <button onClick={downloadPDF}>Download Product PDF</button>

      {/* 🛒 Cart PDF */}
      <button onClick={downloadCartPDF}>Download Cart PDF</button>

      <br /><br />

      {/* 📋 Table */}
      <table border="1">
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
                <button onClick={() => handleDelete(item.id)}>
                  Delete
                </button>

                <Link to={`/edit/${item.id}`}>
                  <button>Edit</button>
                </Link>

                <Link to={`/product/${item.id}`}>
                  <button>View</button>
                </Link>

                <button onClick={() => setCart([...cart, item])}>
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