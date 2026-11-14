// import { ReactNode } from "react";

// // CSS phone so the landing page needs no extra images.
// // Later you can swap WalletScreen for a real screenshot of the app.
// export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
//     return (
//         <div
//             className={`relative w-[260px] shrink-0 rounded-[2.6rem] border-[6px] border-[#3a2418] bg-[#120a06] p-3 shadow-2xl shadow-black/50 ${className}`}
//         >
//             <div className="mx-auto mb-3 h-5 w-20 rounded-full bg-black" />
//             {children}
//         </div>
//     );
// }

// const services = ["Airtime", "Data", "TV", "Gifts"];
// const recent = [
//     { name: "MTN airtime", amount: "-₦2,000" },
//     { name: "Wallet funded", amount: "+₦10,000" },
// ];

// export function WalletScreen() {
//     return (
//         <div className="space-y-3 pb-3">
//             <div>
//                 <p className="text-[10px] text-[#8f7768]">Welcome back</p>
//                 <p className="font-serif text-base italic text-[#fbf3ec]">Adaeze</p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#5a2a14] via-[#301a10] to-[#150a06] p-4">
//                 <span className="rounded-full border border-white/10 bg-white/[0.07] px-2 py-0.5 text-[10px] font-bold text-[#fbf3ec]">
//                     ₦ NGN
//                 </span>
//                 <p className="mt-4 text-[10px] text-[#b89a88]">Available balance</p>
//                 <p className="font-serif text-2xl font-semibold text-[#fbf3ec]">
//                     <span className="text-[#f4b860]">₦</span> 245,000.00
//                 </p>
//                 <div className="mt-3 flex gap-1">
//                     <span className="h-1.5 w-4 rounded-full bg-[#ff7a3d]" />
//                     <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
//                     <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
//                     <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
//                 </div>
//             </div>

//             <div className="grid grid-cols-4 gap-2">
//                 {services.map((s) => (
//                     <div key={s} className="rounded-xl border border-white/[0.08] bg-[#1e100a] py-2 text-center text-[9px] text-[#d8c3b6]">
//                         <span className="mx-auto mb-1 block h-4 w-4 rounded-md bg-[#ff7a3d]/30" />
//                         {s}
//                     </div>
//                 ))}
//             </div>

//             <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.08] bg-[#1e100a]">
//                 {recent.map((r) => (
//                     <div key={r.name} className="flex justify-between px-3 py-2 text-[10px] text-[#d8c3b6]">
//                         <span>{r.name}</span>
//                         <span className="text-[#f4b860]">{r.amount}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }




// import { ReactNode } from "react";
// import { Eye, Plus, Send, Wifi, Phone, Tv, ArrowRight, ArrowDownToLine } from "lucide-react";

// // The screen mirrors the real SollnisPay dashboard (same palette, serif italic name,
// // wallet card with rings, quick actions, recent activity).
// // Later you can swap WalletScreen for a real screenshot of the app.
// export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
//     return (
//         <div
//             className={`relative flex w-[280px] shrink-0 flex-col rounded-[2.8rem] border-[6px] border-[#3a2418] bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)] p-1.5 shadow-2xl shadow-black/50 ${className}`}
//         >
//             <div className="relative flex-1 overflow-hidden rounded-[2.2rem] bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)] px-3 pt-2">
//             {/* <div className="relative flex-1 overflow-hidden rounded-[2.2rem] bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)] px-3 pt-2"> */}
//                 <div className="mx-auto mb-3 h-4 w-16 rounded-full bg-black" />
//                 {children}
//             </div>
//         </div>
//     );
// }

// export function WalletScreen() {
//     return (
//         <div className="space-y-3 pb-3">
//             {/* header */}
//             <div className="flex items-center justify-between">
//                 <div>
//                     <p className="text-[9px] font-medium text-[#8f7768]">Welcome</p>
//                     <p className="font-serif text-base font-semibold italic text-[#fbf3ec]">Adaeze</p>
//                 </div>
//                 <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/15 bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-[10px] font-bold text-white">
//                     AO
//                 </span>
//             </div>

//             {/* wallet card */}
//             <div className="relative isolate overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#5a2a14] via-[#301a10] to-[#150a06] p-4 shadow-xl shadow-black/40">
//                 <div
//                     className="pointer-events-none absolute inset-0 opacity-[0.12]"
//                     style={{ backgroundImage: "radial-gradient(#ffb27a 1px, transparent 1px)", backgroundSize: "14px 14px" }}
//                 />
//                 <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,122,61,0.25),transparent_70%)]" />
//                 <svg aria-hidden="true" className="pointer-events-none absolute -right-14 -top-14 h-52 w-52" viewBox="0 0 400 400" fill="none">
//                     <circle cx="200" cy="200" r="60" stroke="#ff7a3d" strokeOpacity="0.45" />
//                     <circle cx="200" cy="200" r="100" stroke="#ff7a3d" strokeOpacity="0.32" />
//                     <circle cx="200" cy="200" r="140" stroke="#ff7a3d" strokeOpacity="0.22" />
//                     <circle cx="200" cy="200" r="180" stroke="#ff7a3d" strokeOpacity="0.14" />
//                     <circle cx="200" cy="200" r="20" fill="#ff7a3d" fillOpacity="0.35" />
//                 </svg>

//                 <div className="relative">
//                     <span className="inline-block rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-1 text-[9px] font-bold text-[#fbf3ec]">
//                         ₦ NGN
//                     </span>
//                     <p className="mt-4 text-[9px] text-[#b89a88]">Available balance</p>
//                     <div className="mt-1 flex items-end gap-1.5">
//                         <span className="pb-0.5 font-serif text-base font-medium text-[#f4b860]">₦</span>
//                         <span className="font-serif text-2xl font-semibold tracking-tight text-[#fbf3ec]">245,000.00</span>
//                         <span className="mb-0.5 ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-[#d8c3b6]">
//                             <Eye size={12} />
//                         </span>
//                     </div>

//                     <p className="mt-4 text-[8px] uppercase tracking-[0.2em] text-[#8f7768]">Wallet holder</p>
//                     <p className="text-[11px] font-semibold capitalize tracking-wider text-[#fbf3ec]">Adaeze Okafor</p>

//                     <div className="mt-3 flex gap-2">
//                         <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] py-2 text-[10px] font-bold text-[#1a0d05]">
//                             <Plus size={12} /> Fund wallet
//                         </span>
//                         <span className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/15 bg-white/[0.08] py-2 text-[10px] font-bold text-[#fbf3ec]">
//                             <Send size={11} /> Send
//                         </span>
//                     </div>

//                     <div className="mt-3 flex justify-center gap-1.5">
//                         <span className="h-1.5 w-4 rounded-full bg-[#ff7a3d]" />
//                         <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
//                         <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
//                         <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
//                     </div>
//                 </div>
//             </div>

//             {/* quick actions */}
//             <div className="grid grid-cols-2 gap-2">
//                 <div className="row-span-2 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#1e100a] p-3">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                         <Wifi size={15} />
//                     </span>
//                     <div>
//                         <p className="mb-2 font-serif text-sm font-semibold italic text-[#fbf3ec]">Mobile data</p>
//                         <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff7a3d] text-[#1a0d05]">
//                             <ArrowRight size={13} />
//                         </span>
//                     </div>
//                 </div>
//                 {[
//                     { label: "Airtime", icon: Phone },
//                     { label: "Cable TV", icon: Tv },
//                 ].map(({ label, icon: Icon }) => (
//                     <div key={label} className="rounded-2xl border border-white/[0.08] bg-[#1e100a] p-3">
//                         <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                             <Icon size={13} />
//                         </span>
//                         <p className="text-[11px] font-semibold text-[#fbf3ec]">{label}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* recent activity */}
//             <div>
//                 <p className="mb-2 font-serif text-sm font-semibold italic text-[#fbf3ec]">Recent activity</p>
//                 <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1e100a]">
//                     {[
//                         { name: "MTN airtime", amount: "-₦2,000", icon: Phone },
//                         { name: "Wallet funded", amount: "+₦10,000", icon: ArrowDownToLine },
//                     ].map(({ name, amount, icon: Icon }) => (
//                         <div key={name} className="flex items-center gap-2 px-3 py-2.5">
//                             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                                 <Icon size={11} />
//                             </span>
//                             <span className="flex-1 text-[10px] text-[#d8c3b6]">{name}</span>
//                             <span className="text-[10px] font-semibold text-[#f4b860]">{amount}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }






// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { ArrowDownToLine, Phone, MessageSquare, Wallet } from "lucide-react";

// // ── your Canva mockup ──
// // 1. Export it from Canva as PNG (tick "Transparent background" if you have Canva Pro).
// // 2. Save it as public/phone-mockup.png
// // 3. Put the image's real pixel size below so it doesn't stretch.
// const PHONE_SRC = "/phone-mockup.png";
// const PHONE_W = 600;
// const PHONE_H = 1200;

// // depth = how far the card floats in front of the phone (px), rot = its own tilt
// const cards = [
//     {
//         title: "Payment received",
//         body: "+₦25,000.00 from Chinedu O.",
//         icon: ArrowDownToLine,
//         pos: "top-[16%] -left-6 sm:-left-32",
//         depth: 90, rot: 14, delay: "0s",
//     },
//     {
//         title: "Airtime delivered",
//         body: "₦2,000 MTN airtime sent",
//         icon: Phone,
//         pos: "top-[8%] -right-6 sm:-right-32",
//         depth: 60, rot: -14, delay: "1.2s",
//     },
//     {
//         title: "Wallet funded",
//         body: "+₦10,000.00 via virtual account",
//         icon: Wallet,
//         pos: "top-[46%] -left-8 sm:-left-36",
//         depth: 130, rot: 18, delay: "0.6s",
//     },
//     {
//         title: "SollnisPay",
//         body: "Your cable TV subscription is now active.",
//         icon: MessageSquare,
//         pos: "top-[38%] -right-8 sm:-right-36",
//         depth: 110, rot: -18, delay: "1.8s",
//     },
// ];

// export default function PhoneShowcase() {
//     const [tilt, setTilt] = useState({ x: 0, y: 0 });

//     const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
//         if (e.pointerType !== "mouse") return;
//         if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
//         const r = e.currentTarget.getBoundingClientRect();
//         const px = (e.clientX - r.left) / r.width - 0.5;
//         const py = (e.clientY - r.top) / r.height - 0.5;
//         setTilt({ x: -py * 6, y: px * 12 });
//     };

//     return (
//         <div
//             onPointerMove={onMove}
//             onPointerLeave={() => setTilt({ x: 0, y: 0 })}
//             className="relative mx-auto flex h-[420px] max-w-4xl justify-center overflow-hidden sm:h-[520px]"
//             style={{ perspective: "1200px" }}
//         >
//             {/* soft brand glow behind the phone */}
//             <div className="pointer-events-none absolute top-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,122,61,0.28),transparent_70%)]" />

//             <div
//                 className="relative mt-4 w-[230px] transition-transform duration-200 ease-out sm:w-[300px]"
//                 style={{
//                     transformStyle: "preserve-3d",
//                     transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
//                 }}
//             >
//                 <Image
//                     src={PHONE_SRC}
//                     alt="SollnisPay app on a phone"
//                     width={PHONE_W}
//                     height={PHONE_H}
//                     priority
//                     className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
//                 />

//                 {cards.map(({ title, body, icon: Icon, pos, depth, rot, delay }) => (
//                     // outer: fixed 3D position. inner: floating animation.
//                     <div
//                         key={title}
//                         className={`absolute ${pos} w-44 sm:w-60`}
//                         style={{ transform: `translateZ(${depth}px) rotateY(${rot}deg)` }}
//                     >
//                         <div
//                             className="float-card flex items-start gap-3 rounded-2xl border border-white/15 bg-[#1e100a]/90 p-3 shadow-2xl shadow-black/50 sm:p-4"
//                             style={{ animationDelay: delay }}
//                         >
//                             <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-[#1a0d05] sm:h-9 sm:w-9">
//                                 <Icon size={16} />
//                             </span>
//                             <span className="min-w-0">
//                                 <span className="block text-[11px] font-semibold text-[#f4b860] sm:text-xs">{title}</span>
//                                 <span className="mt-0.5 block text-[11px] leading-snug text-[#fbf3ec] sm:text-[13px]">{body}</span>
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <style jsx global>{`
//                 @keyframes sollnis-float {
//                     0%, 100% { transform: translateY(0); }
//                     50% { transform: translateY(-10px); }
//                 }
//                 .float-card { animation: sollnis-float 5s ease-in-out infinite; }
//                 @media (prefers-reduced-motion: reduce) {
//                     .float-card { animation: none; }
//                 }
//             `}</style>
//         </div>
//     );
// }






"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDownToLine, Phone, MessageSquare, Wallet } from "lucide-react";

// ── your Canva mockup ──
// 1. Export it from Canva as PNG (tick "Transparent background" if you have Canva Pro).
// 2. Save it as public/phone-mockup.png
// 3. Put the image's real pixel size below so it doesn't stretch.
const PHONE_SRC = "/phone-mockup.png";
const PHONE_W = 600;
const PHONE_H = 1200;

// depth = how far the card floats in front of the phone (px), rot = its own tilt
const cards = [
    {
        title: "Payment received",
        body: "+₦25,000.00 from Chinedu O.",
        icon: ArrowDownToLine,
        pos: "top-[14%] left-0 sm:left-4",
        depth: 90, rot: 14, delay: "0s",
    },
    // {
    //     title: "Airtime delivered",
    //     body: "₦2,000 MTN airtime sent",
    //     icon: Phone,
    //     pos: "top-[6%] right-0 sm:right-4",
    //     depth: 60, rot: -14, delay: "1.2s",
    // },
    // {
    //     title: "Wallet funded",
    //     body: "+₦10,000.00 via virtual account",
    //     icon: Wallet,
    //     pos: "top-[48%] left-0 sm:left-0",
    //     depth: 130, rot: 18, delay: "0.6s",
    // },
    {
        title: "Sollnispay",
        body: "Your cable TV subscription is now active.",
        icon: MessageSquare,
        pos: "top-[36%] right-0 sm:right-0",
        depth: 110, rot: -18, delay: "1.8s",
    },
];

export default function PhoneShowcase() {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: -py * 6, y: px * 12 });
    };

    return (
        // No fixed height: the image sets the height, so it runs all the way down to the bottom of the hero.
        <div
            onPointerMove={onMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            className="relative flex justify-center overflow-hidden"
            style={{ perspective: "1200px" }}
        >
            {/* soft brand glow behind the phone */}
            <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,122,61,0.28),transparent_70%)]" />

            <div
                className="relative w-[clamp(420px,100%,760px)] shrink-0 transition-transform duration-200 ease-out"
                style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
            >
                <Image
                    src={PHONE_SRC}
                    alt="SollnisPay app on a phone"
                    width={PHONE_W}
                    height={PHONE_H}
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    priority
                    className="block h-auto w-full"
                />

                {/* centred overlay that holds the floating cards */}
                <div
                    className="absolute inset-x-0 top-0 mx-auto h-full w-[340px] sm:w-[640px]"
                    style={{ transformStyle: "preserve-3d" }}
                    >
                        {cards.map(({ title, body, icon: Icon, pos, depth, rot, delay }) => (
                            // outer: fixed 3D position. inner: floating animation.
                            <div
                                key={title}
                                className={`absolute ${pos} w-35 sm:w-45`}
                                style={{ transform: `translateZ(${depth}px) rotateY(${rot}deg)` }}
                            >
                            <div
                                className="float-card flex items-start gap-3 md:gap-2 rounded-2xl border border-white/15 bg-[#1e100a]/90 p-3 shadow-2xl shadow-black/50 sm:p-1"
                                style={{ animationDelay: delay }}
                            >
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-[#1a0d05] sm:h-5 sm:w-5">
                                    <Icon size={10} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-[8px] font-semibold text-[#f4b860] sm:text-xs">{title}</span>
                                    <span className="mt-0.5 block text-[6px] leading-snug text-[#fbf3ec] sm:text-[11px]">{body}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes sollnis-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .float-card { animation: sollnis-float 5s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .float-card { animation: none; }
                }
            `}</style>
        </div>
    );
}