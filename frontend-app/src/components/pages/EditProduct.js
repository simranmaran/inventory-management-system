import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", code: "", category: "", price: "", quantity: "",  description: ""
  });

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // get  the product data
  useEffect(() => {
    if (isAdmin) {
      fetch("http://127.0.0.1:8000/api/products/" + id + "/")
      .then(res => res.json())
        .then(data => {
          setForm({
            name: data.name, code: data.code, category: data.category, price: data.price, quantity: data.quantity, description: data.description
          });
        });
    }
  }, [id]);

  // input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // update product
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!isAdmin) return alert("Admin only");

    fetch("http://127.0.0.1:8000/api/products/" + id + "/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer admin123"
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        alert("Updated");
        navigate("/");
      })
      .catch(() => alert("Error"));
  };

  // if not admin
  if (!isAdmin) {
    return (
      <div>
        <h2>Admin only</h2>
        <Link to="/"><button>Back</button></Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate}>
      <h2>Edit Product</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="code" value={form.code} onChange={handleChange} placeholder="Code" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
      <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

      <button>Update</button>
    </form>
  );
}

export default EditProduct;