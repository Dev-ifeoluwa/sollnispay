// "use client";
// import { useEffect, useState } from "react";
// import {
//     ArrowLeft,
//     Wallet,
//     CreditCard,
//     Landmark,
//     Smartphone,
//     CheckCircle2,
//     EyeIcon, EyeOffIcon, Plus, ArrowDownLeft, ArrowUpRight
// } from "lucide-react";
// // import { EyeIcon, EyeOffIcon, Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Preloader from "components/preloader";

// const QUICK_AMOUNTS = [1000, 5000, 10000, 25000];

// const PAYMENT_METHODS = [
//     { id: "card", label: "Debit card", sub: "Instant funding", icon: CreditCard },
//     { id: "transfer", label: "Bank transfer", sub: "Takes a few minutes", icon: Landmark },
//     { id: "ussd", label: "USSD", sub: "Dial code from any phone", icon: Smartphone },
// ];

// export default function FundWalletPage() {
//     const router = useRouter();
//     const [dashboard, setDashboard] = useState<any>(null);
//     const [amount, setAmount] = useState("");
//     const [method, setMethod] = useState("card");
//     const [loading, setLoading] = useState(false);
//     const [copied, setCopied] = useState(false);
//     const [error, setError] = useState("");

//     const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

//     useEffect(() => {
//         const token = localStorage.getItem('token');

//         if (!token) {
//             console.error("No token found, redirecting to signin.");
//             router.push('/Account/Signin');
//             return;
//         }

//         const fetchDashboard = async () => {
//             const res = await fetch(`${API_URL}/auth/me`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'content-type': 'application/json'
//                 },
//             })
//             if (res.ok) {
//                 const data = await res.json();
//                 setDashboard(data.dashboard);
//             } else if (res.status === 401) {
//                 console.error("Unauthorized, redirecting to signin.");
//                 router.push('/Account/Signin');
//             } else {
//                 console.error("Failed to fetch dashboard data.");
//             }
//         }
//         fetchDashboard();
//     }, []);





    

//     const handleFund = async () => {
//         setError("");
//         const numericAmount = Number(amount);

//         if (!numericAmount || numericAmount <= 0) {
//             setError("Enter a valid amount.");
//             return;
//         }

//         setLoading(true);
//         try {
//             const token = localStorage.getItem('token');
//             const res = await fetch(`${API_URL}/wallet/fund`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'content-type': 'application/json'
//                 },
//                 body: JSON.stringify({ amount: numericAmount, method }),
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 if (data.paymentUrl) {
//                     window.location.href = data.paymentUrl;
//                 } else {
//                     router.push('/User/Dashboard');
//                 }
//             } else if (res.status === 401) {
//                 router.push('/Account/Signin');
//             } else {
//                 setError("Could not initiate funding. Try again.");
//             }
//         } catch (err) {
//             console.error(err);
//             setError("Something went wrong. Try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             {!dashboard ? (
//                 <div>
//                     <Preloader />
//                 </div>
//             ) : (
//                 <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
//                     <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

//                     <div className="z-10 mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">

//                         {/* Top bar */}
//                         <div className="flex items-center gap-3 mb-6">
//                             <button
//                                 onClick={() => router.back()}
//                                 className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
//                             >
//                                 <ArrowLeft size={16} />
//                             </button>
//                             <h1 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
//                                 Fund wallet
//                             </h1>
//                         </div>

//                         {/* Current balance */}
//                         <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-5 py-4 mb-6">
//                             <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                                 <Wallet size={18} />
//                             </span>
//                             <div>
//                                 <p className="text-xs text-[#8f7768]">Current balance</p>
//                                 <p className="text-base font-bold text-[#fbf3ec] font-serif">
//                                     ₦{dashboard.balance?.toFixed(2)}
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Amount input */}
//                         <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#301a10] to-[#26140c] px-5 py-6 sm:px-6">
//                             <p className="text-xs font-semibold text-[#8f7768] mb-3">Amount to fund</p>
//                             <div className="flex items-baseline gap-2">
//                                 <span className="font-serif text-2xl sm:text-3xl text-[#f4b860] font-medium">₦</span>
//                                 <input
//                                     type="number"
//                                     inputMode="numeric"
//                                     value={amount}
//                                     onChange={(e) => setAmount(e.target.value)}
//                                     placeholder="0.00"
//                                     className="w-full bg-transparent font-serif text-3xl sm:text-4xl text-[#fbf3ec] font-semibold tracking-tight outline-none placeholder:text-[#8f7768]/40"
//                                 />
//                             </div>

//                             <div className="flex flex-wrap gap-2 mt-5">
//                                 {QUICK_AMOUNTS.map((val) => (
//                                     <button
//                                         key={val}
//                                         onClick={() => setAmount(String(val))}
//                                         className={`text-xs font-bold px-3.5 py-2 rounded-full border transition ${
//                                             amount === String(val)
//                                                 ? "bg-[#ff7a3d] text-[#1a0d05] border-[#ff7a3d]"
//                                                 : "bg-white/[0.05] text-[#d8c3b6] border-white/[0.08]"
//                                         }`}
//                                     >
//                                         ₦{val.toLocaleString()}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Payment method */}
//                         <p className="text-xs font-bold text-[#8f7768] mt-7 mb-2.5 px-1">Payment method</p>
//                         <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] divide-y divide-white/[0.06] overflow-hidden">
//                             {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
//                                 <button
//                                     key={id}
//                                     onClick={() => setMethod(id)}
//                                     className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 text-left"
//                                 >
//                                     <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#ff7a3d]/15 text-[#ff7a3d]">
//                                         <Icon size={16} />
//                                     </span>
//                                     <span className="flex-1 min-w-0">
//                                         <p className="text-sm font-semibold text-[#fbf3ec]">{label}</p>
//                                         <span className="text-[11.5px] text-[#8f7768]">{sub}</span>
//                                     </span>
//                                     <span
//                                         className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                                             method === id
//                                                 ? "border-[#ff7a3d] bg-[#ff7a3d]"
//                                                 : "border-white/[0.15]"
//                                         }`}
//                                     >
//                                         {method === id && <CheckCircle2 size={14} className="text-[#1a0d05]" />}
//                                     </span>
//                                 </button>
//                             ))}
//                         </div>

//                         {error && (
//                             <p className="text-sm text-[#e8563a] mt-4 text-center">{error}</p>
//                         )}

//                         <button
//                             onClick={handleFund}
//                             disabled={loading}
//                             className="w-full mt-7 mb-10 flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40 disabled:opacity-60"
//                         >
//                             {loading ? "Processing..." : "Continue to pay"}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }









"use client";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Wallet,
    CreditCard,
    Landmark,
    Smartphone,
    CheckCircle2,
    Copy,   // ADDED
    Check,  // ADDED
} from "lucide-react";
import { useRouter } from "next/navigation";
import Preloader from "components/preloader";

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000];

const PAYMENT_METHODS = [
    { id: "card", label: "Debit card", sub: "Instant funding", icon: CreditCard },
    // { id: "transfer", label: "Bank transfer", sub: "Takes a few minutes", icon: Landmark },
    { id: "ussd", label: "USSD", sub: "Dial code from any phone", icon: Smartphone },
];

export default function FundWalletPage() {
    const router = useRouter();
    const [dashboard, setDashboard] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("card");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // ADDED: reusable loader (replaces the fetch that was inside the useEffect)
    const loadDashboard = async (token: string) => {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            },
        });
        if (res.ok) {
            const data = await res.json();
            setDashboard(data.dashboard);
        } else if (res.status === 401) {
            console.error("Unauthorized, redirecting to signin.");
            router.push('/Account/Signin');
        } else {
            console.error("Failed to fetch dashboard data.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No token found, redirecting to signin.");
            router.push('/Account/Signin');
            return;
        }

        loadDashboard(token);
    }, []);

    // ADDED: Paystack creates the account asynchronously, so keep checking
    // for a minute until the account number shows up.
    useEffect(() => {
        if (!dashboard || dashboard.accountNumber || dashboard.accountStatus === 'FAILED') return;
        const token = localStorage.getItem('token');
        if (!token) return;

        let tries = 0;
        const id = setInterval(() => {
            tries += 1;
            if (tries > 12) {
                clearInterval(id);
                return;
            }
            loadDashboard(token);
        }, 5000);
        return () => clearInterval(id);
    }, [dashboard?.accountNumber, dashboard?.accountStatus]);

    // ADDED
    const copyAccountNumber = () => {
        if (!dashboard?.accountNumber) return;
        navigator.clipboard.writeText(dashboard.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleFund = async () => {
        setError("");
        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount <= 0) {
            setError("Enter a valid amount.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/wallet/fund`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ amount: numericAmount, method }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.paymentUrl) {
                    window.location.href = data.paymentUrl;
                } else {
                    router.push('/User/Dashboard');
                }
            } else if (res.status === 401) {
                router.push('/Account/Signin');
            } else {
                setError("Could not initiate funding. Try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!dashboard ? (
                <div>
                    <Preloader />
                </div>
            ) : (
                <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
                    <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

                    <div className="z-10 mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">

                        {/* Top bar */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
                            >
                                <ArrowLeft size={16} />
                            </button>
                            <h1 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
                                Fund wallet
                            </h1>
                        </div>

                        {/* Current balance */}
                        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-5 py-4 mb-6">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                                <Wallet size={18} />
                            </span>
                            <div>
                                <p className="text-xs text-[#8f7768]">Current balance</p>
                                <p className="text-base font-bold text-[#fbf3ec] font-serif">
                                    ₦{dashboard.balance?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* ADDED: Account details */}
                        <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] px-5 py-4 mb-6">
                            {/* <p className="text-xs font-semibold text-[#8f7768] mb-3">Your bank account details</p> */}

                            {dashboard.accountNumber ? (
                                <div className="flex flex-col gap-4">
                                    <div className="items-center gap-3">
                                        <div className=" flex flex-col text-center">
                                            <p className="text-sm font-semibold my-3 text-[#fbf3ec]">Bank transfer</p>
                                            
                                        </div>
                                        <div className="flex justify-center items-center gap-3 flex-1">
                                            <p className="text-3xl font-bold text-[#fbf3ec] tracking-wide">
                                                {dashboard.accountNumber}
                                            </p>
                                            <button
                                            onClick={copyAccountNumber}
                                            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
                                            >
                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                        <p className="text-[11px] text-[#8f7768]">Account name</p>
                                        <p className="text-sm font-light lowercase text-[#fbf3ec]">{dashboard.accountName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-[#8f7768]">Bank name</p>
                                        <p className="text-sm font-light lowercase text-[#fbf3ec]">{dashboard.bankName}</p>
                                    </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-[#d8c3b6]">
                                    {dashboard.accountStatus === "FAILED"
                                        ? "Account couldn't be created. Please contact support."
                                        : "Generating account…"}
                                </p>
                            )}
                        </div>

                        {/* Amount input */}
                        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#301a10] to-[#26140c] px-5 py-6 sm:px-6">
                            <p className="text-xs font-semibold text-[#8f7768] mb-3">Amount to fund</p>
                            <div className="flex items-baseline gap-2">
                                <span className="font-serif text-2xl sm:text-3xl text-[#f4b860] font-medium">₦</span>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-transparent font-serif text-3xl sm:text-4xl text-[#fbf3ec] font-semibold tracking-tight outline-none placeholder:text-[#8f7768]/40"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-5">
                                {QUICK_AMOUNTS.map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setAmount(String(val))}
                                        className={`text-xs font-bold px-3.5 py-2 rounded-full border transition ${
                                            amount === String(val)
                                                ? "bg-[#ff7a3d] text-[#1a0d05] border-[#ff7a3d]"
                                                : "bg-white/[0.05] text-[#d8c3b6] border-white/[0.08]"
                                        }`}
                                    >
                                        ₦{val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment method */}
                        <p className="text-xs font-bold text-[#8f7768] mt-7 mb-2.5 px-1">Payment method</p>
                        <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] divide-y divide-white/[0.06] overflow-hidden">
                            {PAYMENT_METHODS.map(({ id, label, sub, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setMethod(id)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 sm:px-5 text-left"
                                >
                                    <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#ff7a3d]/15 text-[#ff7a3d]">
                                        <Icon size={16} />
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#fbf3ec]">{label}</p>
                                        <span className="text-[11.5px] text-[#8f7768]">{sub}</span>
                                    </span>
                                    <span
                                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            method === id
                                                ? "border-[#ff7a3d] bg-[#ff7a3d]"
                                                : "border-white/[0.15]"
                                        }`}
                                    >
                                        {method === id && <CheckCircle2 size={14} className="text-[#1a0d05]" />}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <p className="text-sm text-[#e8563a] mt-4 text-center">{error}</p>
                        )}

                        <button
                            onClick={handleFund}
                            disabled={loading}
                            className="w-full mt-7 mb-10 flex items-center justify-center gap-2 rounded-xl py-4 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40 disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Continue to pay"}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}