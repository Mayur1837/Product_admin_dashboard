import { Header } from "../../components/Header";
import { Protected } from "../../components/Protected";
export default function ProductsLayout({ children }) {
  return (
    <Protected>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </Protected>
  );
}
