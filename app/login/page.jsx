"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";
import { getApiError } from "../../lib/api";
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys"),
    [password, setPassword] = useState("emilyspass"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const data = await login(username, password);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));
      router.replace("/products");
    } catch (e) {
      setError(getApiError(e));
      setBusy(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-5 rounded-xl border bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold">Product Admin</h1>
          <p className="text-sm text-slate-500">Sign in to manage products.</p>
        </div>
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <button
          disabled={busy}
          className="w-full rounded bg-slate-900 px-4 py-2.5 text-white"
        >
          {busy ? "Signing in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
