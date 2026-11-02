"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { adminFetch } from "./adminApi";
import type { Stats, Tx } from "./adminTypes";
import {
    SALE_TYPES,
    STATUSES,
    formatDay,
    formatTime,
    formatToday,
    formatWeekday,
    money,
    naira,
    nairaCompact,
    statusLabel,
    typeLabel,
} from "./adminFormat";
import { STATUS_BAR } from "components/AdminComponent/StatusBadge";
import PageHeader from "components/AdminComponent/PageHeader";
import TransactionsTable from "components/AdminComponent/TransactionsTable";
import TransactionDrawer from "components/AdminComponent/TransactionDrawer";
// import PageHeader from "./components/PageHeader";
// import { STATUS_BAR } from "./components/StatusBadge";
// import TransactionsTable from "./components/TransactionsTable";
// import TransactionDrawer from "./components/TransactionDrawer";

const card = "rounded-2xl border border-white/[0.08] bg-[#1e100a]";

/* ---------- small pieces ---------- */

function Metric({
    label,
    value,
    hint,
    title,
}: {
    label: string;
    value: React.ReactNode;
    hint?: React.ReactNode;
    title?: string;
}) {
    return (
        <div className="bg-[#1e100a] px-5 py-4">
            <p className="text-sm text-[#b89a88]">{label}</p>
            <p title={title} className="mt-1 font-serif text-2xl font-semibold tabular-nums tracking-tight text-[#fbf3ec]">
                {value}
            </p>
            {hint && <p className="mt-1 text-xs text-[#8f7768]">{hint}</p>}
        </div>
    );
}

function SevenDayChart({ series }: { series: Stats["series"] }) {
    const max = Math.max(1, ...series.flatMap((d) => [d.funding, d.sales]));
    const bar = (v: number) => (v <= 0 ? 0 : Math.max(3, (v / max) * 100));
    const summary = series
        .map((d) => `${formatDay(d.day)}: funding ${naira(d.funding)}, sales ${naira(d.sales)}`)
        .join(". ");

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#b89a88]">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#f4b860]" aria-hidden />
                    Wallet funding
                </span>
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#ff7a3d]" aria-hidden />
                    Sales
                </span>
            </div>

            <div className="relative h-48">
                <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="border-t border-white/[0.06]" />
                    ))}
                </div>
                <span className="absolute -top-2 left-0 bg-[#1e100a] pr-2 text-[11px] text-[#8f7768]">{nairaCompact(max)}</span>

                <div className="relative flex h-full items-end gap-2 sm:gap-4" role="img" aria-label={summary}>
                    {series.map((d, i) => {
                        const pos =
                            i === 0 ? "left-0" : i === series.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";
                        return (
                            <div
                                key={d.day}
                                tabIndex={0}
                                className="group relative flex h-full flex-1 items-end justify-center gap-1 focus:outline-none"
                            >
                                <div className="w-full max-w-[18px] rounded-t-sm bg-[#f4b860]" style={{ height: `${bar(d.funding)}%` }} />
                                <div
                                    className="w-full max-w-[18px] rounded-t-sm bg-gradient-to-t from-[#c1440e] to-[#ff7a3d]"
                                    style={{ height: `${bar(d.sales)}%` }}
                                />
                                <div
                                    className={`pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#150a06] px-3 py-2 text-xs opacity-0 shadow-xl group-hover:opacity-100 group-focus:opacity-100 ${pos}`}
                                >
                                    <p className="font-medium text-[#fbf3ec]">{formatDay(d.day)}</p>
                                    <p className="mt-1 text-[#f4b860]">Funding {naira(d.funding)}</p>
                                    <p className="text-[#ff9a5c]">Sales {naira(d.sales)}</p>
                                    <p className="text-[#8f7768]">{d.count} transactions</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-2 flex gap-2 sm:gap-4">
                {series.map((d, i) => (
                    <span
                        key={d.day}
                        className={`flex-1 text-center text-xs ${i === series.length - 1 ? "font-medium text-[#fbf3ec]" : "text-[#8f7768]"}`}
                    >
                        {i === series.length - 1 ? "Today" : formatWeekday(d.day)}
                    </span>
                ))}
            </div>
        </div>
    );
}

function StatusMix({ counts }: { counts: Record<string, number> }) {
    const total = STATUSES.reduce((s, k) => s + (counts[k] ?? 0), 0);
    if (total === 0) {
        return <p className="text-sm text-[#8f7768]">No transactions in the last 30 days.</p>;
    }
    const rate = Math.round(((counts.SUCCESS ?? 0) / total) * 100);
    return (
        <div>
            <p className="font-serif text-3xl font-semibold tabular-nums text-[#fbf3ec]">
                {rate}%
                <span className="ml-2 font-sans text-sm font-normal text-[#8f7768]">succeeded</span>
            </p>
            <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
                {STATUSES.map((s) =>
                    counts[s] ? (
                        <div key={s} className={STATUS_BAR[s]} style={{ width: `${(counts[s] / total) * 100}%` }} />
                    ) : null
                )}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {STATUSES.map((s) => (
                    <li key={s} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-[#d8c3b6]">
                            <span className={`h-2 w-2 rounded-full ${STATUS_BAR[s]}`} aria-hidden />
                            {statusLabel(s)}
                        </span>
                        <span className="tabular-nums text-[#b89a88]">{(counts[s] ?? 0).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TopServices({ rows }: { rows: Stats["byType"] }) {
    const sales = rows
        .filter((r) => SALE_TYPES.includes(r.type))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 6);
    if (sales.length === 0) {
        return <p className="text-sm text-[#8f7768]">No completed sales in the last 30 days.</p>;
    }
    const max = Math.max(1, ...sales.map((r) => r.volume));
    return (
        <ul className="space-y-3.5">
            {sales.map((r) => (
                <li key={r.type}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-[#d8c3b6]">{typeLabel(r.type)}</span>
                        <span className="tabular-nums text-[#fbf3ec]" title={naira(r.volume)}>
                            {nairaCompact(r.volume)}
                        </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
                        <div className="h-full rounded-full bg-[#ff7a3d]" style={{ width: `${(r.volume / max) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-[#8f7768]">{r.count.toLocaleString()} orders</p>
                </li>
            ))}
        </ul>
    );
}

function Skeleton() {
    return (
        <div className="space-y-4" aria-busy="true" aria-label="Loading dashboard">
            <div className="grid gap-4 lg:grid-cols-3">
                <div className={`${card} h-48 animate-pulse lg:col-span-2`} />
                <div className={`${card} h-48 animate-pulse`} />
            </div>
            <div className={`${card} h-28 animate-pulse`} />
            <div className="grid gap-4 lg:grid-cols-3">
                <div className={`${card} h-80 animate-pulse lg:col-span-2`} />
                <div className={`${card} h-80 animate-pulse`} />
            </div>
        </div>
    );
}

/* ---------- page ---------- */

export default function AdminOverview() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recent, setRecent] = useState<Tx[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState<Tx | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [s, t] = await Promise.all([adminFetch("/admin/stats"), adminFetch("/admin/transactions?limit=8")]);
            if (!s.ok || !t.ok) throw new Error("bad response");
            setStats(await s.json());
            setRecent((await t.json()).items);
        } catch {
            setError("Couldn't load the dashboard. Check that the backend is running and has the stats route, then try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const refresh = (
        <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-[#d8c3b6] hover:text-white disabled:opacity-60"
        >
            <RefreshCw size={15} className={loading ? "animate-spin motion-reduce:animate-none" : ""} />
            Refresh
        </button>
    );

    const subtitle = stats ? `${formatToday()}. Updated ${formatTime(stats.generatedAt)}.` : "Lagos time";

    return (
        <div>
            <PageHeader title="Overview" subtitle={subtitle} actions={refresh} />

            {!stats && loading && <Skeleton />}

            {!stats && !loading && error && (
                <div className={`${card} p-8 text-center`}>
                    <p className="text-sm text-[#d8c3b6]">{error}</p>
                    <button onClick={load} className="mt-3 text-sm font-semibold text-[#ff7a3d]">
                        Try again
                    </button>
                </div>
            )}

            {stats && (
                <div className="space-y-4">
                    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                    {/* lead: money held for customers + what needs attention */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        <section className={`${card} relative overflow-hidden p-6 sm:p-7 lg:col-span-2`}>
                            <svg
                                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 sm:h-80 sm:w-80"
                                viewBox="0 0 400 400"
                                fill="none"
                                aria-hidden
                            >
                                {[60, 100, 140, 180].map((r, i) => (
                                    <circle key={r} cx="200" cy="200" r={r} stroke="#ff7a3d" strokeOpacity={0.3 - i * 0.06} />
                                ))}
                            </svg>
                            <p className="relative text-sm text-[#b89a88]">Customer wallet balances</p>
                            <p
                                title={naira(stats.walletBalances)}
                                className="relative mt-2 font-serif text-4xl font-semibold tabular-nums tracking-tight text-[#fbf3ec] sm:text-5xl"
                            >
                                <span className="mr-1 text-2xl text-[#f4b860] sm:text-3xl">₦</span>
                                {money(stats.walletBalances)}
                            </p>
                            <p className="relative mt-3 max-w-md text-sm text-[#8f7768]">
                                What {stats.users.total.toLocaleString()} customers hold in their wallets right now. Your
                                bank and provider funds should always cover this amount.
                            </p>
                        </section>

                        <section
                            className={`${card} p-6 ${
                                stats.attention.stalePending + stats.attention.failed24h > 0 ? "border-amber-400/30" : ""
                            }`}
                        >
                            {stats.attention.stalePending + stats.attention.failed24h > 0 ? (
                                <>
                                    <h2 className="flex items-center gap-2 text-base font-semibold text-[#fbf3ec]">
                                        <AlertTriangle size={18} className="text-amber-300" />
                                        Needs attention
                                    </h2>
                                    <ul className="mt-4 space-y-3 text-sm">
                                        {stats.attention.stalePending > 0 && (
                                            <li className="flex items-center justify-between gap-3">
                                                <span className="text-[#d8c3b6]">
                                                    {stats.attention.stalePending} pending for over 15 minutes
                                                </span>
                                                <Link href="/Admin/Transactions?status=PENDING" className="font-semibold text-[#ff7a3d]">
                                                    Review
                                                </Link>
                                            </li>
                                        )}
                                        {stats.attention.failed24h > 0 && (
                                            <li className="flex items-center justify-between gap-3">
                                                <span className="text-[#d8c3b6]">
                                                    {stats.attention.failed24h} failed in the last 24 hours
                                                </span>
                                                <Link href="/Admin/Transactions?status=FAILED" className="font-semibold text-[#ff7a3d]">
                                                    Review
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <h2 className="flex items-center gap-2 text-base font-semibold text-[#fbf3ec]">
                                        <CheckCircle2 size={18} className="text-emerald-300" />
                                        All clear
                                    </h2>
                                    <p className="mt-3 text-sm text-[#8f7768]">
                                        No stuck or failed transactions in the last 24 hours.
                                    </p>
                                </>
                            )}
                        </section>
                    </div>

                    {/* today */}
                    <section className={`${card} overflow-hidden`}>
                        <h2 className="px-5 pt-4 text-base font-semibold text-[#fbf3ec]">Today</h2>
                        <div className="mt-3 grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
                            <Metric
                                label="Wallet funding"
                                value={nairaCompact(stats.today.funding)}
                                title={naira(stats.today.funding)}
                                hint={`${stats.today.fundingCount} deposits. Yesterday ${nairaCompact(stats.yesterday.funding)}`}
                            />
                            <Metric
                                label="Sales"
                                value={nairaCompact(stats.today.sales)}
                                title={naira(stats.today.sales)}
                                hint={`${stats.today.salesCount} orders. Yesterday ${nairaCompact(stats.yesterday.sales)}`}
                            />
                            <Metric
                                label="Successful transactions"
                                value={stats.today.success.toLocaleString()}
                                hint={
                                    stats.today.total > 0
                                        ? `${Math.round((stats.today.success / stats.today.total) * 100)}% of ${stats.today.total.toLocaleString()} today`
                                        : "No transactions yet today"
                                }
                            />
                            <Metric
                                label="Customers"
                                value={stats.users.total.toLocaleString()}
                                hint={`${stats.users.new7d.toLocaleString()} joined in the last 7 days`}
                            />
                        </div>
                    </section>

                    {/* trends */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        <section className={`${card} p-5 sm:p-6 lg:col-span-2`}>
                            <h2 className="mb-1 text-base font-semibold text-[#fbf3ec]">Last 7 days</h2>
                            <p className="mb-4 text-xs text-[#8f7768]">Completed transactions only. Hover or focus a day for details.</p>
                            <SevenDayChart series={stats.series} />
                        </section>

                        <div className="space-y-4">
                            <section className={`${card} p-5 sm:p-6`}>
                                <h2 className="mb-4 text-base font-semibold text-[#fbf3ec]">Success rate, 30 days</h2>
                                <StatusMix counts={stats.statusBreakdown} />
                            </section>
                            <section className={`${card} p-5 sm:p-6`}>
                                <h2 className="mb-4 text-base font-semibold text-[#fbf3ec]">Top services, 30 days</h2>
                                <TopServices rows={stats.byType} />
                            </section>
                        </div>
                    </div>

                    {/* recent */}
                    <section className={`${card} overflow-hidden`}>
                        <div className="flex items-center justify-between px-5 py-4">
                            <h2 className="text-base font-semibold text-[#fbf3ec]">Recent transactions</h2>
                            <Link href="/Admin/Transactions" className="text-sm font-semibold text-[#ff7a3d]">
                                View all
                            </Link>
                        </div>
                        <div className="border-t border-white/[0.08]">
                            <TransactionsTable
                                items={recent}
                                loading={loading}
                                onSelect={setSelected}
                                emptyText="No transactions yet."
                            />
                        </div>
                    </section>
                </div>
            )}

            <TransactionDrawer tx={selected} onClose={() => setSelected(null)} />
        </div>
    );
}