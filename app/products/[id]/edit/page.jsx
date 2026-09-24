"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "../../../../lib/products";
import { getLocalProduct } from "../../../../lib/localProducts";
import { ProductForm } from "../../../../components/ProductForm";
import { Spinner } from "../../../../components/Spinner";
export default function Edit() {
  const { id: raw } = useParams(),
    id = Number(raw),
    [product, setProduct] = useState(null);
  useEffect(() => {
    if (!Number.isInteger(id)) return;
    const local = getLocalProduct(id);
    if (local) {
      setProduct(local);
      return;
    }
    getProduct(id)
      .then(setProduct)
      .catch(() => {});
  }, [id]);
  if (!product) return <Spinner />;
  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-bold">Edit product</h1>
      <p className="text-sm text-slate-500">
        Changes are kept in this browser for the assignment.
      </p>
      <ProductForm product={product} />
    </section>
  );
}
