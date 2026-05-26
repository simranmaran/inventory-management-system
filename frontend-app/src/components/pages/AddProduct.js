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
    if(e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    for(let key in form) {
      fd.append(key, form[key]);
    }
    fetch("http://127.0.0.1:8000/api/products/", {
      method: "POST",
      body: fd
    })
      .then(() => alert("Product added successfully"))
      .catch(() => alert("Error"));
  };
  return (
    <form  onSubmit={handleSubmit}>
      <h2>Add Product</h2>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="code" placeholder="Code" onChange={handleChange} />
        <input  name="category" placeholder="Category" onChange={handleChange} />
        <input  name="price" placeholder="Price" onChange={handleChange} />
        <input  name="quantity" placeholder="Quantity" onChange={handleChange} />
        <textarea  name="description" placeholder="Description" onChange={handleChange} />
        <input  type="file" name="image" onChange={handleChange} />
      <button> Add Product</button>
    </form>
  );
}
export default AddProduct;