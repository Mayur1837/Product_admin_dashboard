import Image from "next/image";
import Link from "next/link";
export function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="bg-slate-100">
          <tr>
            {["Product", "Category", "Price", "Rating", "Stock", "Actions"].map(
              (x) => (
                <th key={x} className="p-3">
                  {x}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                <Link
                  href={`/products/${p.id}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <Image
                    src={p.thumbnail}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <span className="font-medium">{p.title}</span>
                </Link>
              </td>
              <td className="p-3">{p.category}</td>
              <td className="p-3">${Number(p.price).toFixed(2)}</td>
              <td className="p-3">★ {Number(p.rating).toFixed(1)}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <Link
                  href={`/products/${p.id}/edit`}
                  className="mr-3 text-blue-600"
                >
                  Edit
                </Link>
                <button onClick={() => onDelete(p.id)} className="text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 p-3 md:hidden">
        {products.map((p) => (
          <article key={p.id} className="rounded-lg border p-3">
            <Link href={`/products/${p.id}`} className="flex gap-3">
              <Image
                src={p.thumbnail}
                alt=""
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.category}</p>
                <p className="mt-1">
                  ${Number(p.price).toFixed(2)} · ★{" "}
                  {Number(p.rating).toFixed(1)} · Stock {p.stock}
                </p>
              </div>
            </Link>
            <div className="mt-3">
              <Link
                href={`/products/${p.id}/edit`}
                className="mr-4 text-blue-600"
              >
                Edit
              </Link>
              <button onClick={() => onDelete(p.id)} className="text-red-600">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
