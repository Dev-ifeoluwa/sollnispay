"use client";
import AccountProductCard from "components/UserDashboardCompo/AccountProductCard";
import { useEffect, useState } from "react";
// import { EyeIcon, EyeOffIcon, Plus, Copy, Check, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { EyeIcon, EyeOffIcon, Plus, Send, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Preloader from "components/preloader";

// helpers: dates may be ISO strings or null
const fmtDate = (v?: string | null) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
};
const fmtTime = (v?: string | null) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function UserDashboard() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<any>(null);
    // FIX 2: hidden by default. The balance is blurred while showBalance is false.
    // (set useState(true) if you'd rather it start visible)
    const [showBalance, setShowBalance] = useState(false);
    const [range, setRange] = useState<"7d" | "30d">("7d");
    const toggleBalance = () => setShowBalance(!showBalance);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const loadDashboard = async (token: string) => {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
        })
        if (res.ok) {
            const data = await res.json();
            setDashboard(data.dashboard);
        } else if (res.status === 401) {
            console.error("Unauthorized, redirecting to signin.");
            router.push('/Account/Signin');
        } else {
            console.error("Failed to fetch dashboard data.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, redirecting to signin.");
            router.push('/Account/Signin');
            return;
        }

        loadDashboard(token);
    }, []);

    // FIX 4: the 7 / 30 day toggle now filters the list
    const rangeDays = range === "7d" ? 7 : 30;
    const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
    const visibleTransactions: any[] = (dashboard?.transactions ?? []).filter(
        (tx: any) => new Date(tx.createdAt).getTime() >= cutoff
    );

    return (
        <>
            {!dashboard ? (
                <div>
                    <Preloader />
                </div>
            ) : (
                <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
                    <div className="pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-[80px]" />
                    <div className="z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <div>
                                <p className="text-xs sm:text-sm text-[#8f7768] font-medium">Welcome</p>
                                <p className="text-lg sm:text-2xl lg:text-3xl text-[#fbf3ec] font-semibold italic font-serif">
                                    {dashboard.firstName}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <h2 className="hidden sm:block text-base sm:text-lg lg:text-xl font-semibold text-[#fbf3ec]">
                                    Sollnispay
                                </h2>
                                <Link
                                    href={"/User/Profile"}
                                    className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 text-sm font-bold text-white rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] border-2 border-white/15 shadow-lg shadow-orange-900/30"
                                >
                                    {`${dashboard.firstName?.[0] ?? "U"}${dashboard.lastName?.[0] ?? ""}`}
                                </Link>
                            </div>
                        </div>

                        {/* Balance card */}
                        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#5a2a14] via-[#301a10] to-[#150a06] p-5 sm:p-8 shadow-2xl shadow-black/40">

                            {/* ── decorative layer ── */}
                            {/* dotted texture */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                                style={{
                                    backgroundImage: "radial-gradient(#ffb27a 1px, transparent 1px)",
                                    backgroundSize: "18px 18px",
                                }}
                            />
                            {/* glow orbs */}
                            <div className="pointer-events-none absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-[#ff7a3d]/25 blur-3xl" />
                            <div className="pointer-events-none absolute -top-20 right-10 w-52 h-52 rounded-full bg-[#f4b860]/15 blur-3xl" />
                            {/* concentric rings */}
                            <svg
                                className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 sm:w-[26rem] sm:h-[26rem]"
                                viewBox="0 0 400 400"
                                fill="none"
                            >
                                <circle cx="200" cy="200" r="60" stroke="#ff7a3d" strokeOpacity="0.45" />
                                <circle cx="200" cy="200" r="100" stroke="#ff7a3d" strokeOpacity="0.32" />
                                <circle cx="200" cy="200" r="140" stroke="#ff7a3d" strokeOpacity="0.22" />
                                <circle cx="200" cy="200" r="180" stroke="#ff7a3d" strokeOpacity="0.14" />
                                <circle cx="200" cy="200" r="20" fill="#ff7a3d" fillOpacity="0.35" />
                            </svg>
                            {/* diagonal shine */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent" />

                            {/* ── content ── */}
                            <div className="relative flex flex-col gap-6 sm:gap-8">

                                {/* top row: brand + contactless */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-[#fbf3ec]">
                                            ₦ NGN
                                        </span>
                                    </div>
                                </div>

                                {/* chip + balance + sparkline */}
                                <div>
                                    <div className="flex items-center gap-4 mb-5">
                                        <p className="text-xs sm:text-sm text-[#b89a88]">Available balance</p>
                                    </div>

                                    <div className="flex items-end gap-2">
                                        <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#f4b860] font-medium pb-1">₦</span>
                                        <span
                                            className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-[#fbf3ec] font-semibold tracking-tight transition ${!showBalance ? "blur-[8px] select-none" : ""
                                                }`}
                                        >
                                            {dashboard.balance.toFixed(2)}
                                        </span>

                                        <button
                                            onClick={toggleBalance}
                                            className="ml-2 mb-1 flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 text-[#d8c3b6] hover:text-white transition"
                                        >
                                            {showBalance ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                        </button>

                                        {/* mini trend line */}
                                        <svg
                                            className="hidden sm:block ml-auto w-32 h-12"
                                            viewBox="0 0 120 40"
                                            fill="none"
                                        >
                                            <defs>
                                                <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#ff7a3d" stopOpacity="0.35" />
                                                    <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0 32 L18 26 L34 29 L52 16 L70 21 L88 9 L120 4 L120 40 L0 40 Z" fill="url(#spark)" />
                                            <path d="M0 32 L18 26 L34 29 L52 16 L70 21 L88 9 L120 4" stroke="#ff9a5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="120" cy="4" r="3" fill="#f4b860" />
                                        </svg>
                                    </div>
                                </div>

                                {/* bottom row: holder + actions */}
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f7768]">Wallet holder</p>
                                        <p className="text-sm sm:text-base font-semibold capitalize tracking-wider text-[#fbf3ec]">
                                            {dashboard.firstName} {dashboard.lastName}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Link
                                            href={"/User/Deposit"}
                                            className="flex-1 sm:flex-none sm:px-7 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                                        >
                                            <Plus size={16} />
                                            Fund wallet
                                        </Link>
                                        <button className="flex-1 sm:flex-none sm:px-7 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#fbf3ec] bg-white/[0.06] border border-white/15 backdrop-blur">
                                            <Send size={15} />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>




                        {/* Quick actions (existing component, restyled wrapper) */}
                        <div className="mt-6 sm:mt-8">
                            <AccountProductCard />
                        </div>

                        {/* Recent transactions */}
                        <div className="mt-8 sm:mt-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
                                    Recent activity
                                </h4>
                                <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-full p-1">
                                    <button
                                        onClick={() => setRange("7d")}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${range === "7d" ? "bg-[#ff7a3d] text-[#1a0d05]" : "text-[#8f7768]"
                                            }`}
                                    >
                                        7 days
                                    </button>
                                    <button
                                        onClick={() => setRange("30d")}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${range === "30d" ? "bg-[#ff7a3d] text-[#1a0d05]" : "text-[#8f7768]"
                                            }`}
                                    >
                                        30 days
                                    </button>
                                </div>
                            </div>

                            {visibleTransactions.length === 0 ? (
                                <p className="text-[#8f7768] text-sm my-5 text-center py-10">
                                    No transactions in the last {rangeDays} days.
                                </p>
                            ) : (
                                <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] divide-y divide-white/[0.06] overflow-hidden">
                                    {visibleTransactions.map((tx: any) => {
                                        // FIX 3: wallet funding is money in, everything else is money out
                                        const isCredit = tx.type === "WALLET_FUNDING";
                                        const amountText = `${isCredit ? "+" : "-"}₦${Number(tx.amount).toLocaleString("en-NG", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}`;
                                        return (
                                            <div
                                                key={tx.id}
                                                className="flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4"
                                            >
                                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#26140c] border border-white/[0.08] text-[#ff7a3d]">
                                                    {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                                                    <div className="min-w-0">
                                                        {/* FIX 1: field names now match the API (itemsPurchased, dayPurchased) */}
                                                        <p className="text-sm font-semibold text-[#fbf3ec] truncate">
                                                            {tx.itemsPurchased}
                                                        </p>
                                                        <div className="flex flex-wrap gap-x-1.5 text-[11px] sm:text-xs text-[#8f7768]">
                                                            <span>{tx.description}</span>
                                                            <span>{fmtDate(tx.dayPurchased ?? tx.createdAt)}</span>
                                                            <span>{fmtTime(tx.itemsTime ?? tx.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm sm:text-base font-bold flex-shrink-0 ${isCredit ? "text-[#f4b860]" : "text-[#fbf3ec]"
                                                        }`}>
                                                        {amountText}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
