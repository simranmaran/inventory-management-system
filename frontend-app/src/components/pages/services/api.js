const BASE_URL = "http://127.0.0.1:8000/api";

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products/`);  // ✅ fixed
  return response.json();
};

export const addProduct = async (data) => {
  return fetch(`${BASE_URL}/products/`, {
    method: "POST",
    body: data,
  });
};

export const deleteProduct = async (id) => {
  return fetch(`${BASE_URL}/products/${id}/`, {
    method: "DELETE",
  });
};