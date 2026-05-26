import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Cart() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const saveCart = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };
  const removeItem = (index) => {
    const next = [...cart];
    next.splice(index, 1);
    saveCart(next);
  };
  const downloadCartPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Name", "Price"]],
      body: cart.map((item) => [item.name, item.price]),
    });
    doc.save("cart.pdf");
  };
  return (
    <div className="card">
      <h2 className="page-title">Cart</h2>
      <button className="button-pill" onClick={downloadCartPDF}>Download Cart PDF</button>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div className="field-row">
          {cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="cart-row">
              <div>
                <strong>{item.name}</strong> - ₹{item.price}
              </div>
              <button className="button-pill" type="button" onClick={() => removeItem(idx)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;