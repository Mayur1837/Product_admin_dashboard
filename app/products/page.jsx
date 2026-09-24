"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCategories, getProducts, deleteProduct } from "../../lib/products";
import { getApiError } from "../../lib/api";
import { mergeLocalProducts, markDeleted } from "../../lib/localProducts";
import { ProductTable } from "../../components/ProductTable";
import { Pagination } from "../../components/Pagination";
import { Spinner } from "../../components/Spinner";
import { EmptyState } from "../../components/EmptyState";
import { ErrorState } from "../../components/ErrorState";
function int(v, f, min) {
  const n = Number(v);
  return Number.isInteger(n) && n >= min ? n : f;
}
export default function Products() {
  const router = useRouter(),
    pathname = usePathname(),
    params = useSearchParams();
  const page = int(params.get("page"), 1, 1),
    pageSize = [10, 20, 50].includes(int(params.get("pageSize"), 10, 1))
      ? int(params.get("pageSize"), 10, 1)
      : 10,
    search = params.get("search") || "",
    category = params.get("category") || "",
    sort = ["price", "rating", "title"].includes(params.get("sort"))
      ? params.get("sort")
      : "",
    order = params.get("order") === "desc" ? "desc" : "asc";
  const [query, setQuery] = useState(search),
    [products, setProducts] = useState([]),
    [total, setTotal] = useState(0),
    [categories, setCategories] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0);
  useEffect(() => setQuery(search), [search]);
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (query === search) return;
    const t = setTimeout(() => {
      const p = new URLSearchParams(params.toString());
      query.trim() ? p.set("search", query.trim()) : p.delete("search");
      p.set("page", "1");
      router.replace(`${pathname}?${p}`);
    }, 450);
    return () => clearTimeout(t);
  }, [query, search, params, pathname, router]);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const combined = Boolean(search && category);
        const data = await getProducts({
          limit: combined ? 0 : pageSize,
          skip: combined ? 0 : (page - 1) * pageSize,
          search,
          category,
          sortBy: sort || undefined,
          order,
          signal: controller.signal,
        });
        if (!active) return;
        let list = mergeLocalProducts(data.products);
        if (combined) list = list.filter((p) => p.category === category);
        if (sort)
          list.sort((a, b) => {
            const av = sort === "title" ? a.title.toLowerCase() : a[sort],
              bv = sort === "title" ? b.title.toLowerCase() : b[sort];
            return av === bv
              ? 0
              : av < bv
                ? order === "asc"
                  ? -1
                  : 1
                : order === "asc"
                  ? 1
                  : -1;
          });
        const count = combined ? list.length : data.total;
        if (combined) list = list.slice((page - 1) * pageSize, page * pageSize);
        const pages = Math.max(1, Math.ceil(count / pageSize));
        if (page > pages) {
          const p = new URLSearchParams(params.toString());
          p.set("page", "1");
          router.replace(`${pathname}?${p}`);
          return;
        }
        setProducts(list);
        setTotal(count);
      } catch (e) {
        if (active && e?.code !== "ERR_CANCELED") setError(getApiError(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [page, pageSize, search, category, sort, order, reload]);
  const update = useCallback(
    (changes) => {
      const p = new URLSearchParams(params.toString());
      Object.entries(changes).forEach(([k, v]) =>
        v ? p.set(k, v) : p.delete(k),
      );
      router.push(`${pathname}?${p}`);
    },
    [params, router, pathname],
  );
  async function remove(id) {
    if (
      !confirm(
        "Delete this product? The API does not persist deletes; this app will keep the deletion locally.",
      )
    )
      return;
    try {
      await deleteProduct(id);
      markDeleted(id);
      setReload((x) => x + 1);
    } catch (e) {
      setError(getApiError(e));
    }
  }
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-slate-500">Manage your product catalog.</p>
        </div>
        <button
          onClick={() => router.push("/products/new")}
          className="rounded bg-slate-900 px-4 py-2.5 text-white"
        >
          + Add product
        </button>
      </div>
      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_220px_180px_140px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="rounded border px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) =>
            update({ category: e.target.value || null, page: "1" })
          }
          className="rounded border px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sort ? `${sort}:${order}` : ""}
          onChange={(e) => {
            const [s, o] = e.target.value.split(":");
            update({ sort: s || null, order: s ? o : null, page: "1" });
          }}
          className="rounded border px-3 py-2"
        >
          <option value="">Sort by...</option>
          <option value="price:asc">Price ↑</option>
          <option value="price:desc">Price ↓</option>
          <option value="rating:desc">Rating ↓</option>
          <option value="rating:asc">Rating ↑</option>
          <option value="title:asc">Title A–Z</option>
          <option value="title:desc">Title Z–A</option>
        </select>
        <button
          onClick={() =>
            update({
              search: null,
              category: null,
              sort: null,
              order: null,
              page: "1",
            })
          }
          className="rounded border px-3 py-2"
        >
          Clear
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReload((x) => x + 1)} />
      ) : products.length === 0 ? (
        <EmptyState text="No products match your filters." />
      ) : (
        <>
          <ProductTable products={products} onDelete={remove} />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPage={(p) => update({ page: String(p) })}
            onPageSize={(n) => update({ pageSize: String(n), page: "1" })}
          />
        </>
      )}
    </section>
  );
}
