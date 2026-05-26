import React, { useState } from "react";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    image: null
  });

  const handleChange = (e) => {
    const name = e.target.name;

    if (name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("code", form.code);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("quantity", form.quantity);
    fd.append("description", form.description);
    fd.append("image", form.image);

    fetch("http://127.0.0.1:8000/api/products/", {
      method: "POST",
      body: fd
    })
      .then(() => {
        alert("Product add ho gaya");
      })
      .catch(() => {
        alert("Error aaya");
      });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2 className="card-title">Add Product</h2>
      <div className="field-row">
        <input className="input-field" name="name" placeholder="Product name" onChange={handleChange} />
        <input className="input-field" name="code" placeholder="Product code" onChange={handleChange} />
        <input className="input-field" name="category" placeholder="Category" onChange={handleChange} />
        <input className="input-field" name="price" placeholder="Price" onChange={handleChange} />
        <input className="input-field" name="quantity" placeholder="Quantity" onChange={handleChange} />
        <textarea className="input-field" name="description" placeholder="Description" onChange={handleChange} />
        <input className="input-field" type="file" name="image" onChange={handleChange} />
      </div>
      <button className="button-pill">Add Product</button>
    </form>
  );
}

export default AddProduct;