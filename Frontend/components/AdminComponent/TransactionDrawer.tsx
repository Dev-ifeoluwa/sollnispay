"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
// import type { Tx } from "../adminTypes";
// import { CREDIT_TYPES, formatDateTime, fullName, naira, typeLabel } from "../adminFormat";
import StatusBadge from "./StatusBadge";
import { CREDIT_TYPES, formatDateTime, fullName, naira, typeLabel } from "app/Admin/adminFormat";
import { Tx } from "app/Admin/adminTypes";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-white/[0.06] py-3.5 last:border-0">
            <dt className="text-xs text-[#8f7768]">{label}</dt>
            <dd className="mt-1 break-words text-sm text-[#fbf3ec]">{children}</dd>
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [done, setDone] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setDone(true);
            setTimeout(() => setDone(false), 1500);
        } catch {
            /* clipboard blocked: ignore */
        }
    };
    return (
        <button
            type="button"
            onClick={copy}
            aria-label="Copy reference"
            className="ml-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-[#ff7a3d] hover:bg-white/[0.06]"
        >
            {done ? <Check size={13} /> : <Copy size={13} />}
            {done ? "Copied" : "Copy"}
        </button>
    );
}

export default function TransactionDrawer({ tx, onClose }: { tx: Tx | null; onClose: () => void }) {
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!tx) return;
        closeRef.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [tx, onClose]);

    if (!tx) return null;
    const credit = CREDIT_TYPES.includes(tx.type);

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} aria-hidden />
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={`Transaction ${tx.id}`}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/[0.08] bg-[#150a06] shadow-2xl shadow-black/50"
            >
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                    <h2 className="font-serif italic text-lg text-[#fbf3ec]">Transaction #{tx.id}</h2>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-[#d8c3b6] hover:text-white"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5">
                    <p className={`font-serif text-3xl font-semibold tabular-nums ${credit ? "text-emerald-300" : "text-[#fbf3ec]"}`}>
                        {credit ? "+" : ""}
                        {naira(tx.amount)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                        <StatusBadge status={tx.status} />
                        <span className="text-sm text-[#b89a88]">{typeLabel(tx.type)}</span>
                    </div>

                    <dl className="mt-5">
                        <Field label="Date">{formatDateTime(tx.createdAt)}</Field>
                        <Field label="Customer">
                            <p className="font-medium">{fullName(tx.user)}</p>
                            {tx.user?.email && <p className="text-[#b89a88]">{tx.user.email}</p>}
                            {tx.user?.phoneNumber && <p className="text-[#b89a88]">{tx.user.phoneNumber}</p>}
                        </Field>
                        <Field label="Provider">{tx.provider ?? "-"}</Field>
                        <Field label="Provider reference">
                            {tx.providerRef ? (
                                <>
                                    <span className="break-all">{tx.providerRef}</span>
                                    <CopyButton text={tx.providerRef} />
                                </>
                            ) : (
                                "-"
                            )}
                        </Field>
                        <Field label="Description">{tx.description || "-"}</Field>
                        <Field label="Items purchased">{tx.itemsPurchased || "-"}</Field>
                        <Field label="Approved by">{tx.approvedById ? `Admin #${tx.approvedById}` : "-"}</Field>
                    </dl>
                </div>

                <p className="border-t border-white/[0.08] px-5 py-3 text-xs text-[#8f7768]">
                    Refund and re-check actions will appear here once they are added.
                </p>
            </aside>
        </>
    );
}