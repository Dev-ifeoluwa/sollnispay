"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, Search, X } from "lucide-react";
import { adminFetch } from "../adminApi";
import type { Tx, TxList } from "../adminTypes";
import { PROVIDERS, STATUSES, TX_TYPES, statusLabel, typeLabel } from "../adminFormat";
import PageHeader from "components/AdminComponent/PageHeader";
import TransactionsTable from "components/AdminComponent/TransactionsTable";
import TransactionDrawer from "components/AdminComponent/TransactionDrawer";
// import PageHeader from "../components/PageHeader";
// import TransactionsTable from "../components/TransactionsTable";
// import TransactionDrawer from "../components/TransactionDrawer";

const LIMIT = 20;

type Filters = { status: string; type: string; provider: string; from: string; to: string };
const NO_FILTERS: Filters = { status: "", type: "", provider: "", from: "", to: "" };

const field =
    "w-full rounded-xl bg-white/[0.05] border border-white/10 px-3.5 py-2.5 text-sm text-[#fbf3ec] placeholder:text-[#8f7768] outline-none focus:border-[#ff7a3d] focus:ring-2 focus:ring-[#ff7a3d]/30 [color-scheme:dark] [&>option]:bg-[#1e100a]";

function TransactionsView() {
    const params = useSearchParams();

    // links from the overview (e.g. ?status=FAILED) pre-fill the filters
    const [filters, setFilters] = useState<Filters>({
        status: params.get("status") ?? "",
        type: params.get("type") ?? "",
        provider: params.get("provider") ?? "",
        from: "",
        to: "",
    });
    const [search, setSearch] = useState(params.get("search") ?? "");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);

    const [data, setData] = useState<TxList | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState<Tx | null>(null);
    const requestId = useRef(0);

    // wait until the person stops typing before searching
    useEffect(() => {
        if (search === debouncedSearch) return;
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search, debouncedSearch]);

    const setFilter = (patch: Partial<Filters>) => {
        setFilters((f) => ({ ...f, ...patch }));
        setPage(1);
    };

    const activeCount =
        Object.values(filters).filter(Boolean).length + (debouncedSearch.trim() ? 1 : 0);

    const reset = () => {
        setFilters(NO_FILTERS);
        setSearch("");
        setDebouncedSearch("");
        setPage(1);
    };

    useEffect(() => {
        const id = ++requestId.current;
        setLoading(true);
        setError("");

        const qs = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
        if (debouncedSearch.trim()) qs.set("search", debouncedSearch.trim());
        (Object.keys(filters) as (keyof Filters)[]).forEach((k) => {
            if (filters[k]) qs.set(k, filters[k]);
        });

        adminFetch(`/admin/transactions?${qs.toString()}`)
            .then(async (res) => {
                if (!res.ok) throw new Error("bad response");
                const json: TxList = await res.json();
                if (id === requestId.current) setData(json);
            })
            .catch(() => {
                if (id === requestId.current) setError("Couldn't load transactions. Try again.");
            })
            .finally(() => {
                if (id === requestId.current) setLoading(false);
            });
    }, [page, debouncedSearch, filters, refreshKey]);

    const total = data?.total ?? 0;
    const pages = data?.pages ?? 1;
    const first = total === 0 ? 0 : (page - 1) * LIMIT + 1;
    const last = Math.min(page * LIMIT, total);

    return (
        <div>
            <PageHeader
                title="Transactions"
                subtitle="Every wallet funding, purchase and transfer on Sollnis Pay."
                actions={
                    <button
                        onClick={() => setRefreshKey((k) => k + 1)}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-[#d8c3b6] hover:text-white disabled:opacity-60"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin motion-reduce:animate-none" : ""} />
                        Refresh
                    </button>
                }
            />

            {/* filters */}
            <section className="rounded-2xl border border-white/[0.08] bg-[#1e100a] p-4 sm:p-5" aria-label="Filters">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <label htmlFor="tx-search" className="sr-only">
                            Search transactions
                        </label>
                        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f7768]" />
                        <input
                            id="tx-search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by reference, email, phone, description or ID"
                            className={`${field} pl-10`}
                        />
                    </div>
                    {activeCount > 0 && (
                        <button
                            onClick={reset}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-[#ff7a3d] hover:bg-white/[0.04]"
                        >
                            <X size={15} />
                            Clear filters ({activeCount})
                        </button>
                    )}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                        <label htmlFor="f-status" className="mb-1.5 block text-xs text-[#8f7768]">Status</label>
                        <select id="f-status" value={filters.status} onChange={(e) => setFilter({ status: e.target.value })} className={field}>
                            <option value="">All statuses</option>
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>{statusLabel(s)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-type" className="mb-1.5 block text-xs text-[#8f7768]">Service</label>
                        <select id="f-type" value={filters.type} onChange={(e) => setFilter({ type: e.target.value })} className={field}>
                            <option value="">All services</option>
                            {TX_TYPES.map((t) => (
                                <option key={t} value={t}>{typeLabel(t)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-provider" className="mb-1.5 block text-xs text-[#8f7768]">Provider</label>
                        <select id="f-provider" value={filters.provider} onChange={(e) => setFilter({ provider: e.target.value })} className={field}>
                            <option value="">All providers</option>
                            {PROVIDERS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="f-from" className="mb-1.5 block text-xs text-[#8f7768]">From</label>
                        <input id="f-from" type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => setFilter({ from: e.target.value })} className={field} />
                    </div>
                    <div>
                        <label htmlFor="f-to" className="mb-1.5 block text-xs text-[#8f7768]">To</label>
                        <input id="f-to" type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => setFilter({ to: e.target.value })} className={field} />
                    </div>
                </div>
            </section>

            {/* results */}
            <section className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1e100a]">
                <div className="flex items-center justify-between px-5 py-3.5 text-sm text-[#b89a88]" aria-live="polite">
                    <span>
                        {data ? (total === 0 ? "No results" : `Showing ${first.toLocaleString()} to ${last.toLocaleString()} of ${total.toLocaleString()}`) : "Loading..."}
                    </span>
                </div>

                <div className="border-t border-white/[0.08]">
                    {error ? (
                        <div className="px-6 py-14 text-center">
                            <p className="text-sm text-red-400" role="alert">{error}</p>
                            <button onClick={() => setRefreshKey((k) => k + 1)} className="mt-3 text-sm font-semibold text-[#ff7a3d]">
                                Try again
                            </button>
                        </div>
                    ) : (
                        <TransactionsTable
                            items={data?.items ?? []}
                            loading={loading}
                            onSelect={setSelected}
                            emptyText={activeCount > 0 ? "No transactions match these filters." : "No transactions yet."}
                        />
                    )}
                </div>

                {pages > 1 && (
                    <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-3">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1 || loading}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[#d8c3b6] hover:bg-white/[0.05] disabled:opacity-40"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <span className="text-sm text-[#8f7768]">
                            Page {page} of {pages.toLocaleString()}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(pages, p + 1))}
                            disabled={page >= pages || loading}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[#d8c3b6] hover:bg-white/[0.05] disabled:opacity-40"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </section>

            <TransactionDrawer tx={selected} onClose={() => setSelected(null)} />
        </div>
    );
}

// useSearchParams needs a Suspense boundary in the Next.js app router
export default function AdminTransactionsPage() {
    return (
        <Suspense fallback={<p className="text-sm text-[#8f7768]">Loading...</p>}>
            <TransactionsView />
        </Suspense>
    );
}