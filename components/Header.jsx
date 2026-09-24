"use client";
import { useRouter } from "next/navigation";
export function Header() {
  const router = useRouter();
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.replace("/login");
  }
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button className="font-bold" onClick={() => router.push("/products")}>
          Product Admin
        </button>
        <button
          onClick={logout}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
