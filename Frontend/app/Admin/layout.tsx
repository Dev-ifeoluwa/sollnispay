"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminFetch, clearAdminToken, getAdminToken } from "./adminApi";

// Add a screen here as we build it
const NAV: { href: string; label: string; soon?: boolean }[] = [
    { href: "/Admin", label: "Overview" },
    { href: "/Admin/Transactions", label: "Transactions", soon: true },
    { href: "/Admin/Users", label: "Users", soon: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [admin, setAdmin] = useState<{ id: number; email: string } | null>(null);
    const isLogin = pathname === "/Admin/Login";

    useEffect(() => {
        if (isLogin) return;
        if (!getAdminToken()) {
            router.replace("/Admin/Login");
            return;
        }
        adminFetch("/admin/me")
            .then(async (res) => {
                if (res.ok) setAdmin(await res.json());
            })
            .catch(() => router.replace("/Admin/Login"));
    }, [isLogin]);

    const logout = () => {
        clearAdminToken();
        setAdmin(null);
        router.replace("/Admin/Login");
    };

    // the login page has no sidebar
    if (isLogin) return <>{children}</>;

    if (!admin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0e0704] text-sm text-[#8f7768]">
                Checking access...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <aside className="md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.08] bg-[#150a06] p-4 md:p-5">
                <h2 className="font-serif italic text-lg text-[#fbf3ec]">Sollnis Admin</h2>
                <nav className="mt-4 flex md:flex-col gap-2 overflow-x-auto">
                    {NAV.map((n) =>
                        n.soon ? (
                            <span
                                key={n.href}
                                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-[#8f7768]/60 cursor-not-allowed"
                            >
                                {n.label} <span className="text-[10px]">soon</span>
                            </span>
                        ) : (
                            <Link
                                key={n.href}
                                href={n.href}
                                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                                    pathname === n.href
                                        ? "bg-[#ff7a3d]/15 text-[#ff7a3d]"
                                        : "text-[#d8c3b6] hover:text-white"
                                }`}
                            >
                                {n.label}
                            </Link>
                        )
                    )}
                </nav>
                <div className="mt-4 md:mt-8 text-xs text-[#8f7768] break-all">{admin.email}</div>
                <button onClick={logout} className="mt-2 text-sm font-semibold text-[#ff7a3d]">
                    Sign out
                </button>
            </aside>

            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10">{children}</main>
        </div>
    );
}