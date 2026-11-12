// "use client"

// import { ArrowLeft, CircleUser, Newspaper, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// export default function AirtimeTopup() {
//     const [network, setNetwork] = useState('')
//     const [phoneNumber, setPhoneNumber] = useState('')
//     const [price, setPrice] = useState('')
//     const [showPopup, setShowPopup] = useState(false)
//     const [error, setError] = useState('')
//     const [showPin, setShowPin] = useState(false)
//     const [pin, setPin] = useState(["", "", "", ""]);

//     const handlePriceClick = (value: any) => {
//         setPrice(value.toString())
//     }

//     const handlePurchaseBtn = () => {
//         if (!network || !phoneNumber || !price) {
//             toast.error('select network, input phone number and price')
//             return
//         }

//         if (!phoneNumber.startsWith('0')) {
//             setError('Phone number must start with 0');
//             setShowPopup(false);
//             return;
//         }

//         if (phoneNumber.length !== 11) {
//             setError('Phone number must be 11 digits');
//             setShowPopup(false);
//             return;
//         }

//         setError('');
//         setShowPopup(true)
//     }

//     const handleProcess = () => {
//         setShowPopup(false)
//         setShowPin(true)
//     }

//     const router = useRouter()
//     const HandleClick = () => {
//         router.push("/UserDashboard")
//     }

//     const AirtimePrice = [
//         "50",
//         "100",
//         "200",
//         "500",
//         "1000",
//         "2000",
//     ]

//     const handleChange = (value: string, index: number) => {
//         if (/^[0-9]?$/.test(value)) {
//             const newPin = [...pin];
//             newPin[index] = value;
//             setPin(newPin);
//             if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
//         }
//     };

//     const handleProcessSubmit = () => {
//         const payload = {
//             network,
//             phoneNumber,
//             price
//         }
//         console.log('sending to backend:', payload)
//     }

//     return (
//         <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
//             <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

//             <div className="z-10 mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 pb-24 flex flex-col gap-5 text-sm">

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
//                         <p className="font-semibold text-[#fbf3ec] text-base italic font-serif">Airtime Topup</p>
//                     </div>
//                     <p className="cursor-pointer font-semibold text-sm text-[#ff7a3d]">History</p>
//                 </div>

//                 {/* Network + phone number */}
//                 <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-3">
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                         <select
//                             onChange={(e) => setNetwork(e.target.value)}
//                             className="bg-transparent text-sm font-semibold outline-none border-0 text-[#fbf3ec] cursor-pointer flex-shrink-0"
//                         >
//                             <option className="text-black" value="">Network</option>
//                             <option className="text-black" value="MTN">MTN</option>
//                             <option className="text-black" value="Glo">Glo</option>
//                             <option className="text-black" value="Airtel">Airtel</option>
//                             <option className="text-black" value="9mobile">9mobile</option>
//                         </select>
//                         <span className="w-px h-5 bg-white/[0.1] flex-shrink-0" />
//                         <input
//                             type="tel"
//                             value={phoneNumber}
//                             onChange={(e) => {
//                                 const value = e.target.value.replace(/\D/g, '');
//                                 setPhoneNumber(value);

//                                 if (value.length > 0 && value[0] !== '0') {
//                                     setError('phone number must start with 0');
//                                 } else if (value.length > 0 && value.length !== 11) {
//                                     setError('phone number must be 11 digits');
//                                 } else {
//                                     setError('')
//                                 }
//                             }}
//                             maxLength={11}
//                             className="w-full bg-transparent outline-none border-0 text-sm text-[#fbf3ec] placeholder:text-[#8f7768]"
//                             placeholder="Phone number"
//                         />
//                     </div>
//                     <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                         <CircleUser size={18} />
//                     </div>
//                 </div>

//                 {/* Topup plans */}
//                 <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4">
//                     <p className="text-sm font-semibold text-[#fbf3ec] px-1">Topup plans</p>

//                     <div className="grid grid-cols-3 gap-2 sm:gap-3">
//                         {AirtimePrice.map((plan) => (
//                             <div
//                                 key={plan}
//                                 onClick={() => handlePriceClick(plan)}
//                                 className={`px-3 py-7 rounded-xl cursor-pointer text-center font-bold transition border ${
//                                     price === plan
//                                         ? "bg-[#ff7a3d] border-[#ff7a3d] text-[#1a0d05]"
//                                         : "bg-[#301a10] border-white/[0.08] text-[#fbf3ec]"
//                                 }`}
//                             >
//                                 ₦{plan}
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#301a10] px-3 py-2.5">
//                         <span className="text-base font-semibold text-[#f4b860] flex-shrink-0">₦</span>
//                         <input
//                             maxLength={6}
//                             value={price}
//                             onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
//                             className="w-full bg-transparent text-sm font-semibold outline-none border-0 text-[#fbf3ec] placeholder:text-[#8f7768]"
//                             placeholder="50 - 400,000"
//                         />
//                         <button
//                             onClick={handlePurchaseBtn}
//                             className="flex-shrink-0 font-bold px-4 py-2 rounded-full text-xs sm:text-sm text-[#1a0d05] bg-gradient-to-r from-[#ff7a3d] to-[#c1440e]"
//                         >
//                             Purchase
//                         </button>
//                     </div>
//                 </div>

//                 {/* Airtime service info */}
//                 <div className="flex items-center gap-3 mb-10 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4">
//                     <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                         <Newspaper size={16} />
//                     </span>
//                     <div>
//                         <p className="font-semibold text-sm text-[#fbf3ec]">USSD enquiry</p>
//                         <p className="text-xs text-[#8f7768]">Check phone and more</p>
//                     </div>
//                 </div>

//                 {/* Confirm popup */}
//                 {showPopup && (
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
//                                 <SummaryRow label="Service" value={network} />
//                                 <SummaryRow label="Number" value={phoneNumber} />
//                                 <SummaryRow label="Price" value={`₦${price}`} highlight />
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
//                                     ₦{price}
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
import { ArrowLeft, CircleUser, Newspaper, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Your backend address. Set NEXT_PUBLIC_API_URL in the frontend .env (and on Vercel).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Same helper as the Mobile Data page: sends the login token as a Bearer header.
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

// same rules the backend enforces
const PHONE_OK = /^0[789][01]\d{8}$/;
const MIN_AMOUNT = 50;
const MAX_AMOUNT = 50000;

const NETWORK_LABELS: Record<string, string> = {
    MTN: "MTN",
    GLO: "Glo",
    AIRTEL: "Airtel",
    "9MOBILE": "9mobile",
};

const newKey = () =>
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AirtimeTopup() {
    const [network, setNetwork] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [price, setPrice] = useState('')
    const [showPopup, setShowPopup] = useState(false)
    const [error, setError] = useState('')
    const [showPin, setShowPin] = useState(false)
    const [showForgotPin, setShowForgotPin] = useState(false)
    const [pin, setPin] = useState(["", "", "", ""]);
    const [submitting, setSubmitting] = useState(false)

    // One random id per purchase attempt. Sending it again (retry, double tap)
    // can never charge twice, because the backend returns the first order.
    const idempotencyKey = useRef<string | null>(null)

    const handlePriceClick = (value: any) => {
        setPrice(value.toString())
    }

    const handlePurchaseBtn = () => {
        if (!network || !phoneNumber || !price) {
            toast.error('select network, input phone number and price')
            return
        }

        if (!phoneNumber.startsWith('0')) {
            setError('Phone number must start with 0');
            setShowPopup(false);
            return;
        }

        if (phoneNumber.length !== 11) {
            setError('Phone number must be 11 digits');
            setShowPopup(false);
            return;
        }

        if (!PHONE_OK.test(phoneNumber)) {
            setError('Enter a valid Nigerian phone number');
            setShowPopup(false);
            return;
        }

        const amount = Number(price)
        if (!Number.isInteger(amount) || amount < MIN_AMOUNT) {
            setError(`Minimum airtime is ₦${MIN_AMOUNT}`);
            setShowPopup(false);
            return;
        }

        if (amount > MAX_AMOUNT) {
            setError(`Maximum airtime per purchase is ₦${MAX_AMOUNT.toLocaleString("en-NG")}`);
            setShowPopup(false);
            return;
        }

        setError('');
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

    const router = useRouter()
    const HandleClick = () => {
        router.push("/UserDashboard")
    }

    const AirtimePrice = [
        "50",
        "100",
        "200",
        "500",
        "1000",
        "2000",
    ]

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

    const handleProcessSubmit = async () => {
        if (submitting) return

        const code = pin.join('')
        if (!/^\d{4}$/.test(code)) {
            toast.error('Enter your 4-digit PIN')
            return
        }

        setSubmitting(true)
        try {
            // only these fields are sent. The price is the amount, checked again on the server.
            const res = await apiFetch('/airtime/purchase', {
                method: 'POST',
                body: JSON.stringify({
                    network,
                    phone: phoneNumber,
                    amount: Number(price),
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
                // wrong PIN, not enough balance, locked PIN, limits...
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
            setPrice('')
            idempotencyKey.current = null
        } catch {
            // No answer from the server. The order may or may not exist, so keep the
            // same key: pressing Buy now again is safe and can't charge twice.
            toast.error('No response from the server. Press Buy now to retry, or check History before trying again.')
        } finally {
            setSubmitting(false)
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
                        <p className="font-semibold text-[#fbf3ec] text-base italic font-serif">Airtime Topup</p>
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
                            <option className="text-black" value="MTN">MTN</option>
                            <option className="text-black" value="GLO">Glo</option>
                            <option className="text-black" value="AIRTEL">Airtel</option>
                            <option className="text-black" value="9MOBILE">9mobile</option>
                        </select>
                        <span className="w-px h-5 bg-white/[0.1] flex-shrink-0" />
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setPhoneNumber(value);

                                if (value.length > 0 && value[0] !== '0') {
                                    setError('phone number must start with 0');
                                } else if (value.length > 0 && value.length !== 11) {
                                    setError('phone number must be 11 digits');
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

                {/* Topup plans */}
                <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4">
                    <p className="text-sm font-semibold text-[#fbf3ec] px-1">Topup plans</p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {AirtimePrice.map((plan) => (
                            <div
                                key={plan}
                                onClick={() => handlePriceClick(plan)}
                                className={`px-3 py-7 rounded-xl cursor-pointer text-center font-bold transition border ${
                                    price === plan
                                        ? "bg-[#ff7a3d] border-[#ff7a3d] text-[#1a0d05]"
                                        : "bg-[#301a10] border-white/[0.08] text-[#fbf3ec]"
                                }`}
                            >
                                ₦{plan}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#301a10] px-3 py-2.5">
                        <span className="text-base font-semibold text-[#f4b860] flex-shrink-0">₦</span>
                        <input
                            maxLength={5}
                            inputMode="numeric"
                            value={price}
                            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-transparent text-sm font-semibold outline-none border-0 text-[#fbf3ec] placeholder:text-[#8f7768]"
                            placeholder="50 - 50,000"
                        />
                        <button
                            onClick={handlePurchaseBtn}
                            className="flex-shrink-0 font-bold px-4 py-2 rounded-full text-xs sm:text-sm text-[#1a0d05] bg-gradient-to-r from-[#ff7a3d] to-[#c1440e]"
                        >
                            Purchase
                        </button>
                    </div>
                </div>

                {/* Airtime service info */}
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
                {showPopup && (
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
                                <SummaryRow label="Service" value={NETWORK_LABELS[network] ?? network} />
                                <SummaryRow label="Number" value={phoneNumber} />
                                <SummaryRow label="Price" value={`₦${Number(price).toLocaleString("en-NG")}`} highlight />
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
                                    ₦{Number(price).toLocaleString("en-NG")}
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