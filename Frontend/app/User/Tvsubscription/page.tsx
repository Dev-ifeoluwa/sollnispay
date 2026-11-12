// "use client"

// import { ArrowLeft, CircleUser, Newspaper, Users, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// type tvPlan = {
//     id: number;
//     Name: string,
//     Plan: string,
//     Price: string
// }

// type tvPlans = {
//     Name: string;
//     Plan: string;
//     Price: string;
// }

// export default function TvSubsPage() {
//     const [tvNetwork, setTvNetwork] = useState('')
//     const [smartCardNumber, setSmartCardNumber] = useState('')
//     const [selectPlan, setSelectPlan] = useState<tvPlans | null>(null)
//     const [showPopup, setShowPopup] = useState(false)
//     const [error, setError] = useState('')
//     const [showPin, setShowPin] = useState(false)
//     const [pin, setPin] = useState(["", "", "", ""])

//     const handleCardClick = (plan: any) => {
//         if (!tvNetwork || !smartCardNumber) {
//             toast.error('select Tv Provider and input Smart Card Number')
//             return
//         }
//         setSelectPlan(plan)
//         setShowPopup(true)
//     }

//     const handleProcess = () => {
//         setShowPin(true)
//         setShowPopup(false)
//     }

//     const handleProcessSubmit = () => {
//         const payload = {
//             tvNetwork,
//             smartCardNumber,
//             Name: selectPlan?.Name,
//             Plan: selectPlan?.Plan,
//             Price: selectPlan?.Price
//         }
//         console.log('sending to backend:', payload)
//     }

//     const router = useRouter()
//     const HandleClick = () => {
//         router.push("/UserDashboard")
//     }

//     const TvsubPlan: tvPlan[] = [
//         { id: 1, Name: "DStv padi", Plan: "1 month", Price: "4,000" },
//         { id: 2, Name: "DStv Yanga", Plan: "1 month", Price: "6,000" },
//         { id: 3, Name: "DStv Confam", Plan: "1 month", Price: "11,000" },
//         { id: 4, Name: "DStv Compact", Plan: "1 month", Price: "1,900" },
//         { id: 5, Name: "DStv Compact Plus", Plan: "1 month", Price: "30,000" },
//         { id: 6, Name: "DStv Stream Premium", Plan: "1 month", Price: "44,500" },
//     ]

//     const handleChange = (value: string, index: number) => {
//         if (/^[0-9]?$/.test(value)) {
//             const newPin = [...pin];
//             newPin[index] = value;
//             setPin(newPin);
//             if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
//         }
//     }

//     return (
//         <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
//             <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

//             <div className="z-10 mx-auto w-full  px-4 py-6 sm:px-6 sm:py-8 pb-24 flex flex-col gap-5 text-sm">

//                 {error && (
//                     <div className="bg-[#e8563a]/15 border border-[#e8563a]/30 text-[#e8563a] font-semibold text-xs sm:text-sm text-center py-2.5 rounded-xl">
//                         {error}
//                     </div>
//                 )}

//                 {/* Top bar */}
//                 <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-3">
//                         <button
//                             onClick={HandleClick}
//                             className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
//                         >
//                             <ArrowLeft size={16} />
//                         </button>
//                         <p className="font-semibold text-[#fbf3ec] text-base italic font-serif">TV subscription</p>
//                     </div>
//                     <p className="cursor-pointer font-semibold text-sm text-[#ff7a3d]">History</p>
//                 </div>

//                 {/* Provider select */}
//                 <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-3">
//                     <select
//                         onChange={(e) => setTvNetwork(e.target.value)}
//                         className="w-full bg-transparent text-sm font-semibold outline-none border-0 text-[#fbf3ec] cursor-pointer"
//                     >
//                         <option className="text-black" value="">Select provider</option>
//                         <option className="text-black" value="DStv">DStv</option>
//                         <option className="text-black" value="Startime">Startime</option>
//                         <option className="text-black" value="Shomax">Shomax</option>
//                         <option className="text-black" value="Netfilx">Netflix</option>
//                     </select>
//                 </div>

//                 {/* Smartcard number */}
//                 <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
//                     <div className="flex items-center justify-between">
//                         <p className="font-semibold text-sm text-[#fbf3ec]">Smartcard number</p>
//                         <button className="flex items-center gap-1.5 text-xs font-semibold text-[#8f7768]">
//                             Beneficiaries
//                             <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                                 <Users size={13} />
//                             </span>
//                         </button>
//                     </div>
//                     <input
//                         maxLength={20}
//                         value={smartCardNumber}
//                         onChange={(e) => setSmartCardNumber(e.target.value.replace(/\D/g, ''))}
//                         className="w-full bg-transparent font-semibold text-sm outline-none border-0 text-[#fbf3ec] placeholder:text-[#8f7768]"
//                         placeholder="00000000"
//                     />
//                 </div>

//                 {/* Plans */}
//                 <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4">
//                     <div className="flex items-center gap-2">
//                         <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#ff7a3d] text-[#1a0d05]">Hot offers</span>
//                         <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/[0.06] text-[#8f7768]">Premium</span>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
//                         {TvsubPlan.map((plan) => (
//                             <div
//                                 key={plan.id}
//                                 onClick={() => handleCardClick(plan)}
//                                 className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-[#301a10] px-3 py-6 cursor-pointer text-center"
//                             >
//                                 <p className="text-sm font-semibold text-[#fbf3ec]">{plan.Name}</p>
//                                 <span className="text-[10px] font-semibold text-[#1a0d05] bg-gradient-to-r from-[#ff7a3d] to-[#f4b860] px-2 py-0.5 rounded-full">
//                                     {plan.Plan}
//                                 </span>
//                                 <p className="text-sm font-bold text-[#f4b860]">₦{plan.Price}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* TV service info */}
//                 <div className="flex items-center mb-10 gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
//                     <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                         <Newspaper size={16} />
//                     </span>
//                     <div>
//                         <p className="font-semibold text-sm text-[#fbf3ec]">USSD enquiry</p>
//                         <p className="text-xs text-[#8f7768]">Check phone and more</p>
//                     </div>
//                 </div>

//                 {/* Confirm popup */}
//                 {showPopup && selectPlan && (
//                     <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[3px]">
//                         <div className="bg-[#1e100a] border-t border-white/[0.08] left-0 right-0 p-5 sm:p-6 rounded-t-3xl w-full md:max-w-lg mx-auto">
//                             <div className="flex justify-between items-center mb-4">
//                                 <p className="text-base font-semibold italic font-serif text-[#fbf3ec]">Confirm order</p>
//                                 <button
//                                     onClick={() => setShowPopup(false)}
//                                     className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] text-[#d8c3b6]"
//                                 >
//                                     <X size={15} />
//                                 </button>
//                             </div>
//                             <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
//                                 <SummaryRow label="Service" value={tvNetwork} />
//                                 <SummaryRow label="Number" value={smartCardNumber} />
//                                 <SummaryRow label="Plan" value={selectPlan.Name} />
//                                 <SummaryRow label="Validity" value={selectPlan.Plan} />
//                                 <SummaryRow label="Price" value={`₦${selectPlan.Price}`} highlight />
//                             </div>
//                             <div className="flex mt-5 gap-3 items-center">
//                                 <button
//                                     onClick={() => setShowPopup(false)}
//                                     className="flex-1 py-3 rounded-xl font-bold text-sm text-[#fbf3ec] border border-white/[0.1]"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleProcess}
//                                     className="flex-1 py-3 rounded-xl font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
//                                 >
//                                     Process
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* PIN popup */}
//                 {showPin && (
//                     <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[3px]">
//                         <div className="bg-[#1e100a] border-t border-white/[0.08] left-0 right-0 p-5 sm:p-6 rounded-t-3xl w-full md:max-w-lg mx-auto">
//                             <div className="flex flex-col gap-3 items-center">
//                                 <h1 className="text-base font-semibold italic font-serif text-[#fbf3ec]">
//                                     Input your PIN to pay
//                                 </h1>
//                                 <h1 className="font-serif text-2xl font-semibold text-[#f4b860]">
//                                     ₦{selectPlan?.Price}
//                                 </h1>
//                                 <div className="flex justify-center gap-3 my-6">
//                                     {pin.map((digit, i) => (
//                                         <input
//                                             key={i}
//                                             id={`pin-${i}`}
//                                             type="password"
//                                             maxLength={1}
//                                             value={digit}
//                                             onChange={(e) => handleChange(e.target.value, i)}
//                                             className="w-11 h-11 text-center text-lg font-semibold rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#fbf3ec] outline-none focus:border-[#ff7a3d]"
//                                         />
//                                     ))}
//                                 </div>
//                                 <button className="font-semibold text-[#ff7a3d] text-xs">
//                                     Forgot PIN
//                                 </button>
//                             </div>
//                             <div className="flex mt-6 gap-3 items-center">
//                                 <button
//                                     onClick={() => setShowPin(false)}
//                                     className="flex-1 py-3 rounded-xl font-bold text-sm text-[#fbf3ec] border border-white/[0.1]"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleProcessSubmit}
//                                     className="flex-1 py-3 rounded-xl font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
//                                 >
//                                     Buy now
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 <Toaster position="top-center" reverseOrder={true} />
//             </div>
//         </div>
//     )
// }

// function SummaryRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
//     return (
//         <div className="flex justify-between items-center text-sm">
//             <span className="text-[#8f7768]">{label}</span>
//             <span className={`font-semibold ${highlight ? "text-[#f4b860]" : "text-[#fbf3ec]"}`}>{value}</span>
//         </div>
//     );
// }




"use client"

import ForgotPinSheet from "components/ForgotPinSheet";
import { ArrowLeft, Newspaper, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Your backend address. Set NEXT_PUBLIC_API_URL in the frontend .env (and on Vercel).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Same helper as the Mobile Data and Airtime pages: sends the login token as a Bearer header.
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

// Shapes returned by the backend (prices are already your selling prices)
type ApiProvider = { code: string; name: string; imageUrl: string | null; needsPhone: boolean }
type ApiPlan = { id: string; name: string; price: number }

type Tab = "Hot offers" | "Premium" | "All";
const tabs: Tab[] = ["Hot offers", "Premium", "All"];
const HOT_COUNT = 6; // "Hot offers" = the 6 cheapest plans, "Premium" = the rest

// same rules the backend enforces
const SMARTCARD_OK = /^\d{8,12}$/;
const PHONE_OK = /^0[789][01]\d{8}$/;

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// "1 month" / "Monthly" found inside a plan name (null if the name has none)
const validityOf = (name: string): string | null => {
    const m = name.match(/(\d+)\s*(day|week|month|year)s?\b/i);
    if (m) {
        const n = Number(m[1]);
        return `${n} ${m[2].toLowerCase()}${n === 1 ? "" : "s"}`;
    }
    const w = name.match(/\b(daily|weekly|monthly|quarterly|yearly|annual)\b/i);
    return w ? w[1][0].toUpperCase() + w[1].slice(1).toLowerCase() : null;
};

// "GOtv Smallie - monthly N1575" -> "GOtv Smallie"  (the price and period are shown separately)
const cleanName = (name: string) => {
    let n = name.replace(/\s*[-–]?\s*N\s?[\d,]+(\.\d+)?\s*$/i, "").trim();
    n = n.replace(/\s*[-–]\s*(daily|weekly|monthly|quarterly|yearly|annual)\s*$/i, "").trim();
    return n || name;
};

const newKey = () =>
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function TvSubsPage() {
    const router = useRouter()
    const HandleClick = () => {
        router.push("/UserDashboard")
    }

    const [providers, setProviders] = useState<ApiProvider[]>([])
    const [providersError, setProvidersError] = useState('')
    const [tvNetwork, setTvNetwork] = useState('') // the provider code, e.g. "dstv_cable_tv"
    const [smartCardNumber, setSmartCardNumber] = useState('')
    const [phone, setPhone] = useState('')

    const [plans, setPlans] = useState<ApiPlan[]>([])
    const [loadingPlans, setLoadingPlans] = useState(false)
    const [plansError, setPlansError] = useState('')
    const [reloadKey, setReloadKey] = useState(0)
    const [activeTab, setActiveTab] = useState<Tab>('Hot offers')

    const [verifying, setVerifying] = useState(false)
    const [verifyDone, setVerifyDone] = useState(false) // we asked and got an answer for THIS provider + number
    const [customerName, setCustomerName] = useState<string | null>(null)

    const [selectPlan, setSelectPlan] = useState<ApiPlan | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [error, setError] = useState('')
    const [showPin, setShowPin] = useState(false)
    const [showForgotPin, setShowForgotPin] = useState(false)
    const [pin, setPin] = useState(["", "", "", ""])
    const [submitting, setSubmitting] = useState(false)

    // One random id per purchase attempt. Sending it again (retry, double tap)
    // can never charge twice, because the backend returns the first order.
    const idempotencyKey = useRef<string | null>(null)

    const provider = providers.find((p) => p.code === tvNetwork)
    const providerName = provider?.name ?? tvNetwork

    // load the providers once
    useEffect(() => {
        let cancelled = false
        apiFetch('/cable/providers')
            .then(async (res) => {
                if (res.status === 401) {
                    router.push('/Account/Signin')
                    throw new Error('Your session expired. Log in again.')
                }
                if (!res.ok) throw new Error('Could not load TV providers.')
                return res.json()
            })
            .then((data) => {
                if (!cancelled) setProviders(Array.isArray(data) ? data : [])
            })
            .catch((err) => {
                if (!cancelled) setProvidersError(err?.message || 'Could not reach the server. Check your connection.')
            })
        return () => { cancelled = true }
    }, [router])

    // load the plans for the chosen provider
    useEffect(() => {
        if (!tvNetwork) {
            setPlans([])
            setPlansError('')
            return
        }
        let cancelled = false
        setLoadingPlans(true)
        setPlansError('')
        apiFetch(`/cable/plans?provider=${encodeURIComponent(tvNetwork)}`)
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
    }, [tvNetwork, reloadKey, router])

    const filteredPlans = useMemo(() => {
        const sorted = [...plans].sort((a, b) => a.price - b.price)
        if (activeTab === 'Hot offers') return sorted.slice(0, HOT_COUNT)
        if (activeTab === 'Premium') return sorted.slice(HOT_COUNT)
        return sorted
    }, [plans, activeTab])

    // Changing the provider or the number means the earlier check no longer applies
    const resetVerification = () => {
        setVerifyDone(false)
        setCustomerName(null)
    }

    const handleVerify = async () => {
        if (!tvNetwork) return toast.error('Select a TV provider first')
        if (!SMARTCARD_OK.test(smartCardNumber)) {
            setError('Enter a valid smartcard / IUC number (8 to 12 digits)')
            return
        }
        setError('')
        setVerifying(true)
        try {
            const res = await apiFetch('/cable/verify', {
                method: 'POST',
                body: JSON.stringify({ provider: tvNetwork, smartcard: smartCardNumber }),
            })
            const data = await res.json().catch(() => null)

            if (res.status === 401) {
                toast.error('Your session expired. Log in again.')
                router.push('/Account/Signin')
                return
            }
            if (!res.ok) {
                const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
                toast.error(msg || 'Could not check that number. Try again.')
                resetVerification()
                return
            }
            setCustomerName(data?.customerName ?? null)
            setVerifyDone(true)
            if (!data?.customerName) {
                toast('This provider cannot check numbers in advance. Double-check yours before paying.')
            }
        } catch {
            toast.error('No response from the server. Check your connection and try again.')
        } finally {
            setVerifying(false)
        }
    }

    const handleCardClick = (plan: ApiPlan) => {
        if (!tvNetwork || !smartCardNumber) {
            toast.error('select Tv Provider and input Smart Card Number')
            return
        }
        if (!SMARTCARD_OK.test(smartCardNumber)) {
            setError('Enter a valid smartcard / IUC number (8 to 12 digits)')
            return
        }
        if (!verifyDone) {
            toast.error('Tap Verify to check the smartcard number first')
            return
        }
        // if (provider?.needsPhone && !PHONE_OK.test(phone)) {
        //     setError('Enter a valid 11-digit phone number for this provider')
        //     return
        // }
        setError('')
        setSelectPlan(plan)
        setShowPopup(true)
    }

    const handleProcess = () => {
        idempotencyKey.current = newKey() // a fresh purchase attempt starts here
        setShowPin(true)
        setShowPopup(false)
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
            // only these fields are sent. The price is worked out on the server.
            const res = await apiFetch('/cable/purchase', {
                method: 'POST',
                body: JSON.stringify({
                    provider: tvNetwork,
                    planId: selectPlan.id,
                    smartcard: smartCardNumber,
                    ...(provider?.needsPhone ? { phone } : {}),
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
                // wrong PIN, not enough balance, locked PIN, number not found...
                const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
                toast.error(msg || 'Purchase failed. Try again.')
                setPin(["", "", "", ""])
                document.getElementById('pin-0')?.focus()
                return
            }

            if (data?.status === 'FAILED' || data?.status === 'REVERSED') {
                toast.error(data.message)
            } else {
                // SUCCESS, or PENDING (the provider confirms a little later)
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
    }

    const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-${index - 1}`)?.focus();
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

            <div className="z-10 mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 pb-24 flex flex-col gap-5 text-sm">

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
                        <p className="font-semibold text-[#fbf3ec] text-base italic font-serif">TV subscription</p>
                    </div>
                    <p className="cursor-pointer font-semibold text-sm text-[#ff7a3d]">History</p>
                </div>

                {/* Provider select */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-3">
                    <select
                        value={tvNetwork}
                        onChange={(e) => {
                            setTvNetwork(e.target.value)
                            resetVerification()
                            setActiveTab('Hot offers')
                        }}
                        className="w-full bg-transparent text-sm font-semibold outline-none border-0 text-[#fbf3ec] cursor-pointer"
                    >
                        <option className="text-black" value="">Select provider</option>
                        {providers.map((p) => (
                            <option key={p.code} className="text-black" value={p.code}>{p.name}</option>
                        ))}
                    </select>
                    {providersError && (
                        <p className="text-xs text-[#e8563a] mt-2">{providersError}</p>
                    )}
                </div>

                {/* Smartcard number */}
                <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-[#fbf3ec]">Smartcard number</p>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#8f7768]">
                            Beneficiaries
                            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d]">
                                <Users size={13} />
                            </span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            maxLength={12}
                            inputMode="numeric"
                            value={smartCardNumber}
                            onChange={(e) => {
                                setSmartCardNumber(e.target.value.replace(/\D/g, ''))
                                resetVerification()
                            }}
                            className="w-full bg-transparent font-semibold text-sm outline-none border-0 text-[#fbf3ec] placeholder:text-[#8f7768]"
                            placeholder="00000000"
                        />
                        <button
                            onClick={handleVerify}
                            disabled={verifying || !tvNetwork || smartCardNumber.length < 8}
                            className="flex-shrink-0 font-bold px-4 py-2 rounded-full text-xs text-[#1a0d05] bg-gradient-to-r from-[#ff7a3d] to-[#c1440e] disabled:opacity-40"
                        >
                            {verifying ? 'Checking…' : 'Verify'}
                        </button>
                    </div>
                    {verifyDone && customerName && (
                        <p className="text-xs font-semibold text-[#f4b860]">✓ {customerName}</p>
                    )}
                    {provider?.needsPhone && (
                        <input
                            type="tel"
                            maxLength={11}
                            inputMode="numeric"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-transparent font-semibold text-sm outline-none border-0 border-t border-white/[0.08] pt-3 text-[#fbf3ec] placeholder:text-[#8f7768]"
                            placeholder="Your phone number"
                        />
                    )}
                </div>

                {/* Plans */}
                <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                                    activeTab === tab
                                        ? "bg-[#ff7a3d] text-[#1a0d05]"
                                        : "bg-white/[0.06] text-[#8f7768]"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {!tvNetwork && (
                        <p className="text-xs text-[#8f7768] text-center py-6">Select a provider to see its plans.</p>
                    )}

                    {tvNetwork && loadingPlans && (
                        <p className="text-xs text-[#8f7768] text-center py-6">Loading plans…</p>
                    )}

                    {tvNetwork && !loadingPlans && plansError && (
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

                    {tvNetwork && !loadingPlans && !plansError && filteredPlans.length === 0 && (
                        <p className="text-xs text-[#8f7768] text-center py-6">No {providerName} plans in this tab. Try another tab.</p>
                    )}

                    {tvNetwork && !loadingPlans && !plansError && filteredPlans.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                            {filteredPlans.map((plan) => {
                                const validity = validityOf(plan.name)
                                return (
                                    <div
                                        key={plan.id}
                                        onClick={() => handleCardClick(plan)}
                                        className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-[#301a10] px-3 py-6 cursor-pointer text-center"
                                    >
                                        <p className="text-sm font-semibold text-[#fbf3ec]">{cleanName(plan.name)}</p>
                                        {validity && (
                                            <span className="text-[10px] font-semibold text-[#1a0d05] bg-gradient-to-r from-[#ff7a3d] to-[#f4b860] px-2 py-0.5 rounded-full">
                                                {validity}
                                            </span>
                                        )}
                                        <p className="text-sm font-bold text-[#f4b860]">{naira(plan.price)}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* TV service info */}
                <div className="flex items-center mb-10 gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
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
                        <div className="bg-[#1e100a] border-t border-white/[0.08] left-0 right-0 p-5 sm:p-6 rounded-t-3xl w-full md:max-w-lg mx-auto">
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
                                <SummaryRow label="Service" value={providerName} />
                                <SummaryRow label="Number" value={smartCardNumber} />
                                {customerName && <SummaryRow label="Name" value={customerName} />}
                                <SummaryRow label="Plan" value={cleanName(selectPlan.name)} />
                                {validityOf(selectPlan.name) && (
                                    <SummaryRow label="Validity" value={validityOf(selectPlan.name) ?? ''} />
                                )}
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