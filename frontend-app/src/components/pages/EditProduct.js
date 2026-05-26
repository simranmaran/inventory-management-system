import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    quantity: "",
    description: ""
  });

  useEffect(() => {
    if (!isAdmin) return;

    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
      });
  }, [id, isAdmin]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert("Admin access required to update products.");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer admin123"
      },
      body: JSON.stringify(form)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Update failed");
        }
        return res.json();
      })
      .then(() => {
        alert("Updated ho gaya");
        navigate("/");
      })
      .catch(() => {
        alert("Error aaya");
      });
  };

  if (!isAdmin) {
    return (
      <div className="card">
        <h2 className="page-title">Admin access required</h2>
        <p>Please login as admin on the dashboard before editing a product.</p>
        <Link className="button-pill" to="/">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={handleUpdate}>
      <h2 className="card-title">Edit Product</h2>
      <div className="field-row">
        <input className="input-field" name="name" value={form.name} onChange={handleChange} />
        <input className="input-field" name="code" value={form.code} onChange={handleChange} />
        <input className="input-field" name="category" value={form.category} onChange={handleChange} />
        <input className="input-field" name="price" value={form.price} onChange={handleChange} />
        <input className="input-field" name="quantity" value={form.quantity} onChange={handleChange} />
        <textarea className="input-field" name="description" value={form.description} onChange={handleChange} />
      </div>
      <button className="button-pill">Save Changes</button>
    </form>
  );
}

export default EditProduct;