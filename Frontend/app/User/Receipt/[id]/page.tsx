"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, Share2, Printer, XCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Adjust these field names to match what your /transactions API really returns
type Tx = {
  id: number;
  type?: string;
  amount: number;
  description?: string;
  status?: string; // e.g. SUCCESS | PENDING | FAILED
  reference?: string;
  createdAt: string;
};

const naira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Math.abs(n));

// Same rule your Recent activity list uses to decide + or -  (adjust if different)
const isCredit = (tx: Tx) => /FUNDING|CREDIT|REFUND/i.test(tx.type ?? "");

function StatusBadge({ status = "" }: { status?: string }) {
  const s = status.toUpperCase();
  if (s === "SUCCESS" || s === "SUCCESSFUL" || s === "COMPLETED")
    return (
      <span className="inline-flex items-center gap-1.5 text-green-400 text-sm font-medium">
        <CheckCircle2 size={16} /> Successful
      </span>
    );
  if (s === "FAILED" || s === "REVERSED")
    return (
      <span className="inline-flex items-center gap-1.5 text-red-400 text-sm font-medium">
        <XCircle size={16} /> {s === "FAILED" ? "Failed" : "Reversed"}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-[#ffb36b] text-sm font-medium">
      <Clock size={16} /> Pending
    </span>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-[#8f7768]">{label}</span>
      <span className="text-sm text-[#fbf3ec] text-right break-all">{value}</span>
    </div>
  );
}

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tx, setTx] = useState<Tx | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/transactions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.status === 401) {
          router.replace("/Account/Signin");
          return;
        }
        if (!res.ok) {
          setError(res.status === 404 ? "Receipt not found." : "Could not load this receipt.");
          return;
        }
        setTx(await res.json());
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const share = async () => {
    if (!tx) return;
    const text = `Sollnis Pay receipt\n${tx.description ?? "Transaction"}\nAmount: ${naira(tx.amount)}\nRef: ${tx.reference ?? tx.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Sollnispay receipt", text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard?.writeText(text);
      alert("Receipt details copied.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0806] text-[#fbf3ec] px-4 py-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => router.back()}
          className="print:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6]"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {loading && <p className="text-center text-[#8f7768] mt-20">Loading receipt…</p>}
        {!loading && error && <p className="text-center text-[#e8563a] mt-20">{error}</p>}

        {tx && (
          <>
            <div className="rounded-2xl bg-[#26140c] border border-white/10 p-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-[#8f7768]">Sollnispay</p>
                <h1 className="mt-1 text-lg font-semibold">Transaction receipt</h1>
                <p className={`mt-5 text-3xl font-semibold ${isCredit(tx) ? "text-[#ffb36b]" : "text-white"}`}>
                  {isCredit(tx) ? "+" : "-"}
                  {naira(tx.amount)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={tx.status} />
                </div>
              </div>

              <div className="mt-6">
                <Row label="Description" value={tx.description} />
                <Row label="Type" value={tx.type?.replace(/_/g, " ")} />
                <Row
                  label="Date"
                  value={new Date(tx.createdAt).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
                <Row label="Reference" value={tx.reference} />
                {/* <Row label="Transaction ID" value={tx.id} /> */}
                <Row label="Transaction ID" value={String(tx.id)} />
              </div>

              <p className="mt-6 text-center text-[11px] text-[#8f7768]">
                Keep this receipt as proof of payment. Questions? Contact Sollnis Pay support.
              </p>
            </div>

            <div className="print:hidden mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={share}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm text-[#d8c3b6]"
              >
                <Share2 size={16} /> Share
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#e8563a] py-3 text-sm font-semibold text-white"
              >
                <Printer size={16} /> Save as PDF
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}