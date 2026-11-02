import type { TxUser } from "./adminTypes";

const LAGOS = "Africa/Lagos";

// 12,345.60
export const money = (n: number | null | undefined) =>
    Number(n ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ₦12,345.60
export const naira = (n: number | null | undefined) => `₦${money(n)}`;

// ₦1.25M for big numbers, full amount for small ones
export const nairaCompact = (n: number | null | undefined) => {
    const v = Number(n ?? 0);
    const abs = Math.abs(v);
    if (abs >= 1e9) return `₦${(v / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `₦${(v / 1e6).toFixed(2)}M`;
    return naira(v);
};

export const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-NG", {
        timeZone: LAGOS,
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

export const formatShort = (iso: string) =>
    new Date(iso).toLocaleString("en-NG", {
        timeZone: LAGOS,
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
    });

export const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-NG", { timeZone: LAGOS, hour: "numeric", minute: "2-digit" });

export const formatToday = () =>
    new Date().toLocaleDateString("en-NG", { timeZone: LAGOS, weekday: "long", day: "numeric", month: "long" });

// "2026-11-01" -> "Sun"
export const formatWeekday = (day: string) =>
    new Date(`${day}T12:00:00Z`).toLocaleDateString("en-NG", { weekday: "short", timeZone: "UTC" });

export const formatDay = (day: string) =>
    new Date(`${day}T12:00:00Z`).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export const TYPE_LABELS: Record<string, string> = {
    AIRTIME: "Airtime",
    DATA: "Data",
    TV_SUBSCRIPTION: "TV subscription",
    ELECTRICITY: "Electricity",
    EDUCATION: "Education",
    SPORT: "Sport",
    WALLET_FUNDING: "Wallet funding",
    TRANSFER_SENT: "Transfer sent",
    TRANSFER_RECEIVED: "Transfer received",
    TRANSFER_BANK: "Bank transfer",
};
export const typeLabel = (t: string) => TYPE_LABELS[t] ?? t;

// Keep these in sync with the backend stats service
export const SALE_TYPES: string[] = ["AIRTIME", "DATA", "TV_SUBSCRIPTION", "ELECTRICITY", "EDUCATION", "SPORT"];
export const CREDIT_TYPES: string[] = ["WALLET_FUNDING", "TRANSFER_RECEIVED"];

export const STATUSES: string[] = ["SUCCESS", "PENDING", "FAILED", "REVERSED"];
export const TX_TYPES: string[] = Object.keys(TYPE_LABELS);
export const PROVIDERS: string[] = ["VTPASS", "INTERNAL", "PAYSTACK", "CLUBKONNECT", "SABUSS"];

export const statusLabel = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export const fullName = (u?: TxUser | null) => (u ? `${u.firstName} ${u.lastName}`.trim() : "Unknown customer");