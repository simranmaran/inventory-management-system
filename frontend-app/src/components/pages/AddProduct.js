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
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <input name="name" placeholder="name" onChange={handleChange} />
      <br />

      <input name="code" placeholder="code" onChange={handleChange} />
      <br />

      <input name="category" placeholder="category" onChange={handleChange} />
      <br />

      <input name="price" placeholder="price" onChange={handleChange} />
      <br />

      <input name="quantity" placeholder="qty" onChange={handleChange} />
      <br />

      <textarea name="description" onChange={handleChange} />
      <br />

      <input type="file" name="image" onChange={handleChange} />
      <br />

      <button>Add</button>
    </form>
  );
}

export default AddProduct;