"use client";
import { CREDIT_TYPES, formatShort, fullName, naira, typeLabel } from "app/Admin/adminFormat";
// import type { Tx } from "../adminTypes";
// import { CREDIT_TYPES, formatShort, fullName, naira, typeLabel } from "../adminFormat";
import StatusBadge from "./StatusBadge";
import { Tx } from "app/Admin/adminTypes";

type Props = {
    items: Tx[];
    loading?: boolean;
    onSelect?: (tx: Tx) => void;
    emptyText?: string;
};

const reference = (tx: Tx) => tx.providerRef || `#${tx.id}`;

function Amount({ tx }: { tx: Tx }) {
    const credit = CREDIT_TYPES.includes(tx.type);
    return (
        <span className={`tabular-nums ${credit ? "text-emerald-300" : "text-[#fbf3ec]"}`}>
            {credit ? "+" : ""}
            {naira(tx.amount)}
        </span>
    );
}

const focusRing =
    "focus-visible:outline-none focus-visible:bg-white/[0.05] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#ff7a3d]";

export default function TransactionsTable({
    items,
    loading,
    onSelect,
    emptyText = "No transactions match these filters.",
}: Props) {
    if (loading && items.length === 0) {
        return (
            <div className="divide-y divide-white/[0.06]" aria-busy="true">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
                        <div className="h-4 flex-1 animate-pulse rounded bg-white/[0.06]" />
                        <div className="h-4 w-20 animate-pulse rounded bg-white/[0.06]" />
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return <div className="px-6 py-14 text-center text-sm text-[#8f7768]">{emptyText}</div>;
    }

    return (
        <div className={loading ? "opacity-60 transition-opacity" : ""}>
            {/* desktop: table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.08] text-xs text-[#8f7768]">
                            <th className="px-5 py-3 font-medium">Date</th>
                            <th className="px-3 py-3 font-medium">Customer</th>
                            <th className="px-3 py-3 font-medium">Service</th>
                            <th className="px-3 py-3 font-medium">Reference</th>
                            <th className="px-3 py-3 font-medium">Provider</th>
                            <th className="px-3 py-3 text-right font-medium">Amount</th>
                            <th className="px-5 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((tx) => (
                            <tr
                                key={tx.id}
                                onClick={() => onSelect?.(tx)}
                                onKeyDown={(e) => {
                                    if (onSelect && (e.key === "Enter" || e.key === " ")) {
                                        e.preventDefault();
                                        onSelect(tx);
                                    }
                                }}
                                tabIndex={onSelect ? 0 : undefined}
                                className={`border-b border-white/[0.05] last:border-0 ${
                                    onSelect ? `cursor-pointer hover:bg-white/[0.03] ${focusRing}` : ""
                                }`}
                            >
                                <td className="whitespace-nowrap px-5 py-3.5 text-[#b89a88]">{formatShort(tx.createdAt)}</td>
                                <td className="px-3 py-3.5">
                                    <p className="font-medium text-[#fbf3ec]">{fullName(tx.user)}</p>
                                    <p className="max-w-[14rem] truncate text-xs text-[#8f7768]">{tx.user?.email}</p>
                                </td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-[#d8c3b6]">{typeLabel(tx.type)}</td>
                                <td className="max-w-[11rem] truncate px-3 py-3.5 text-xs text-[#8f7768]" title={reference(tx)}>
                                    {reference(tx)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-[#b89a88]">{tx.provider ?? "-"}</td>
                                <td className="whitespace-nowrap px-3 py-3.5 text-right font-medium">
                                    <Amount tx={tx} />
                                </td>
                                <td className="px-5 py-3.5">
                                    <StatusBadge status={tx.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* mobile: list */}
            <ul className="divide-y divide-white/[0.06] md:hidden">
                {items.map((tx) => (
                    <li key={tx.id}>
                        <button
                            type="button"
                            onClick={() => onSelect?.(tx)}
                            className={`flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left ${focusRing}`}
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-[#fbf3ec]">{typeLabel(tx.type)}</p>
                                <p className="truncate text-xs text-[#b89a88]">{fullName(tx.user)}</p>
                                <p className="mt-0.5 text-xs text-[#8f7768]">{formatShort(tx.createdAt)}</p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-sm font-semibold">
                                    <Amount tx={tx} />
                                </p>
                                <div className="mt-1">
                                    <StatusBadge status={tx.status} />
                                </div>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}