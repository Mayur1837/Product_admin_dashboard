"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiError } from "../lib/api";
import { addProduct, getCategories, updateProduct } from "../lib/products";
import { saveAddedProduct, saveProductOverride } from "../lib/localProducts";
export function ProductForm({ product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    category: product?.category || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    thumbnail: product?.thumbnail || "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);
  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  async function submit(e) {
    e.preventDefault();
    if (saving) return;
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.category.trim()) return setError("Category is required.");
    if (!Number.isFinite(form.price) || form.price < 0)
      return setError("Price must be 0 or greater.");
    if (!Number.isInteger(form.stock) || form.stock < 0)
      return setError("Stock must be a whole number 0 or greater.");
    setSaving(true);
    setError("");
    try {
      if (product) {
        const result = await updateProduct(product.id, form);
        saveProductOverride(product.id, { ...result, ...form });
        router.push(`/products/${product.id}`);
      } else {
        const result = await addProduct(form);
        saveAddedProduct({
          ...result,
          ...form,
          rating: 0,
          images: form.thumbnail ? [form.thumbnail] : [],
        });
        router.push("/products");
      }
    } catch (e) {
      setError(getApiError(e));
      setSaving(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-lg border bg-white p-6"
    >
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}
      <Field
        label="Title"
        value={form.title}
        onChange={(v) => set("title", v)}
      />
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="min-h-28 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Price"
          type="number"
          value={form.price}
          onChange={(v) => set("price", Number(v))}
        />
        <Field
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(v) => set("stock", Number(v))}
        />
        <Field
          label="Thumbnail URL"
          value={form.thumbnail}
          onChange={(v) => set("thumbnail", v)}
        />
      </div>
      <button
        disabled={saving}
        className="rounded bg-slate-900 px-5 py-2.5 text-white"
      >
        {saving ? "Saving..." : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />
    </div>
  );
}
