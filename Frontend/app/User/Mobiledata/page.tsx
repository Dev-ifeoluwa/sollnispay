"use client"

import ForgotPinSheet from "components/ForgotPinSheet";
import { ArrowLeft, CircleUser, Newspaper, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Your backend address. Set NEXT_PUBLIC_API_URL in the frontend .env (and on Vercel).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// One place that talks to the backend. Your login page saves the token in
// localStorage under "token", and the dashboard sends it as a Bearer header,
// so this page does the same.
function apiFetch(path: string, init: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(init.headers ?? {}),
        },
    });
}

// Shape returned by GET /data/plans (price is already your selling price)
type ApiPlan = {
    id: string;
    name: string;
    network: string | null;
    validity: string | null;
    price: number;
}

type Tab = "Hot" | "Daily" | "Weekly" | "Monthly";
const tabs: Tab[] = ["Hot", "Daily", "Weekly", "Monthly"];

const networks = [
    { value: "MTN", label: "MTN" },
    { value: "GLO", label: "Glo" },
    { value: "AIRTEL", label: "Airtel" },
    { value: "9MOBILE", label: "9mobile" },
];

// same rule the backend enforces
const PHONE_OK = /^0[789][01]\d{8}$/;

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// "MTN SME 1GB - 7 Days" -> "SME 1GB"
const sizeLabel = (name: string) =>
    name.replace(/\s*-\s*[^-]+$/, "").replace(/^(MTN|AIRTEL|GLO|9MOBILE)\s*/i, "");

// "7 Days" / "Weekly" / "2 Months" -> number of days (null if unknown)
const daysOf = (validity: string | null): number | null => {
    if (!validity) return null;
    const s = validity.toLowerCase();
    if (s.includes("daily")) return 1;
    if (s.includes("weekly")) return 7;
    if (s.includes("monthly")) return 30;
    const m = s.match(/(\d+)\s*(day|week|month|year)/);
    if (!m) return null;
    const n = Number(m[1]);
    switch (m[2]) {
        case "day": return n;
        case "week": return n * 7;
        case "month": return n * 30;
        default: return n * 365;
    }
};

const newKey = () =>
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function MobileDataTopup() {
    const router = useRouter()
    const HandleClick = () => {
        router.push("/UserDashboard")
    }

    const [network, setNetwork] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [plans, setPlans] = useState<ApiPlan[]>([])
    const [loadingPlans, setLoadingPlans] = useState(false)
    const [plansError, setPlansError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [selectPlan, setSelectPlan] = useState<ApiPlan | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState<Tab>('Hot')
    const [showForgotPin, setShowForgotPin] = useState(false)
    const [showPin, setShowPin] = useState(false)
    const [pin, setPin] = useState(["", "", "", ""]);
    const [submitting, setSubmitting] = useState(false)

    // One random id per purchase attempt. Sending it again (retry, double tap)
    // can never charge twice, because the backend returns the first order.
    const idempotencyKey = useRef<string | null>(null)

    // load the plans for the chosen network
    useEffect(() => {
        if (!network) {
            setPlans([])
            setPlansError('')
            return
        }
        let cancelled = false
        setLoadingPlans(true)
        setPlansError('')
        apiFetch(`/data/plans?network=${encodeURIComponent(network)}`)
            .then(async (res) => {
                if (res.status === 401) {
                    router.push('/Account/Signin')
                    throw new Error('Your session expired. Log in again.')
                }
                if (!res.ok) throw new Error('Could not load plans.')
                return res.json()
            })
            .then((data) => {
                if (!cancelled) setPlans(Array.isArray(data) ? data : [])
            })
            .catch((err) => {
                if (cancelled) return
                setPlans([])
                setPlansError(err?.message || 'Could not reach the server. Check your connection.')
            })
            .finally(() => {
                if (!cancelled) setLoadingPlans(false)
            })
        return () => { cancelled = true }
    }, [network, reloadKey])

    const filteredPlan = useMemo(() => {
        const sorted = [...plans].sort((a, b) => a.price - b.price)
        if (activeTab === 'Hot') return sorted.slice(0, 9) // the 9 cheapest
        return sorted.filter((p) => {
            const d = daysOf(p.validity)
            if (d === null) return false
            if (activeTab === 'Daily') return d <= 3
            if (activeTab === 'Weekly') return d >= 4 && d <= 14
            return d >= 15 && d <= 90 // Monthly
        })
    }, [plans, activeTab])

    const handleTabClick = (tab: Tab) => {
        setActiveTab(tab)
    }

    const handleCardClick = (plan: ApiPlan) => {
        if (!network || !phoneNumber) {
            toast.error('Select a network and enter a phone number')
            return
        }

        if (!PHONE_OK.test(phoneNumber)) {
            setError('Enter a valid 11-digit Nigerian phone number');
            setShowPopup(false);
            return;
        }

        setError('');
        setSelectPlan(plan)
        setShowPopup(true)
    }

    const handleProcess = () => {
        idempotencyKey.current = newKey() // a fresh purchase attempt starts here
        setShowPopup(false)
        setShowPin(true)
    }

    const closePin = () => {
        if (submitting) return
        setShowPin(false)
        setPin(["", "", "", ""])
        idempotencyKey.current = null
    }

    const handleProcessSubmit = async () => {
        if (submitting || !selectPlan) return

        const code = pin.join('')
        if (!/^\d{4}$/.test(code)) {
            toast.error('Enter your 4-digit PIN')
            return
        }

        setSubmitting(true)
        try {
            // only these four fields are sent. The price is worked out on the server.
            const res = await apiFetch('/data/purchase', {
                method: 'POST',
                body: JSON.stringify({
                    planId: selectPlan.id,
                    phone: phoneNumber,
                    pin: code,
                    idempotencyKey: idempotencyKey.current,
                }),
            })
            const data = await res.json().catch(() => null)

            if (res.status === 401) {
                toast.error('Your session expired. Log in again.')
                router.push('/Account/Signin')
                return
            }

            if (!res.ok) {
                // wrong PIN, not enough balance, locked PIN, service unavailable...
                const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
                toast.error(msg || 'Purchase failed. Try again.')
                setPin(["", "", "", ""])
                document.getElementById('pin-0')?.focus()
                return
            }

            if (data?.status === 'FAILED' || data?.status === 'REVERSED') {
                toast.error(data.message)
            } else {
                // SUCCESS, or PENDING (Sabuss confirms a little later)
                toast.success(data?.message || 'Order placed.')
            }

            // the attempt is finished, close and reset
            setShowPin(false)
            setPin(["", "", "", ""])
            setSelectPlan(null)
            idempotencyKey.current = null
        } catch {
            // No answer from the server. The order may or may not exist, so keep the
            // same key: pressing Buy now again is safe and can't charge twice.
            toast.error('No response from the server. Press Buy now to retry, or check History before trying again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);
            if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
        }
    };

    const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-${index - 1}`)?.focus();
        }
    };

    const networkLabel = networks.find((n) => n.value === network)?.label ?? network

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

            <div className="z-10 mx-auto w-full  px-4 py-6 sm:px-6 sm:py-8 pb-24 flex flex-col gap-5 text-sm">

                {error && (
                    <div className="bg-[#e8563a]/15 border border-[#e8563a]/30 text-[#e8563a] font-semibold text-xs sm:text-sm text-center py-2.5 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={HandleClick}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <p className="font-semibold text-[#fbf3ec] text-base italic font-serif">Mobile Data</p>
                    </div>
                    <p className="cursor-pointer font-semibold text-sm text-[#ff7a3d]">History</p>
                </div>

                {/* Network + phone number */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <select
                            value={network}
                            onChange={(e) => setNetwork(e.target.value)}
                            className="bg-transparent text-sm font-semibold outline-none border-0 text-[#fbf3ec] cursor-pointer flex-shrink-0"
                        >
                            <option className="text-black" value="">Network</option>
                            {networks.map((n) => (
                                <option key={n.value} className="text-black" value={n.value}>{n.label}</option>
                            ))}
                        </select>
                        <span className="w-px h-5 bg-white/[0.1] flex-shrink-0" />
                        <input
                            name="tel"
                            id="tel"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setPhoneNumber(value);

                                if (value.length > 0 && value[0] !== '0') {
                                    setError('Phone number must start with 0');
                                } else if (value.length > 0 && value.length !== 11) {
                                    setError('Phone number must be 11 digits');
                                } else if (value.length === 11 && !PHONE_OK.test(value)) {
                                    setError('Enter a valid Nigerian phone number');
                                } else {
                                    setError('')
                                }
                            }}
                            maxLength={11}
                            className="w-full bg-transparent outline-none border-0 text-sm text-[#fbf3ec] placeholder:text-[#8f7768]"
                            placeholder="Phone number"
                        />
                    </div>
                    <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d]">
                        <CircleUser size={18} />
                    </div>
                </div>

                {/* Plans */}
                <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition ${
                                    activeTab === tab
                                        ? "bg-[#ff7a3d] text-[#1a0d05]"
                                        : "bg-white/[0.06] text-[#8f7768]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {!network && (
                        <p className="text-xs text-[#8f7768] text-center py-6">Select a network to see its data plans.</p>
                    )}

                    {network && loadingPlans && (
                        <p className="text-xs text-[#8f7768] text-center py-6">Loading plans…</p>
                    )}

                    {network && !loadingPlans && plansError && (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <p className="text-xs text-[#e8563a] text-center">{plansError}</p>
                            <button
                                onClick={() => setReloadKey((k) => k + 1)}
                                className="text-xs font-bold px-4 py-2 rounded-full border border-white/[0.1] text-[#fbf3ec]"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {network && !loadingPlans && !plansError && filteredPlan.length === 0 && (
                        <p className="text-xs text-[#8f7768] text-center py-6">No {networkLabel} plans in this tab. Try another tab.</p>
                    )}

                    {network && !loadingPlans && !plansError && filteredPlan.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {filteredPlan.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => handleCardClick(plan)}
                                    className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.08] bg-[#301a10] px-2 py-4 cursor-pointer text-center"
                                >
                                    <p className="font-bold text-sm text-[#fbf3ec]">{sizeLabel(plan.name)}</p>
                                    <span className="text-[10px] font-semibold text-[#1a0d05] bg-gradient-to-r from-[#ff7a3d] to-[#f4b860] px-2 py-0.5 rounded-full">
                                        {plan.validity ?? '—'}
                                    </span>
                                    <p className="text-[11px] text-[#8f7768]">{naira(plan.price)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Data service info */}
                <div className="flex items-center gap-3 mb-10 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                        <Newspaper size={16} />
                    </span>
                    <div>
                        <p className="font-semibold text-sm text-[#fbf3ec]">USSD enquiry</p>
                        <p className="text-xs text-[#8f7768]">Check phone and more</p>
                    </div>
                </div>

                {/* Confirm popup */}
                {showPopup && selectPlan && (
                    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[3px]">
                        <div className="mb-0 bg-[#1e100a] border-t border-white/[0.08] left-0 right-0 p-5 sm:p-6 rounded-t-3xl w-full md:max-w-lg mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-base font-semibold italic font-serif text-[#fbf3ec]">Confirm order</p>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] text-[#d8c3b6]"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
                                <SummaryRow label="Service" value={networkLabel} />
                                <SummaryRow label="Number" value={phoneNumber} />
                                <SummaryRow label="Data plan" value={sizeLabel(selectPlan.name)} />
                                <SummaryRow label="Validity" value={selectPlan.validity ?? '—'} />
                                <SummaryRow label="Price" value={naira(selectPlan.price)} highlight />
                            </div>
                            <div className="flex mt-5 gap-3 items-center">
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-[#fbf3ec] border border-white/[0.1]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcess}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                                >
                                    Process
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PIN popup */}
                {showPin && (
                    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[3px]">
                        <div className="bg-[#1e100a] border-t border-white/[0.08] left-0 right-0 p-5 sm:p-6 rounded-t-3xl w-full md:max-w-lg mx-auto">
                            <div className="flex flex-col gap-3 items-center">
                                <h1 className="text-base font-semibold italic font-serif text-[#fbf3ec]">
                                    Input your PIN to pay
                                </h1>
                                <h1 className="font-serif text-2xl font-semibold text-[#f4b860]">
                                    {selectPlan ? naira(selectPlan.price) : ''}
                                </h1>
                                <div className="flex justify-center gap-3 my-6">
                                    {pin.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`pin-${i}`}
                                            type="password"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(e.target.value, i)}
                                            onKeyDown={(e) => handlePinKeyDown(e, i)}
                                            className="w-11 h-11 text-center text-lg font-semibold rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#fbf3ec] outline-none focus:border-[#ff7a3d]"
                                        />
                                    ))}
                                </div>
                                {/* added to others */}
                                <button
                                        type="button"
                                        onClick={() => setShowForgotPin(true)}
                                        disabled={submitting}
                                        className="font-semibold text-[#ff7a3d] text-xs disabled:opacity-50"
                                    >
                                    Forgot PIN
                                </button>
                            </div>
                            <div className="flex mt-6 gap-3 items-center">
                                <button
                                    onClick={closePin}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-[#fbf3ec] border border-white/[0.1] disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleProcessSubmit}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40 disabled:opacity-60"
                                >
                                    {submitting ? 'Processing…' : 'Buy now'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* add to others */}
                <ForgotPinSheet
                        open={showForgotPin}
                        onClose={() => setShowForgotPin(false)}
                        onDone={() => {
                            setShowForgotPin(false)
                            setPin(["", "", "", ""])
                            document.getElementById('pin-0')?.focus()
                        }}
                    />

                <Toaster position="top-center" reverseOrder={true} />
            </div>
        </div>
    )
}

function SummaryRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-[#8f7768]">{label}</span>
            <span className={`font-semibold ${highlight ? "text-[#f4b860]" : "text-[#fbf3ec]"}`}>{value}</span>
        </div>
    );
}