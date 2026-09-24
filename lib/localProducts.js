const OVERRIDES = "product-admin-overrides",
  DELETED = "product-admin-deleted",
  ADDED = "product-admin-added";
function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function mergeLocalProducts(products) {
  if (typeof window === "undefined") return products;
  const overrides = read(OVERRIDES, {}),
    deleted = new Set(read(DELETED, [])),
    added = read(ADDED, []);
  return [...added, ...products]
    .filter((p) => !deleted.has(p.id))
    .map((p) => ({ ...p, ...(overrides[String(p.id)] || {}) }));
}
export function getLocalProduct(id) {
  const overrides = read(OVERRIDES, {}),
    added = read(ADDED, []);
  const addedProduct = added.find((p) => p.id === id);
  if (addedProduct) return addedProduct;
  return overrides[String(id)] ? { id, ...overrides[String(id)] } : null;
}
export function saveProductOverride(id, data) {
  const overrides = read(OVERRIDES, {});
  overrides[String(id)] = { ...(overrides[String(id)] || {}), ...data };
  write(OVERRIDES, overrides);
}
export function saveAddedProduct(product) {
  write(ADDED, [product, ...read(ADDED, [])]);
}
export function markDeleted(id) {
  const deleted = read(DELETED, []);
  if (!deleted.includes(id)) write(DELETED, [...deleted, id]);
}
