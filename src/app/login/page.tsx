"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("Wrong password");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form className="card login" onSubmit={onSubmit}>
      <h1 className="brand">Daily log</h1>
      <p className="lede">Enter the app password to open today&apos;s tracker.</p>
      <input
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />
      {error ? <p className="crisis" style={{ padding: 8, borderRadius: 12 }}>{error}</p> : null}
      <button className="primary" type="submit">
        Open log
      </button>
    </form>
  );
}
