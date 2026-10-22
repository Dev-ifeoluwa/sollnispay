"use client";

import { Eye, EyeOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const RESEND_SECONDS = 60;
const EMPTY_OTP = ["", "", "", "", "", ""];

// Same pattern as your other pages: token from localStorage, sent as a Bearer header.
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

// Same "too easy to guess" rule the backend enforces (the backend is the real gatekeeper).
const isWeakPin = (pin: string) => {
  const d = pin.split("").map(Number);
  const allSame = /^(\d)\1{3}$/.test(pin); // 1111
  const repeatedPair = /^(\d\d)\1$/.test(pin); // 1212
  const ascending = d.every((x, i) => i === 0 || x === d[i - 1] + 1); // 1234
  const descending = d.every((x, i) => i === 0 || x === d[i - 1] - 1); // 4321
  return allSame || repeatedPair || ascending || descending;
};

const errorMessage = (data: any, fallback: string) =>
  (Array.isArray(data?.message) ? data.message[0] : data?.message) || fallback;

type Props = {
  open: boolean;
  onClose: () => void;
  /** called after the PIN was reset, so the page can clear its PIN boxes */
  onDone: () => void;
};

export default function ForgotPinSheet({ open, onClose, onDone }: Props) {
  const router = useRouter();

  const [step, setStep] = useState<"send" | "reset">("send");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState(EMPTY_OTP);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // start fresh every time the sheet opens
  useEffect(() => {
    if (!open) return;
    setStep("send");
    setMaskedEmail("");
    setOtp(EMPTY_OTP);
    setPassword("");
    setShowPassword(false);
    setNewPin("");
    setConfirmPin("");
    setCooldown(0);
  }, [open]);

  // resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!open) return null;

  const sessionExpired = () => {
    toast.error("Your session expired. Log in again.");
    router.push("/Account/Signin");
  };

  const goToReset = () => {
    setStep("reset");
    setCooldown(RESEND_SECONDS);
    setOtp(EMPTY_OTP);
    setTimeout(() => document.getElementById("fp-otp-0")?.focus(), 50);
  };

  // Step 1 (and "Resend code"): email a 6-digit code to the account's own email
  const sendCode = async () => {
    if (sending || cooldown > 0) return;
    setSending(true);
    try {
      const res = await apiFetch("/pin/forgot", { method: "POST" });
      const data = await res.json().catch(() => null);

      if (res.status === 401) return sessionExpired();

      if (res.ok) {
        setMaskedEmail(data?.email ?? "");
        toast.success("We sent a 6-digit code to your email.");
        goToReset();
      } else if (res.status === 429) {
        // a code was sent less than a minute ago, so just move on to entering it
        toast.error("A code was sent a moment ago. Check your email.");
        goToReset();
      } else {
        toast.error(errorMessage(data, "Could not send the code. Please try again."));
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) document.getElementById(`fp-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`fp-otp-${index - 1}`)?.focus();
    }
  };

  // paste the whole code at once
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const next = [...EMPTY_OTP];
    digits.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    document.getElementById(`fp-otp-${Math.min(digits.length, 5)}`)?.focus();
  };

  // Step 2: code + account password + new PIN
  const submitReset = async () => {
    if (submitting) return;

    const code = otp.join("");
    if (code.length < 6) return void toast.error("Enter the 6-digit code.");
    if (!password) return void toast.error("Enter your account password.");
    if (!/^\d{4}$/.test(newPin)) return void toast.error("New PIN must be 4 digits.");
    if (isWeakPin(newPin)) {
      return void toast.error("That PIN is too easy to guess. Avoid 1111, 1234 or 1212.");
    }
    if (newPin !== confirmPin) return void toast.error("PINs do not match.");

    setSubmitting(true);
    try {
      const res = await apiFetch("/pin/reset", {
        method: "POST",
        body: JSON.stringify({ otp: code, password, newPin }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 401) return sessionExpired();

      if (res.ok) {
        toast.success("PIN reset. Enter your new PIN to continue.");
        onDone();
      } else {
        toast.error(errorMessage(data, "Could not reset your PIN. Please try again."));
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeSheet = () => {
    if (submitting) return;
    onClose();
  };

  const fieldClass =
    "w-full rounded-xl bg-white/[0.06] border border-white/[0.1] px-3 py-3 text-sm text-[#fbf3ec] placeholder:text-[#8f7768] outline-none focus:border-[#ff7a3d]";
  const labelClass = "mb-1.5 block text-xs font-semibold text-[#d8c3b6]";

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/70 backdrop-blur-[3px]">
      <div className="mx-auto max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/[0.08] bg-[#1e100a] p-5 sm:p-6 md:max-w-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="font-serif text-base font-semibold italic text-[#fbf3ec]">
            Reset your PIN
          </p>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#d8c3b6]"
          >
            <X size={15} />
          </button>
        </div>

        {step === "send" ? (
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed text-[#8f7768]">
              We&apos;ll email a 6-digit code to the address on your account. You&apos;ll
              then enter the code, your account password and a new 4-digit PIN.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeSheet}
                className="flex-1 rounded-xl border border-white/[0.1] py-3 text-sm font-bold text-[#fbf3ec]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendCode}
                disabled={sending}
                className="flex-1 rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] py-3 text-sm font-bold text-[#1a0d05] shadow-lg shadow-orange-900/40 disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send code"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs leading-relaxed text-[#8f7768]">
              Enter the code we sent
              {maskedEmail ? (
                <>
                  {" "}to <span className="font-semibold text-[#fbf3ec]">{maskedEmail}</span>
                </>
              ) : null}
              . It expires in 10 minutes.
            </p>

            {/* OTP boxes */}
            <div>
              <label className={labelClass}>Verification code</label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`fp-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    aria-label={`Code digit ${i + 1}`}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handleOtpPaste}
                    className="h-11 w-10 rounded-xl border border-white/[0.1] bg-white/[0.06] text-center text-lg font-semibold text-[#fbf3ec] outline-none focus:border-[#ff7a3d]"
                  />
                ))}
              </div>
              <div className="mt-2 text-right text-xs text-[#8f7768]">
                {cooldown > 0 ? (
                  <span>Resend code in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={sending}
                    className="font-semibold text-[#ff7a3d] disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Resend code"}
                  </button>
                )}
              </div>
            </div>

            {/* Account password */}
            <div>
              <label htmlFor="fp-password" className={labelClass}>
                Account password
              </label>
              <div className="relative">
                <input
                  id="fp-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="The password you log in with"
                  autoComplete="current-password"
                  className={`${fieldClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f7768] hover:text-[#fbf3ec]"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* New PIN + confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="fp-new-pin" className={labelClass}>
                  New PIN
                </label>
                <input
                  id="fp-new-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="4 digits"
                  className={`${fieldClass} text-center tracking-[0.4em]`}
                />
              </div>
              <div>
                <label htmlFor="fp-confirm-pin" className={labelClass}>
                  Confirm PIN
                </label>
                <input
                  id="fp-confirm-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Repeat"
                  className={`${fieldClass} text-center tracking-[0.4em]`}
                />
              </div>
            </div>

            <div className="mt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={closeSheet}
                disabled={submitting}
                className="flex-1 rounded-xl border border-white/[0.1] py-3 text-sm font-bold text-[#fbf3ec] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReset}
                disabled={submitting}
                className="flex-1 rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] py-3 text-sm font-bold text-[#1a0d05] shadow-lg shadow-orange-900/40 disabled:opacity-60"
              >
                {submitting ? "Resetting…" : "Reset PIN"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}