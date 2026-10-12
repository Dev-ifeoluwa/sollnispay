"use client";
// app/Admin/Dashboard/page.tsx  ->  /Admin/Dashboard
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Wallet, Users, Receipt, TrendingUp, Banknote, Activity } from "lucide-react";
import Preloader from "components/preloader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const naira = (n: number | null | undefined) =>
    n == null ? "Unavailable" : `₦${Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Range = "today" | "days60" | "allTime";
const RANGES: { id: Range; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "days60", label: "60 days" },
    { id: "allTime", label: "All time" },
];

const STATUS_STYLE: Record<string, string> = {
    SUCCESS: "text-[#7ddc9a] bg-[#7ddc9a]/10",
    PENDING: "text-[#f4b860] bg-[#f4b860]/10",
    FAILED: "text-[#e8563a] bg-[#e8563a]/10",
};

function StatCard({ icon: Icon, label, value, note }: { icon: any; label: string; value: string; note?: string }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] p-5">
            <div className="flex items-center gap-2.5 text-[#8f7768]">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#ff7a3d]/15 text-[#ff7a3d]">
                    <Icon size={16} />
                </span>
                <p className="text-xs font-semibold">{label}</p>
            </div>
            <p className="mt-4 font-serif text-2xl sm:text-3xl text-[#fbf3ec] font-semibold tracking-tight">{value}</p>
            {note && <p className="mt-1 text-[11.5px] text-[#8f7768]">{note}</p>}
        </div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [range, setRange] = useState<Range>("today");
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const load = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/Account/Signin");
        setRefreshing(true);
        try {
            const res = await fetch(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
            });
            if (res.status === 401) return router.push("/Account/Signin");
            if (res.status === 403) return router.push("/UserDashboard");
            if (!res.ok) throw new Error();
            setStats(await res.json());
            setError("");
        } catch {
            setError("Couldn't refresh. Showing the last data we have.");
        } finally {
            setRefreshing(false);
        }
    }, [router]);

    // Load once, then refresh every 30 seconds so you can watch it live.
    useEffect(() => {
        load();
        const id = setInterval(load, 30_000);
        return () => clearInterval(id);
    }, [load]);

    if (!stats) return <Preloader />;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <div className="pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#ff7a3d]/20 blur-[80px]" />
            <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs sm:text-sm text-[#8f7768] font-medium">Sollnispay</p>
                        <h1 className="text-xl sm:text-3xl font-semibold italic font-serif text-[#fbf3ec]">Admin overview</h1>
                    </div>
                    <button
                        onClick={load}
                        className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-4 py-2 text-xs font-semibold text-[#d8c3b6] hover:text-white transition"
                    >
                        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                        {new Date(stats.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </button>
                </div>
                {error && <p className="mb-4 text-sm text-[#e8563a]">{error}</p>}

                {/* Profit: the number you watch */}
                <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#5a2a14] via-[#301a10] to-[#1a0d08] p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-[#d8c3b6]">My profit</p>
                        <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-full p-1">
                            {RANGES.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setRange(r.id)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                                        range === r.id ? "bg-[#ff7a3d] text-[#1a0d05]" : "text-[#8f7768]"
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="mt-4 font-serif text-4xl sm:text-6xl text-[#fbf3ec] font-semibold tracking-tight">
                        {naira(stats.profit[range])}
                    </p>
                    <p className="mt-2 text-xs text-[#b89a88]">Sales minus what Clubkonnect charged you, on successful orders only.</p>
                </div>

                {/* Stat cards */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard icon={Banknote} label="Total available balance" value={naira(stats.providerBalance)} note="Clubkonnect wallet, what you can still sell" />
                    <StatCard icon={Wallet} label="Customers' wallets" value={naira(stats.customersWallet)} note="Money you owe customers right now" />
                    <StatCard icon={Users} label="Total customers" value={stats.totalCustomers.toLocaleString()} />
                    <StatCard icon={Activity} label="Today's transactions" value={stats.transactionsToday.toLocaleString()} />
                    <StatCard icon={TrendingUp} label="Sales today" value={naira(stats.salesToday)} note="Since 12:00 AM" />
                    <StatCard icon={Receipt} label="Transactions (60 days)" value={stats.transactions60d.toLocaleString()} />
                </div>

                {/* Recent transactions */}
                <h2 className="mt-9 mb-3 text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">Latest transactions</h2>
                {stats.recent.length === 0 ? (
                    <p className="text-sm text-[#8f7768] text-center py-10">No transactions yet. They'll show up here as customers buy.</p>
                ) : (
                    <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="text-xs text-[#8f7768] border-b border-white/[0.06]">
                                    <th className="px-5 py-3 font-semibold">Customer</th>
                                    <th className="px-5 py-3 font-semibold">Item</th>
                                    <th className="px-5 py-3 font-semibold text-right">Amount</th>
                                    <th className="px-5 py-3 font-semibold text-right">Profit</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                                {stats.recent.map((t: any) => (
                                    <tr key={t.id} className="text-[#d8c3b6]">
                                        <td className="px-5 py-3.5 text-[#fbf3ec] font-semibold">{t.customer || "Unknown"}</td>
                                        <td className="px-5 py-3.5">{t.item}</td>
                                        <td className="px-5 py-3.5 text-right text-[#fbf3ec]">{naira(t.amount)}</td>
                                        <td className="px-5 py-3.5 text-right text-[#f4b860]">{naira(t.profit)}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[t.status] ?? "text-[#d8c3b6] bg-white/[0.06]"}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-[#8f7768] whitespace-nowrap">
                                            {new Date(t.createdAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="h-10" />
            </div>
        </div>
    );
}