"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_TOKEN_KEY, API_URL } from "../adminApi";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (res.status === 429) {
                setError("Too many attempts. Wait a minute and try again.");
                return;
            }
            if (!res.ok) {
                setError("Invalid email or password.");
                return;
            }
            const data = await res.json();
            localStorage.setItem(ADMIN_TOKEN_KEY, data.accessToken);
            router.replace("/Admin");
        } catch {
            setError("Can't reach the server. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const input =
        "w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-[#fbf3ec] placeholder:text-[#8f7768] outline-none focus:border-[#ff7a3d] focus:ring-2 focus:ring-[#ff7a3d]/30";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <form
                onSubmit={submit}
                className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#1e100a] p-6 sm:p-8"
            >
                <h1 className="font-serif italic text-2xl text-[#fbf3ec]">Admin sign in</h1>
                <p className="mt-1 text-sm text-[#8f7768]">Sollnispay staff only</p>

                <div className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="aemail" className="block text-xs text-[#8f7768] mb-1.5">Email</label>
                        <input
                            id="aemail"
                            type="email"
                            autoComplete="username"
                            className={input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="apass" className="block text-xs text-[#8f7768] mb-1.5">Password</label>
                        <input
                            id="apass"
                            type="password"
                            autoComplete="current-password"
                            className={input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl px-6 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40 disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>
            </form>
        </div>
    );
}