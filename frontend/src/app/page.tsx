"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "admin@villasahrai.com" && password === "password") {
      document.cookie = "demo_auth=true; path=/";
      fetch("/api/notify-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Admin" }),
      }).catch(console.error);
      router.push("/dashboard");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Villa Sahrai"
            width={160}
            height={160}
            className="h-24 w-auto object-contain"
          />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl shadow-zinc-900/5 border border-zinc-200">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-zinc-900">Connexion</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Accédez à votre espace de gestion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@villasahrai.com"
                required
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-sahrai-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sahrai-800 transition-colors"
            >
              Se connecter
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Villa Sahrai — Casablanca
        </p>
      </div>
    </div>
  );
}
