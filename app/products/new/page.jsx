import { ProductForm } from "../../../components/ProductForm";
export default function NewProduct() {
  return (
    <section className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Add product</h1>
        <p className="text-sm text-slate-500">
          Create a product in the demo catalog.
        </p>
      </div>
      <ProductForm />
    </section>
  );
}
