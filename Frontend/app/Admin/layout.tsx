"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    ArrowLeftRight,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    Plug,
    ScrollText,
    Settings,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminFetch, clearAdminToken, getAdminToken } from "./adminApi";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; soon?: boolean };

// Add a screen here as we build it (remove `soon` once the page exists)
const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
    {
        title: "Main",
        items: [
            { href: "/Admin", label: "Overview", icon: LayoutDashboard, exact: true },
            { href: "/Admin/Transactions", label: "Transactions", icon: ArrowLeftRight },
            { href: "/Admin/Users", label: "Customers", icon: Users, soon: true },
        ],
    },
    {
        title: "Operations",
        items: [
            { href: "/Admin/Services", label: "Services and pricing", icon: Layers, soon: true },
            { href: "/Admin/Providers", label: "Providers", icon: Plug, soon: true },
        ],
    },
    {
        title: "System",
        items: [
            { href: "/Admin/Audit", label: "Audit log", icon: ScrollText, soon: true },
            { href: "/Admin/Settings", label: "Settings", icon: Settings, soon: true },
        ],
    },
];

const isActive = (pathname: string, n: NavItem) =>
    n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(`${n.href}/`);

function Sidebar({
    pathname,
    email,
    onNavigate,
    onLogout,
}: {
    pathname: string;
    email: string;
    onNavigate?: () => void;
    onLogout: () => void;
}) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-5 py-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-white">
                    <ShieldCheck size={18} />
                </span>
                <div>
                    <p className="font-serif italic text-base leading-tight text-[#fbf3ec]">Sollnis Admin</p>
                    <p className="text-xs text-[#8f7768]">Staff console</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin navigation">
                {NAV_GROUPS.map((group) => (
                    <div key={group.title} className="mt-4 first:mt-1">
                        <p className="px-3 pb-1.5 text-xs text-[#8f7768]">{group.title}</p>
                        <ul className="space-y-0.5">
                            {group.items.map((n) => {
                                const Icon = n.icon;
                                if (n.soon) {
                                    return (
                                        <li key={n.href}>
                                            <span
                                                aria-disabled="true"
                                                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#8f7768]/60"
                                            >
                                                <Icon size={17} />
                                                <span className="flex-1">{n.label}</span>
                                                <span className="rounded-full border border-white/10 px-1.5 text-[10px]">Soon</span>
                                            </span>
                                        </li>
                                    );
                                }
                                const active = isActive(pathname, n);
                                return (
                                    <li key={n.href}>
                                        <Link
                                            href={n.href}
                                            onClick={onNavigate}
                                            aria-current={active ? "page" : undefined}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a3d] ${
                                                active
                                                    ? "bg-[#ff7a3d]/15 text-[#ff7a3d]"
                                                    : "text-[#d8c3b6] hover:bg-white/[0.04] hover:text-white"
                                            }`}
                                        >
                                            <Icon size={17} />
                                            {n.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/[0.08] p-4">
                <p className="truncate text-xs text-[#8f7768]" title={email}>
                    {email}
                </p>
                <button
                    onClick={onLogout}
                    className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#ff7a3d] hover:text-[#ff9a5c]"
                >
                    <LogOut size={15} />
                    Sign out
                </button>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [admin, setAdmin] = useState<{ id: number; email: string } | null>(null);
    const [authError, setAuthError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const isLogin = pathname === "/Admin/Login";

    useEffect(() => {
        if (isLogin) return;
        if (!getAdminToken()) {
            router.replace("/Admin/Login");
            return;
        }
        setAuthError(false);
        adminFetch("/admin/me")
            .then(async (res) => {
                if (res.ok) setAdmin(await res.json());
                // a 401 is handled inside adminFetch (token cleared, sent to login)
                else if (res.status !== 401) setAuthError(true);
            })
            .catch(() => setAuthError(true));
    }, [isLogin, attempt]);

    // close the mobile menu when the page changes, and on Escape
    useEffect(() => setMenuOpen(false), [pathname]);
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    const logout = () => {
        clearAdminToken();
        setAdmin(null);
        router.replace("/Admin/Login");
    };

    // the login page has no sidebar
    if (isLogin) return <>{children}</>;

    if (authError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0e0704] px-4 text-center">
                <p className="text-sm text-[#d8c3b6]">Can&apos;t reach the server right now.</p>
                <div className="flex gap-4 text-sm font-semibold">
                    <button onClick={() => setAttempt((n) => n + 1)} className="text-[#ff7a3d]">
                        Try again
                    </button>
                    <button onClick={logout} className="text-[#8f7768]">
                        Go to sign in
                    </button>
                </div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0e0704] text-sm text-[#8f7768]">
                Checking access...
            </div>
        );
    }

    const current = NAV_GROUPS.flatMap((g) => g.items).find((n) => !n.soon && isActive(pathname, n));

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)] md:flex">
            {/* desktop sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-white/[0.08] bg-[#150a06] md:sticky md:top-0 md:block md:h-screen">
                <Sidebar pathname={pathname} email={admin.email} onLogout={logout} />
            </aside>

            {/* mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} aria-hidden />
                    <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-white/[0.08] bg-[#150a06]">
                        <button
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                            className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.07] text-[#d8c3b6]"
                        >
                            <X size={16} />
                        </button>
                        <Sidebar
                            pathname={pathname}
                            email={admin.email}
                            onNavigate={() => setMenuOpen(false)}
                            onLogout={logout}
                        />
                    </aside>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0e0704]/80 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.07] text-[#d8c3b6] md:hidden"
                        >
                            <Menu size={18} />
                        </button>
                        <p className="text-sm font-semibold text-[#fbf3ec]">{current?.label ?? "Admin"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden max-w-[16rem] truncate text-xs text-[#8f7768] sm:block">{admin.email}</span>
                        <span
                            aria-hidden
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-sm font-bold text-white"
                        >
                            {admin.email.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}