"use client";
import AccountProductCard from "components/UserDashboardCompo/AccountProductCard";
import { useEffect, useRef, useState } from "react";
import { EyeIcon, EyeOffIcon, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Preloader from "components/preloader";
import TransactionRow from "components/UserDashboardCompo/TransactionRow";
import BannerCarousel from "components/BannerCarousel";

// Add a new currency here (e.g. GBP) and it becomes another swipeable wallet
const CURRENCIES: Record<string, { symbol: string; label: string }> = {
    NGN: { symbol: "₦", label: "NGN" },
    USD: { symbol: "$", label: "USD" },
    EUR: { symbol: "€", label: "EUR" },
    USDC: { symbol: "$", label: "USDC" },
};

type Wallet = { currency: string; balance: number };

// How long each wallet stays on screen before the card moves to the next one
const AUTOPLAY_MS = 9000;

export default function UserDashboard() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<any>(null);
    // Balance is blurred while showBalance is false (set useState(true) to start visible)
    const [showBalance, setShowBalance] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const viewportRef = useRef<HTMLDivElement>(null);
    const startRef = useRef<{ x: number; y: number; id: number } | null>(null);
    const capturedRef = useRef(false);
    // autoplay pauses while the user is touching, hovering or keyboard-focused on the card
    const [touching, setTouching] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [tabHidden, setTabHidden] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const range: "7d" | "30d" = "7d";
    const toggleBalance = () => setShowBalance(!showBalance);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const loadDashboard = async (token: string) => {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "content-type": "application/json",
            },
        });
        if (res.ok) {
            const data = await res.json();
            setDashboard(data.dashboard);
        } else if (res.status === 401) {
            console.error("Unauthorized, redirecting to signin.");
            router.push("/Account/Signin");
        } else {
            console.error("Failed to fetch dashboard data.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found, redirecting to signin.");
            router.push("/Account/Signin");
            return;
        }

        loadDashboard(token);
    }, []);

    const handleFundWallet = () => router.push("/User/Deposit");
    const handleSendMoney = () => router.push("/User/SendMoney");

    // ── wallets ──
    // Uses dashboard.wallets once the backend sends it. Until then: naira from dashboard.balance
    // plus empty foreign wallets, so the swipe already works.
    const wallets: Wallet[] = dashboard?.wallets?.length
        ? dashboard.wallets
        : [
              { currency: "NGN", balance: dashboard?.balance ?? 0 },
              { currency: "USD", balance: 0 },
              { currency: "EUR", balance: 0 },
              { currency: "USDC", balance: 0 },
          ];
    const lastIndex = wallets.length - 1;
    const safeIndex = Math.min(activeIndex, lastIndex);
    const activeWallet = wallets[safeIndex];
    const activeMeta = CURRENCIES[activeWallet.currency] ?? {
        symbol: activeWallet.currency,
        label: activeWallet.currency,
    };

    // ── swipe handling (done in JS, so it doesn't depend on native scroll-snap) ──
    const goTo = (i: number) => setActiveIndex(Math.max(0, Math.min(i, lastIndex)));

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        setTouching(true);
        startRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
        capturedRef.current = false;
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const s = startRef.current;
        if (!s || s.id !== e.pointerId) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;

        // Only treat it as a swipe once it is clearly horizontal.
        // Until then, taps on the eye / Fund / Send buttons keep working.
        if (!capturedRef.current) {
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
            capturedRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
        }

        const atEdge = (safeIndex === 0 && dx > 0) || (safeIndex === lastIndex && dx < 0);
        setDragX(atEdge ? dx / 3 : dx);
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        setTouching(false);
        const s = startRef.current;
        if (!s || s.id !== e.pointerId) return;
        startRef.current = null;
        if (capturedRef.current) {
            const width = viewportRef.current?.clientWidth ?? 300;
            const dx = e.clientX - s.x;
            if (Math.abs(dx) > Math.min(60, width * 0.2)) {
                goTo(safeIndex + (dx < 0 ? 1 : -1));
            }
            capturedRef.current = false;
        }
        setDragging(false);
        setDragX(0);
    };

    // The browser took over (e.g. the user scrolled the page vertically): just reset
    const onPointerCancel = () => {
        setTouching(false);
        startRef.current = null;
        capturedRef.current = false;
        setDragging(false);
        setDragX(0);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "ArrowRight") goTo(safeIndex + 1);
        if (e.key === "ArrowLeft") goTo(safeIndex - 1);
    };

    // ── recent activity (only the active currency) ──
    const rangeDays = range === "7d" ? 7 : 30;
    const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
    const filtered: any[] = (dashboard?.transactions ?? [])
        .filter((tx: any) => (tx.currency ?? "NGN") === activeWallet.currency)
        .filter((tx: any) => new Date(tx.createdAt).getTime() >= cutoff)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const visibleTransactions = filtered.slice(0, 3);

    // ── autoplay ──
    // Respect the "reduce motion" setting, and don't keep moving while the tab is in the background
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduceMotion(mq.matches);
        const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
        mq.addEventListener("change", onChange);

        const onVisibility = () => setTabHidden(document.hidden);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            mq.removeEventListener("change", onChange);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    // One timer per wallet: any change of wallet (auto or by the user) restarts the countdown,
    // so after the user swipes, the card waits a full interval before moving again.
    useEffect(() => {
        const paused = touching || hovered || focused || tabHidden || reduceMotion;
        if (!dashboard || wallets.length < 2 || paused) return;
        const id = setTimeout(() => {
            setActiveIndex((i) => (Math.min(i, lastIndex) + 1) % wallets.length);
        }, AUTOPLAY_MS);
        return () => clearTimeout(id);
    }, [dashboard, safeIndex, wallets.length, touching, hovered, focused, tabHidden, reduceMotion]);

    if (!dashboard) {
        return (
            <div>
                <Preloader />
            </div>
        );
    }

    return (
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

                {/* Balance card: the decoration stays put, the wallets swipe inside it */}
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#5a2a14] via-[#301a10] to-[#150a06] p-5 sm:p-8 shadow-2xl shadow-black/40">

                    {/* decorative layer */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.12]"
                        style={{
                            backgroundImage: "radial-gradient(#ffb27a 1px, transparent 1px)",
                            backgroundSize: "18px 18px",
                        }}
                    />
                    <div className="pointer-events-none absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-[#ff7a3d]/25 blur-3xl" />
                    <div className="pointer-events-none absolute -top-20 right-10 w-52 h-52 rounded-full bg-[#f4b860]/15 blur-3xl" />
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
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent" />

                    <div className="relative">
                        {/* swipe area: vertical page scrolling still works, horizontal drags move the wallets */}
                        <div
                            ref={viewportRef}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerCancel}
                            onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
                            onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
                            onFocus={(e) => {
                                // only keyboard focus pauses; a tap on a phone also focuses the card
                                if ((e.target as HTMLElement).matches(":focus-visible")) setFocused(true);
                            }}
                            onBlur={() => setFocused(false)}
                            onKeyDown={onKeyDown}
                            tabIndex={0}
                            role="region"
                            aria-roledescription="carousel"
                            aria-label="Wallets. Swipe to switch currency"
                            style={{ touchAction: "pan-y" }}
                            className="overflow-hidden select-none focus:outline-none"
                        >
                            <div
                                className={`flex ${
                                    dragging ? "" : "transition-transform duration-300 ease-out motion-reduce:transition-none"
                                }`}
                                style={{ transform: `translateX(calc(${-safeIndex * 100}% + ${dragX}px))` }}
                            >
                                {wallets.map((w, i) => {
                                    const meta = CURRENCIES[w.currency] ?? {
                                        symbol: w.currency,
                                        label: w.currency,
                                    };
                                    const naira = w.currency === "NGN";
                                    // hidden wallets shouldn't be reachable with the Tab key
                                    const tab = i === safeIndex ? 0 : -1;
                                    return (
                                        <div
                                            key={w.currency}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${meta.label} wallet`}
                                            aria-hidden={i !== safeIndex}
                                            className="w-full shrink-0 flex flex-col gap-6 sm:gap-8"
                                        >
                                            {/* currency label */}
                                            <div className="flex items-center">
                                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.07] border border-white/10 text-[#fbf3ec]">
                                                    {meta.symbol} {meta.label}
                                                </span>
                                            </div>

                                            {/* balance */}
                                            <div>
                                                <div className="flex items-center gap-4 mb-5">
                                                    <p className="text-xs sm:text-sm text-[#b89a88]">Available balance</p>
                                                </div>

                                                <div className="flex items-end gap-2">
                                                    <span className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#f4b860] font-medium pb-1">
                                                        {meta.symbol}
                                                    </span>
                                                    <span
                                                        className={`font-serif text-4xl sm:text-5xl lg:text-6xl text-[#fbf3ec] font-semibold tracking-tight transition ${
                                                            !showBalance ? "blur-[8px]" : ""
                                                        }`}
                                                    >
                                                        {Number(w.balance).toFixed(2)}
                                                    </span>

                                                    <button
                                                        onClick={toggleBalance}
                                                        tabIndex={tab}
                                                        aria-label={showBalance ? "Hide balance" : "Show balance"}
                                                        className="ml-2 mb-1 flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.07] border border-white/10 text-[#d8c3b6] hover:text-white transition"
                                                    >
                                                        {showBalance ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                                    </button>

                                                    {/* mini trend line */}
                                                    <svg className="hidden sm:block ml-auto w-32 h-12" viewBox="0 0 120 40" fill="none">
                                                        <defs>
                                                            <linearGradient id={`spark-${w.currency}`} x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#ff7a3d" stopOpacity="0.35" />
                                                                <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path
                                                            d="M0 32 L18 26 L34 29 L52 16 L70 21 L88 9 L120 4 L120 40 L0 40 Z"
                                                            fill={`url(#spark-${w.currency})`}
                                                        />
                                                        <path
                                                            d="M0 32 L18 26 L34 29 L52 16 L70 21 L88 9 L120 4"
                                                            stroke="#ff9a5c"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <circle cx="120" cy="4" r="3" fill="#f4b860" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* bottom row: holder + actions */}
                                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8f7768]">
                                                        Wallet holder
                                                    </p>
                                                    <p className="text-sm sm:text-base font-semibold capitalize tracking-wider text-[#fbf3ec]">
                                                        {dashboard.firstName} {dashboard.lastName}
                                                    </p>
                                                </div>

                                                {naira ? (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={handleFundWallet}
                                                            tabIndex={tab}
                                                            className="flex-1 cursor-pointer sm:flex-none sm:px-7 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                                                        >
                                                            <Plus size={16} />
                                                            Fund wallet
                                                        </button>
                                                        <button
                                                            onClick={handleSendMoney}
                                                            tabIndex={tab}
                                                            className="flex-1 cursor-pointer sm:flex-none sm:px-7 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-sm text-[#fbf3ec] bg-white/[0.06] border border-white/15 backdrop-blur"
                                                        >
                                                            <Send size={15} />
                                                            Send
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-xl px-4 py-3 text-sm text-[#d8c3b6] bg-white/[0.06] border border-white/15">
                                                        {meta.label} wallet funding is coming soon
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* position dots (tap to jump) */}
                        {wallets.length > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                {wallets.map((w, i) => {
                                    const label = CURRENCIES[w.currency]?.label ?? w.currency;
                                    const active = i === safeIndex;
                                    return (
                                        <button
                                            key={w.currency}
                                            onClick={() => goTo(i)}
                                            aria-label={`Show ${label} wallet`}
                                            aria-current={active}
                                            className={`relative h-2 rounded-full transition-all before:absolute before:-inset-2 before:content-[''] ${
                                                active ? "w-6 bg-[#ff7a3d]" : "w-2 bg-white/25 hover:bg-white/40"
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="mt-6 sm:mt-8">
                    <AccountProductCard />
                </div>

                <div>
                    <BannerCarousel
                        className="my-4"
                        aspectRatio={1200 / 250}
                        banners={[
                            { src: "/sollnisbanner2.png", alt: "Power your home with Sollnis Solar", href: "/User/Sollnissolar" },
                            { src: "/sollnisbanner1.png", alt: "Get your solar", href: "/User/Sollnissolar" },
                        ]}
                    />
                </div>

                {/* Recent transactions */}
                <div className="mt-8 sm:mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
                            Recent activity
                        </h4>
                        <Link href="/User/Transactions" className="text-sm font-semibold text-[#ff7a3d] whitespace-nowrap">
                            View all
                        </Link>
                    </div>

                    {visibleTransactions.length === 0 ? (
                        <p className="text-[#8f7768] text-sm my-5 text-center py-10">
                            No {activeMeta.label} transactions in the last {rangeDays} days.
                        </p>
                    ) : (
                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] divide-y divide-white/[0.06] overflow-hidden">
                            {visibleTransactions.map((tx: any) => (
                                <TransactionRow key={tx.id} tx={tx} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}