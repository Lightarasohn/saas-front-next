"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mesaj, setMesaj] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMesaj("");
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, password}),
            });
            const body = await res.json();
            if (body.isSuccess) {
                router.replace("/dashboard");
            } else {
                setMesaj(body.message);
            }
        } catch {
            setMesaj("Sunucuya ulaşılamadı. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-gray-900">Giriş Yap</h1>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">E-posta</span>
                    <input
                        type="email"
                        autoComplete="email"
                        className="rounded border border-gray-300 px-3 py-2 text-gray-900
                                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setMesaj(""); }}
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-700">Parola</span>
                    <input
                        type="password"
                        autoComplete="current-password"
                        className="rounded border border-gray-300 px-3 py-2 text-gray-900
                                   focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setMesaj(""); }}
                    />
                </label>
                <Link className="text-xs max-w-fit hover:text-blue-300" href="/forgot-password">Parolamı Unuttum</Link>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded bg-blue-600 px-4 py-2 font-medium text-white
                               hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {isSubmitting ? "Giriş yapılıyor..." : "Giriş"}
                </button>

                {mesaj ? (
                    <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{mesaj}</p>
                ) : null}
            </div>
        </form>
    );
};

export default LoginForm;