"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "../../../lib/products";
import { getApiError } from "../../../lib/api";
import { getLocalProduct } from "../../../lib/localProducts";
import { Spinner } from "../../../components/Spinner";
import { ErrorState } from "../../../components/ErrorState";
export default function Detail() {
  const { id: raw } = useParams(),
    router = useRouter(),
    id = Number(raw);
  const [product, setProduct] = useState(null),
    [status, setStatus] = useState("loading"),
    [error, setError] = useState("");
  useEffect(() => {
    if (!Number.isInteger(id) || id < 1) {
      setStatus("notfound");
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const local = getLocalProduct(id);
        if (local) {
          setProduct(local);
          setStatus("ready");
          return;
        }
        setProduct(await getProduct(id, controller.signal));
        setStatus("ready");
      } catch (e) {
        if (e?.code === "ERR_CANCELED") return;
        if (e?.response?.status === 404) setStatus("notfound");
        else {
          setError(getApiError(e));
          setStatus("error");
        }
      }
    })();
    return () => controller.abort();
  }, [id]);
  if (status === "loading") return <Spinner />;
  if (status === "notfound")
    return (
      <div className="rounded border bg-white p-10 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 rounded bg-slate-900 px-4 py-2 text-white"
        >
          Back to products
        </button>
      </div>
    );
  if (status === "error")
    return <ErrorState message={error} onRetry={() => location.reload()} />;
  if (!product) return null;
  return (
    <article className="space-y-6">
      <div className="flex justify-between">
        <Link href="/products" className="text-blue-600">
          ← Products
        </Link>
        <Link
          href={`/products/${product.id}/edit`}
          className="rounded border px-3 py-2"
        >
          Edit
        </Link>
      </div>
      <div className="grid gap-6 rounded border bg-white p-6 md:grid-cols-2">
        <div>
          <Image
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            width={700}
            height={500}
            className="w-full rounded object-cover"
          />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(product.images || [product.thumbnail]).slice(0, 4).map((img) => (
              <Image
                key={img}
                src={img}
                alt=""
                width={120}
                height={80}
                className="h-20 w-full rounded object-cover"
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-500">{product.category}</p>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="mt-4 text-slate-600">{product.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat
              label="Price"
              value={`$${Number(product.price).toFixed(2)}`}
            />
            <Stat
              label="Rating"
              value={`★ ${Number(product.rating).toFixed(1)}`}
            />
            <Stat label="Stock" value={product.stock} />
          </div>
        </div>
      </div>
      <section className="rounded border bg-white p-6">
        <h2 className="text-xl font-bold">Reviews</h2>
        {product.reviews?.length ? (
          product.reviews.map((r, i) => (
            <div key={`${r.reviewerEmail}-${i}`} className="border-t py-4">
              <div className="flex justify-between">
                <strong>{r.reviewerName}</strong>
                <span>★ {r.rating}</span>
              </div>
              <p className="mt-1 text-slate-600">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="mt-3 text-slate-500">No reviews.</p>
        )}
      </section>
    </article>
  );
}
function Stat({ label, value }) {
  return (
    <div className="rounded bg-slate-50 p-3">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
