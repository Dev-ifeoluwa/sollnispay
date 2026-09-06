"use client"
import { EyeIcon, Plus, StampIcon } from "lucide-react";
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
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div className="lg:col-span-5 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#301a10] to-[#26140c] px-5 py-6 sm:px-8 sm:py-8">
                        {/* ambient glow */}
                        <div className="pointer-events-none absolute -top-24 -left-16 w-64 h-64 rounded-full bg-[#ff7a3d]/20 blur-2xl" />

                        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold text-[#8f7768] mb-1.5">Account number</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm sm:text-base tracking-[0.2em] font-semibold text-[#d8c3b6]">
                                        •••• •••• •••• ••••
                                    </span>
                                    <div></div>
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
                                className={`font-serif text-3xl sm:text-4xl lg:text-5xl text-[#fbf3ec] font-semibold tracking-tight "" ? "blur-[6px] select-none" : ""
                                    }`}
                            >
                                *****
                            </span>
                        </div>
                        <p className="relative text-xs sm:text-sm text-[#8f7768] mt-1">Available balance</p>

                        <div className="relative flex gap-3 mt-6 sm:mt-8">
                            <button
                                onClick={handleClick}
                                className="flex-1 sm:flex-none cursor-pointer sm:px-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                            >
                                <Plus size={16} />
                                Fund wallet
                            </button>
                            <button 
                                onClick={handleClick}
                                className="flex-1 sm:flex-none cursor-pointer sm:px-8 rounded-xl px-4 py-3 font-bold text-sm text-[#fbf3ec] border border-white/[0.1]">

                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




