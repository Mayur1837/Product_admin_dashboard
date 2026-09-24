"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";
export function Protected({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) router.replace("/login");
    else setReady(true);
  }, [router]);
  return ready ? children : <Spinner />;
}
