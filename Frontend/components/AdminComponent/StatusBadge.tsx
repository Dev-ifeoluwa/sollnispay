// import { statusLabel } from "../adminFormat";

import { statusLabel } from "app/Admin/adminFormat";

const STYLES: Record<string, { badge: string; dot: string }> = {
    SUCCESS: { badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300", dot: "bg-emerald-400" },
    PENDING: { badge: "border-amber-400/20 bg-amber-400/10 text-amber-300", dot: "bg-amber-400" },
    FAILED: { badge: "border-red-400/20 bg-red-400/10 text-red-300", dot: "bg-red-400" },
    REVERSED: { badge: "border-violet-400/20 bg-violet-400/10 text-violet-300", dot: "bg-violet-400" },
};

// Same colours are reused by the status chart on the overview page
export const STATUS_BAR: Record<string, string> = {
    SUCCESS: "bg-emerald-400",
    PENDING: "bg-amber-400",
    FAILED: "bg-red-400",
    REVERSED: "bg-violet-400",
};

export default function StatusBadge({ status }: { status: string }) {
    const s = STYLES[status] ?? { badge: "border-white/10 bg-white/[0.05] text-[#d8c3b6]", dot: "bg-[#8f7768]" };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
            {statusLabel(status)}
        </span>
    );
}