import { ReactNode } from "react";

// CSS phone so the landing page needs no extra images.
// Later you can swap WalletScreen for a real screenshot of the app.
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={`relative w-[260px] shrink-0 rounded-[2.6rem] border-[6px] border-[#3a2418] bg-[#120a06] p-3 shadow-2xl shadow-black/50 ${className}`}
        >
            <div className="mx-auto mb-3 h-5 w-20 rounded-full bg-black" />
            {children}
        </div>
    );
}

const services = ["Airtime", "Data", "TV", "Gifts"];
const recent = [
    { name: "MTN airtime", amount: "-₦2,000" },
    { name: "Wallet funded", amount: "+₦10,000" },
];

export function WalletScreen() {
    return (
        <div className="space-y-3 pb-3">
            <div>
                <p className="text-[10px] text-[#8f7768]">Welcome back</p>
                <p className="font-serif text-base italic text-[#fbf3ec]">Adaeze</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#5a2a14] via-[#301a10] to-[#150a06] p-4">
                <span className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-0.5 text-[10px] font-bold text-[#fbf3ec]">
                    ₦ NGN
                </span>
                <p className="mt-4 text-[10px] text-[#b89a88]">Available balance</p>
                <p className="font-serif text-2xl font-semibold text-[#fbf3ec]">
                    <span className="text-[#f4b860]">₦</span> 245,000.00
                </p>
                <div className="mt-3 flex gap-1">
                    <span className="h-1.5 w-4 rounded-full bg-[#ff7a3d]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {services.map((s) => (
                    <div key={s} className="rounded-xl border border-white/[0.08] bg-[#1e100a] py-2 text-center text-[9px] text-[#d8c3b6]">
                        <span className="mx-auto mb-1 block h-4 w-4 rounded-md bg-[#ff7a3d]/30" />
                        {s}
                    </div>
                ))}
            </div>

            <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#1e100a]">
                {recent.map((r) => (
                    <div key={r.name} className="flex justify-between px-3 py-2 text-[10px] text-[#d8c3b6]">
                        <span>{r.name}</span>
                        <span className="text-[#f4b860]">{r.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}