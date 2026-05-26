import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((res) => res.json())
      .then((result) => setData(result));
  }, [id]);

  return (
    <div className="card product-card">
      <h2 className="page-title">{data.name}</h2>

      {data.image && (
        <img
          src={`http://127.0.0.1:8000${data.image}`}
          alt="product"
        />
      )}

      <p className="badge">Code: {data.code}</p>
      <p className="badge">Price: ₹{data.price}</p>
      <p className="badge">Qty: {data.quantity}</p>
      <p className="badge">Category: {data.category}</p>
      <p>{data.description}</p>
    </div>
  );
}

export default ProductDetail;