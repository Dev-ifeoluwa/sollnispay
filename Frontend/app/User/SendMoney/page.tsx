"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, Clock, Loader2, Wallet } from "lucide-react";
import Preloader from "components/preloader";

type Mode = "wallet" | "bank";
type Step = "form" | "review" | "success";
type Bank = { name: string; code: string };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const MIN_AMOUNT = 10;
const PIN_LENGTH = 4; // change if your PIN is a different length

// DISPLAY ONLY. The backend must calculate the real fee itself.
// Tiers below mirror Paystack's standard transfer fees; adjust to whatever you charge.
const getBankFee = (amount: number) => (amount <= 5000 ? 10 : amount <= 50000 ? 25 : 50);

const naira = (n: number) =>
    `₦${Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const inputCls =
    "w-full rounded-xl bg-[#26140c] border border-white/10 px-4 py-3 text-sm text-[#fbf3ec] placeholder:text-[#8f7768] outline-none focus:border-[#ff7a3d] transition";
const primaryBtn =
    "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40 disabled:opacity-40 disabled:cursor-not-allowed";
const ghostBtn =
    "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold text-sm text-[#fbf3ec] bg-white/[0.06] border border-white/15";

async function api(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        throw Object.assign(new Error(msg || "Something went wrong. Please try again."), {
            status: res.status,
        });
    }
    return data;
}

export default function SendMoneyPage() {
    const router = useRouter();

    const [balance, setBalance] = useState<number | null>(null);
    const [banks, setBanks] = useState<Bank[]>([]);

    const [mode, setMode] = useState<Mode>("wallet");
    const [step, setStep] = useState<Step>("form");

    // form fields
    const [identifier, setIdentifier] = useState(""); // wallet: email or phone
    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [narration, setNarration] = useState("");
    const [pin, setPin] = useState("");

    // recipient lookup
    const [resolvedName, setResolvedName] = useState("");
    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState("");

    // submit
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);
    const idempotencyKey = useRef<string>(crypto.randomUUID());

    const handleAuthError = (e: any) => {
        if (e?.status === 401) {
            router.push("/Account/Signin");
            return true;
        }
        return false;
    };

    // initial load: balance + bank list
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/Account/Signin");
            return;
        }
        api("/auth/me")
            .then((d) => setBalance(Number(d.dashboard?.balance ?? 0)))
            .catch((e) => {
                if (!handleAuthError(e)) setBalance(0);
            });
        api("/transfers/banks")
            .then((d) => setBanks(d.banks ?? []))
            .catch(() => setBanks([]));
    }, []);

    // look up the recipient name automatically once the details look complete
    useEffect(() => {
        setResolvedName("");
        setResolveError("");

        const ready =
            mode === "bank"
                ? accountNumber.length === 10 && !!bankCode
                : identifier.trim().length >= 5;
        if (!ready) return;

        let cancelled = false;
        setResolving(true);
        const t = setTimeout(async () => {
            try {
                const data =
                    mode === "bank"
                        ? await api("/transfers/resolve-bank", {
                              method: "POST",
                              body: JSON.stringify({ accountNumber, bankCode }),
                          })
                        : await api("/transfers/resolve-wallet", {
                              method: "POST",
                              body: JSON.stringify({ identifier: identifier.trim() }),
                          });
                if (!cancelled) setResolvedName(data.accountName);
            } catch (e: any) {
                if (!cancelled && !handleAuthError(e)) {
                    setResolveError(e.message || "Could not find this account.");
                }
            } finally {
                if (!cancelled) setResolving(false);
            }
        }, 500);

        return () => {
            cancelled = true;
            clearTimeout(t);
            setResolving(false);
        };
    }, [mode, identifier, accountNumber, bankCode]);

    const switchMode = (m: Mode) => {
        setMode(m);
        setIdentifier("");
        setBankCode("");
        setAccountNumber("");
        setError("");
    };

    const amountNum = Number(amount) || 0;
    const fee = mode === "bank" && amountNum > 0 ? getBankFee(amountNum) : 0;
    const total = amountNum + fee;
    const insufficient = balance !== null && total > balance;
    const amountTooLow = amount !== "" && amountNum < MIN_AMOUNT;
    const canContinue = !!resolvedName && amountNum >= MIN_AMOUNT && !insufficient;

    const bankName = banks.find((b) => b.code === bankCode)?.name ?? "";

    const submit = async () => {
        setError("");
        setSubmitting(true);
        try {
            const body =
                mode === "wallet"
                    ? {
                          identifier: identifier.trim(),
                          amount: amountNum,
                          narration,
                          pin,
                          idempotencyKey: idempotencyKey.current,
                      }
                    : {
                          bankCode,
                          accountNumber,
                          accountName: resolvedName,
                          amount: amountNum,
                          narration,
                          pin,
                          idempotencyKey: idempotencyKey.current,
                      };
            const data = await api(mode === "wallet" ? "/transfers/wallet" : "/transfers/bank", {
                method: "POST",
                body: JSON.stringify(body),
            });
            setResult(data);
            if (typeof data.balance === "number") setBalance(data.balance);
            else setBalance((b) => (b === null ? b : b - total));
            setStep("success");
        } catch (e: any) {
            if (!handleAuthError(e)) setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        idempotencyKey.current = crypto.randomUUID();
        setStep("form");
        setIdentifier("");
        setBankCode("");
        setAccountNumber("");
        setAmount("");
        setNarration("");
        setPin("");
        setError("");
        setResult(null);
    };

    if (balance === null) return <Preloader />;

    const row = (label: string, value: string) => (
        <div className="flex items-start justify-between gap-4 py-3">
            <span className="text-xs text-[#8f7768]">{label}</span>
            <span className="text-sm font-semibold text-[#fbf3ec] text-right break-words">{value}</span>
        </div>
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <div className="pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-[80px]" />

            <div className="relative z-10 w-full px-4 py-6 sm:px-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    {step === "review" ? (
                        <button
                            onClick={() => {
                                setStep("form");
                                setPin("");
                                setError("");
                            }}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 text-[#d8c3b6] hover:text-white transition"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    ) : (
                        <Link
                            href="/UserDashboard"
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 text-[#d8c3b6] hover:text-white transition"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                    )}
                    <h1 className="text-xl sm:text-2xl font-semibold italic font-serif text-[#fbf3ec]">
                        {step === "review" ? "Confirm transfer" : step === "success" ? "Transfer" : "Send money"}
                    </h1>
                </div>

                {/* ───────────── FORM ───────────── */}
                {step === "form" && (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] px-5 py-4 flex items-center justify-between">
                            <span className="text-xs text-[#8f7768]">Current balance</span>
                            <span className="text-base font-bold text-[#fbf3ec] font-serif">{naira(balance)}</span>
                        </div>

                        {/* mode switch */}
                        <div className="grid grid-cols-2 gap-3">
                            {([
                                ["wallet", "Sollnis wallet", Wallet],
                                ["bank", "Other banks", Building2],
                            ] as const).map(([m, label, Icon]) => (
                                <button
                                    key={m}
                                    onClick={() => switchMode(m)}
                                    className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold transition ${
                                        mode === m
                                            ? "border-[#ff7a3d] bg-[#ff7a3d]/10 text-[#fbf3ec]"
                                            : "border-white/[0.08] bg-[#1e100a] text-[#8f7768]"
                                    }`}
                                >
                                    <Icon size={20} className={mode === m ? "text-[#ff7a3d]" : ""} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] p-5 space-y-4">
                            {mode === "wallet" ? (
                                <div>
                                    <label className="block text-xs text-[#8f7768] mb-1.5">
                                        Recipient email or phone number
                                    </label>
                                    <input
                                        className={inputCls}
                                        placeholder="e.g. 08012345678"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs text-[#8f7768] mb-1.5">Bank</label>
                                        <select
                                            className={inputCls}
                                            value={bankCode}
                                            onChange={(e) => setBankCode(e.target.value)}
                                        >
                                            <option value="">Select bank</option>
                                            {banks.map((b) => (
                                                <option key={b.code} value={b.code}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#8f7768] mb-1.5">Account number</label>
                                        <input
                                            className={inputCls}
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholder="10-digit account number"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                        />
                                    </div>
                                </>
                            )}

                            {/* lookup result */}
                            {resolving && (
                                <p className="flex items-center gap-2 text-xs text-[#8f7768]">
                                    <Loader2 size={14} className="animate-spin" /> Checking account...
                                </p>
                            )}
                            {resolvedName && (
                                <p className="flex items-center gap-2 text-sm font-semibold text-[#f4b860]">
                                    <CheckCircle2 size={16} /> {resolvedName}
                                </p>
                            )}
                            {resolveError && <p className="text-xs text-red-400">{resolveError}</p>}

                            <div>
                                <label className="block text-xs text-[#8f7768] mb-1.5">Amount (₦)</label>
                                <input
                                    className={inputCls}
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
                                    }}
                                />
                                {amountTooLow && (
                                    <p className="mt-1.5 text-xs text-red-400">Minimum transfer is {naira(MIN_AMOUNT)}.</p>
                                )}
                                {insufficient && !amountTooLow && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        Insufficient balance{fee > 0 ? ` (amount + ${naira(fee)} fee)` : ""}.
                                    </p>
                                )}
                                {mode === "bank" && amountNum >= MIN_AMOUNT && (
                                    <p className="mt-1.5 text-xs text-[#8f7768]">Transfer fee: {naira(fee)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs text-[#8f7768] mb-1.5">Narration (optional)</label>
                                <input
                                    className={inputCls}
                                    maxLength={60}
                                    placeholder="What's this for?"
                                    value={narration}
                                    onChange={(e) => setNarration(e.target.value)}
                                />
                            </div>
                        </div>

                        <button className={primaryBtn} disabled={!canContinue} onClick={() => setStep("review")}>
                            Continue
                        </button>
                    </div>
                )}

                {/* ───────────── REVIEW + PIN ───────────── */}
                {step === "review" && (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] px-5 py-6 text-center">
                            <p className="text-xs text-[#8f7768] mb-1">You are sending</p>
                            <p className="font-serif text-4xl font-semibold text-[#fbf3ec]">{naira(amountNum)}</p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] px-5 divide-y divide-white/[0.06]">
                            {row("To", resolvedName)}
                            {mode === "bank"
                                ? row("Bank", `${bankName} · ${accountNumber}`)
                                : row("Wallet", identifier.trim())}
                            {narration && row("Narration", narration)}
                            {row("Fee", fee > 0 ? naira(fee) : "Free")}
                            {row("Total debit", naira(total))}
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] p-5">
                            <label className="block text-xs text-[#8f7768] mb-1.5">
                                Enter your {PIN_LENGTH}-digit transaction PIN
                            </label>
                            <input
                                className={`${inputCls} text-center tracking-[0.5em] text-lg`}
                                type="password"
                                inputMode="numeric"
                                autoComplete="off"
                                maxLength={PIN_LENGTH}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                            />
                            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
                        </div>

                        <button
                            className={primaryBtn}
                            disabled={pin.length !== PIN_LENGTH || submitting}
                            onClick={submit}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Sending...
                                </>
                            ) : (
                                `Send ${naira(amountNum)}`
                            )}
                        </button>
                    </div>
                )}

                {/* ───────────── SUCCESS ───────────── */}
                {step === "success" && (
                    <div className="space-y-5">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] px-5 py-8 text-center">
                            {result?.status === "PENDING" ? (
                                <Clock size={48} className="mx-auto text-[#f4b860]" />
                            ) : (
                                <CheckCircle2 size={48} className="mx-auto text-[#f4b860]" />
                            )}
                            <p className="mt-4 text-lg font-semibold text-[#fbf3ec]">
                                {result?.status === "PENDING" ? "Transfer processing" : "Transfer successful"}
                            </p>
                            <p className="mt-1 text-sm text-[#8f7768]">
                                {naira(amountNum)} to {resolvedName}
                            </p>
                            {result?.status === "PENDING" && (
                                <p className="mt-3 text-xs text-[#8f7768]">
                                    Your bank transfer is on its way. It will show in your transactions once confirmed.
                                </p>
                            )}
                        </div>

                        {result?.reference && (
                            <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] px-5">
                                {row("Reference", result.reference)}
                            </div>
                        )}

                        <Link href="/UserDashboard" className={primaryBtn}>
                            Done
                        </Link>
                        <button className={ghostBtn} onClick={reset}>
                            Send another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}