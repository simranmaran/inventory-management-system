import React from "react";

function Cart({ cart }) {
  return (
    <div>
      <h2>Cart</h2>

      {cart.map((item) => (
        <div key={item.id}>
          {item.name} - {item.price}
        </div>
      ))}
    </div>
  );
}

export default Cart;