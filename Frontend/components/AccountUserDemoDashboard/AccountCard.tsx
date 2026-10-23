"use client"
import { EyeIcon, Plus, Send, StampIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function AccountCard() {

    const router = useRouter()
    const handleClick = () => {
        router.push("/Account/Signin")
    }

    return (
        <div>
            <div className="pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-[80px]" />
            <div className="z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex gap-3 text-lg items-center">
                        <p className="text-lg md:text-2xl text-white font-semibold">Hi</p>
                        <button 
                            onClick={handleClick}
                            className="py-1 px-3 text-sm font-semibold text-gray-50 shadow-sm cursor-pointer shadow-white rounded-full">Login
                        </button>
                    </div>
                    <div className="items-center">
                        <h2 className="hidden sm:block text-base sm:text-lg lg:text-xl font-semibold text-[#fbf3ec]">
                            Sollnispay
                        </h2>
                    </div>
                </div>

                {/* Balance card + quick promo (responsive grid) */}
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
                                            className={`font-serif text-3xl sm:text-4xl lg:text-5xl text-[#fbf3ec] font-semibold tracking-tight "" ? "blur-[6px] select-none" : ""
                                                }`}
                                        >
                                            *****
                                        </span>

                                        {/* <button
                                            onClick={toggleBalance}
                                            className="ml-2 mb-1 flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 text-[#d8c3b6] hover:text-white transition"
                                        >
                                            {showBalance ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                        </button> */}

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
                                    {/* <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f7768]">Wallet holder</p>
                                        <p className="text-sm sm:text-base font-semibold capitalize tracking-wider text-[#fbf3ec]">
                                            {dashboard.firstName} {dashboard.lastName}
                                        </p>
                                    </div> */}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleClick}
                                            className="flex-1 cursor-pointer sm:flex-none sm:px-7 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                                        >
                                            <Plus size={16} />
                                            Fund wallet

                                        </button>
                                        <button
                                            onClick={handleClick}
                                            className="flex-1 cursor-pointer sm:flex-none sm:px-7 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#fbf3ec] bg-white/[0.06] border border-white/15 backdrop-blur"
                                        >
                                            <Send size={15} />
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
        </div>
    )
}




