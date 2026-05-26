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
    <div>
      <h2>{data.name}</h2>

      {/* 🖼️ Image */}
      {data.image && (
        <img
          src={`http://127.0.0.1:8000${data.image}`}
          width="200"
          alt="product"
        />
      )}

      <p>{data.description}</p>
      <p>Price: {data.price}</p>
      <p>Category: {data.category}</p>
    </div>
  );
}

export default ProductDetail;