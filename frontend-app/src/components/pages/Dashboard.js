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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getData();

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
  }, []);

  const getData = () => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((result) => setData(result));
  };

  // ADMIN LOGIN
  const handleAdminLogin = () => {
    const pass = prompt("Enter admin password");
    if (pass === "admin123") {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      alert("Admin login success");
    } else {
      alert("Wrong password");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    alert("Logged out");
  };

  // DELETE
  const handleDelete = (id) => {
    if (!isAdmin) {
      alert("Admin only");
      return;
    }

    fetch("http://127.0.0.1:8000/api/products/" + id + "/", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer admin123",
      },
    }).then(() => {
      alert("Deleted");
      getData();
    });
  };

  // CART
  const addToCart = (item) => {
    const newCart = [...cart, item];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // FILTER
  let filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (category) {
    filteredData = filteredData.filter(
      (item) => item.category === category
    );
  }

  if (sort === "low") {
    filteredData.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredData.sort((a, b) => b.price - a.price);
  }

  // PDF
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

  const downloadCartPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["Name", "Price"]],
      body: cart.map((item) => [item.name, item.price]),
    });

    doc.save("cart.pdf");
  };

  const categories = [...new Set(data.map((item) => item.category))];

  return (
    <div>
      <h2>Dashboard</h2>

      {/* ADMIN */}
      {!isAdmin ? (
        <button onClick={handleAdminLogin}>Admin Login</button>
      ) : (
        <button onClick={handleAdminLogout}>Logout</button>
      )}

      <Link to="/add"><button>Add Product</button></Link>
      <Link to="/cart"><button>Cart</button></Link>

      {/* FILTER */}
      <br /><br />

      <input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        {categories.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Low to High</option>
        <option value="high">High to Low</option>
      </select>
      <br /><br />
      <button onClick={downloadPDF}>Download Products PDF</button>
      <button onClick={downloadCartPDF}>Download Cart PDF</button>

      {/* TABLE */}
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
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.code}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>

              <td>
                {isAdmin && (
                  <button onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                )}
                {isAdmin ? (
                  <Link to={`/edit/${item.id}`}>
                    <button>Edit</button>
                  </Link>
                ) : (
                  <span>Admin only</span>
                )}
                <Link to={`/product/${item.id}`}>
                  <button>View</button>
                </Link>
                <button onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* CART VIEW */}
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>No items</p>
      ) : (
        cart.map((item, i) => (
          <div key={i}>
            {item.name} - ₹{item.price}
          </div>
        ))
      )}
    </div>
  );
}
export default Dashboard;