import { api } from "./api";
export async function getProducts({
  limit,
  skip,
  search,
  category,
  sortBy,
  order,
  signal,
}) {
  if (search && category) {
    const { data } = await api.get("/products/search", {
      params: { q: search, limit: 0 },
      signal,
    });
    return data;
  }
  const endpoint = search
    ? "/products/search"
    : category
      ? `/products/category/${encodeURIComponent(category)}`
      : "/products";
  const { data } = await api.get(endpoint, {
    params: {
      ...(search ? { q: search } : {}),
      limit,
      skip,
      ...(sortBy ? { sortBy, order } : {}),
    },
    signal,
  });
  return data;
}
export async function getProduct(id, signal) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return data;
}
export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data;
}
export async function addProduct(input) {
  const { data } = await api.post("/products/add", input);
  return data;
}
export async function updateProduct(id, input) {
  const { data } = await api.put(`/products/${id}`, input);
  return data;
}
export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
