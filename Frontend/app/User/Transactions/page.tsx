// import TransactionRow from "components/UserDashboardCompo/TransactionRow";


// export default function TransactionPage() {
//     return(
//         <>
//             <div className="text-center h-screen  justify-center items-center font-semibold bg-gray-300">
//                 <h1 className="text-xl md:text-3xl text-center justify-center items-center py-50">page <span className="text-green-700">building soon</span>.....</h1>
//             </div>
//         </>
//     )
// }



"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Preloader from "components/preloader";
import TransactionRow from "components/UserDashboardCompo/TransactionRow";
// import TransactionRow from "components/UserDashboardCompo/TransactionRow";

type Range = "7d" | "30d" | "all";
type Kind = "all" | "in" | "out";

const PAGE_SIZE = 20;

export default function TransactionPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[] | null>(null);
    const [range, setRange] = useState<Range>("30d");
    const [kind, setKind] = useState<Kind>("all");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/Account/Signin");
            return;
        }

        const load = async () => {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.dashboard?.transactions ?? []);
            } else if (res.status === 401) {
                router.push("/Account/Signin");
            } else {
                console.error("Failed to fetch transactions.");
                setTransactions([]);
            }
        };
        load();
    }, []);

    // reset pagination whenever a filter changes
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [range, kind]);

    const filtered = useMemo(() => {
        const cutoff =
            range === "all" ? 0 : Date.now() - (range === "7d" ? 7 : 30) * 24 * 60 * 60 * 1000;

        return (transactions ?? [])
            .filter((tx) => new Date(tx.createdAt).getTime() >= cutoff)
            .filter((tx) => {
                if (kind === "all") return true;
                const isCredit = tx.type === "WALLET_FUNDING";
                return kind === "in" ? isCredit : !isCredit;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [transactions, range, kind]);

    const shown = filtered.slice(0, visibleCount);

    const pill = (active: boolean) =>
        `text-xs font-semibold px-3 py-1.5 rounded-full transition ${
            active ? "bg-[#ff7a3d] text-[#1a0d05]" : "text-[#8f7768]"
        }`;

    if (transactions === null) return <Preloader />;

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <div className="pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-[80px]" />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <p className="font-semibold text-[#fbf3ec] text-base italic font-serif">Transaction</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-full p-1">
                        <button onClick={() => setKind("all")} className={pill(kind === "all")}>All</button>
                        <button onClick={() => setKind("in")} className={pill(kind === "in")}>Money in</button>
                        <button onClick={() => setKind("out")} className={pill(kind === "out")}>Money out</button>
                    </div>
                    <div className="flex items-center gap-1 bg-white/[0.06] border border-white/[0.08] rounded-full p-1">
                        <button onClick={() => setRange("7d")} className={pill(range === "7d")}>7 days</button>
                        <button onClick={() => setRange("30d")} className={pill(range === "30d")}>30 days</button>
                        <button onClick={() => setRange("all")} className={pill(range === "all")}>All time</button>
                    </div>
                </div>

                {/* List */}
                {filtered.length === 0 ? (
                    <p className="text-[#8f7768] text-sm my-5 text-center py-10">
                        No transactions found for this filter.
                    </p>
                ) : (
                    <>
                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] divide-y divide-white/[0.06] overflow-hidden">
                            {shown.map((tx) => (
                                <TransactionRow key={tx.id} tx={tx} />
                            ))}
                        </div>

                        <p className="mt-3 text-center text-xs text-[#8f7768]">
                            Showing {shown.length} of {filtered.length}
                        </p>

                        {visibleCount < filtered.length && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                                    className="rounded-xl px-6 py-3 font-bold text-sm text-[#fbf3ec] bg-white/[0.06] border border-white/15 backdrop-blur"
                                >
                                    Load more
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}