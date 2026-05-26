import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    quantity: "",
    description: ""
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(() => {
        alert("Updated ho gaya");
      })
      .catch(() => {
        alert("Error aaya");
      });
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Edit Product</h2>

      <input name="name" value={form.name} onChange={handleChange} />
      <br />

      <input name="code" value={form.code} onChange={handleChange} />
      <br />

      <input name="category" value={form.category} onChange={handleChange} />
      <br />

      <input name="price" value={form.price} onChange={handleChange} />
      <br />

      <input name="quantity" value={form.quantity} onChange={handleChange} />
      <br />

      <textarea name="description" value={form.description} onChange={handleChange} />
      <br />

      <button>Update</button>
    </form>
  );
}

export default EditProduct;