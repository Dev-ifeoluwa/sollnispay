"use client";
import AccountProductCard from "components/UserDashboardCompo/AccountProductCard";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, Plus, Copy, Check, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Preloader from "components/preloader";

export default function UserDashboard() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<any>(null);
    const [showBalance, setShowBalance] = useState(false);
    const [copied, setCopied] = useState(false);
    const [range, setRange] = useState<"7d" | "30d">("7d");
    const toggleBalance = () => setShowBalance(!showBalance);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, redirecting to signin.");
            router.push('/Account/Signin');
            return;
        }

        const fetchDashboard = async () => {
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
        }
        fetchDashboard();
    }, []);

    const copyAccountNumber = () => {
        if (!dashboard?.accountNumber) return;
        navigator.clipboard.writeText(dashboard.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

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

                        {/* Balance card + quick promo (responsive grid) */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                            <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#301a10] to-[#26140c] px-5 py-6 sm:px-8 sm:py-8">
                                {/* ambient glow */}
                                <div className="pointer-events-none absolute -top-24 -left-16 w-64 h-64 rounded-full bg-[#ff7a3d]/20 blur-2xl" />

                                <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-[#8f7768] mb-1.5">Account number</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm sm:text-base tracking-[0.2em] font-semibold text-[#d8c3b6]">
                                                •••• •••• {dashboard.accountNumber?.toString().slice(-2)}
                                            </span>
                                            <button
                                                onClick={copyAccountNumber}
                                                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
                                            >
                                                {copied ? <Check size={13} /> : <Copy size={13} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-full p-1 self-start">
                                        <select
                                            defaultValue="NGN"
                                            className="appearance-none bg-transparent text-xs sm:text-sm font-bold text-[#fbf3ec] px-3 py-1.5 rounded-full outline-none cursor-pointer"
                                        >
                                            <option className="text-black" value="NGN">₦ NGN</option>
                                            <option className="text-black" value="USD">$ USD</option>
                                            <option className="text-black" value="GBP">£ GBP</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="relative flex items-baseline gap-2 mt-6 sm:mt-8">
                                    <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#f4b860] font-medium">₦</span>
                                    <span
                                        className={`font-serif text-3xl sm:text-4xl lg:text-5xl text-[#fbf3ec] font-semibold tracking-tight ${showBalance ? "blur-[6px] select-none" : ""
                                            }`}
                                    >
                                        {dashboard.balance.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={toggleBalance}
                                        className="ml-auto flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
                                    >
                                        {showBalance ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                    </button>
                                </div>
                                <p className="relative text-xs sm:text-sm text-[#8f7768] mt-1">Available balance</p>

                                <div className="relative flex gap-3 mt-6 sm:mt-8">
                                    <Link
                                        href={"/User/Deposit"}
                                        className="flex-1 sm:flex-none sm:px-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                                    >
                                        <Plus size={16} />
                                        Fund wallet
                                    </Link>
                                    <button className="flex-1 sm:flex-none sm:px-8 rounded-xl px-4 py-3 font-bold text-sm text-[#fbf3ec] border border-white/[0.1]">
                                        Send
                                    </button>
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

                            {dashboard.transactions.length === 0 ? (
                                <p className="text-[#8f7768] text-sm my-5 text-center py-10">
                                    No transactions made yet.
                                </p>
                            ) : (
                                <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] divide-y divide-white/[0.06] overflow-hidden">
                                    {dashboard.transactions.map((tx: any) => {
                                        const isCredit = typeof tx.amount === "string"
                                            ? tx.amount.trim().startsWith("+")
                                            : Number(tx.amount) >= 0;
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
                                                        <p className="text-sm font-semibold text-[#fbf3ec] truncate">
                                                            {tx.itemsPurchase}
                                                        </p>
                                                        <div className="flex flex-wrap gap-x-1.5 text-[11px] sm:text-xs text-[#8f7768]">
                                                            <span>{tx.description}</span>
                                                            <span>{tx.DayPurchased}</span>
                                                            <span>{tx.itemsTime}</span>
                                                        </div>
                                                    </div>
                                                    <p className={`text-sm sm:text-base font-bold flex-shrink-0 ${isCredit ? "text-[#f4b860]" : "text-[#fbf3ec]"
                                                        }`}>
                                                        {tx.amount}
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