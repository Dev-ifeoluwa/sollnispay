// "use client";

// import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const RESEND_SECONDS = 60;

// const ResetPassword = () => {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [resending, setResending] = useState(false);
//   const [cooldown, setCooldown] = useState(RESEND_SECONDS);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//   // email comes from the Forgot Password page; if it's missing, go back there
//   useEffect(() => {
//     const saved = sessionStorage.getItem("resetEmail");
//     if (!saved) {
//       router.replace("/Account/ForgotPassword");
//       return;
//     }
//     setEmail(saved);
//   }, [router]);

//   // resend countdown
//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
//     return () => clearTimeout(t);
//   }, [cooldown]);

//   const handleOtpChange = (value: string, index: number) => {
//     if (/^[0-9]?$/.test(value)) {
//       const next = [...otp];
//       next[index] = value;
//       setOtp(next);
//       if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   // paste the whole code at once
//   const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
//     if (!digits) return;
//     e.preventDefault();
//     const next = ["", "", "", "", "", ""];
//     digits.split("").forEach((d, i) => (next[i] = d));
//     setOtp(next);
//     document.getElementById(`otp-${Math.min(digits.length, 5)}`)?.focus();
//   };

//   const handleResend = async () => {
//     if (cooldown > 0 || resending) return;
//     setResending(true);
//     try {
//       const res = await fetch(`${API_URL}/auth/forgot-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });
//       if (res.ok) {
//         toast.success("If that email is registered, we've sent a new code.");
//         setOtp(["", "", "", "", "", ""]);
//         setCooldown(RESEND_SECONDS);
//         document.getElementById("otp-0")?.focus();
//       } else if (res.status === 429) {
//         toast.error("Too many requests. Please wait a minute and try again.");
//       } else {
//         toast.error("Could not resend the code. Please try again.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again later.");
//     } finally {
//       setResending(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (loading) return;

//     const code = otp.join("");
//     if (code.length < 6) {
//       toast.error("Please enter the 6-digit code.");
//       return;
//     }
//     if (newPassword.length < 8) {
//       toast.error("Password must be at least 8 characters.");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_URL}/auth/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp: code, newPassword }),
//       });
//       const data = await res.json().catch(() => null);

//       if (res.ok) {
//         sessionStorage.removeItem("resetEmail");
//         toast.success("Password reset successful. Please sign in.");
//         router.push("/Account/Signin");
//       } else if (res.status === 429) {
//         toast.error("Too many attempts. Please wait a minute and try again.");
//       } else {
//         const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
//         toast.error(msg ?? "Could not reset password. Please try again.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const passwordInputClass =
//     "w-full rounded-lg bg-[#fbf1e8] py-2.5 pl-9 pr-10 text-xs text-[#3a2616] outline-none ring-2 ring-transparent transition placeholder:text-[#a89484] focus:ring-[#c8864a]";

//   return (
//     <>
//       <div className="relative flex min-h-screen flex-col bg-orange-100">
//         {/* Go back */}
//         <span className="relative z-10 flex items-center justify-between px-4 pt-5 text-sm text-black">
//           <p
//             onClick={() => router.push("/Account/Forgot-password")}
//             className="flex cursor-pointer items-center gap-3"
//           >
//             <ArrowLeft size={20} />
//             <span className="font-semibold">Go Back</span>
//           </p>
//         </span>

//         <div className="flex flex-1 items-center justify-center px-4 py-8">
//           {/* Card */}
//           <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#1a0d05] via-[#4a2a12] to-[#140a04] px-7 py-8 shadow-2xl">
//             {/* Silk glow effects */}
//             <div className="pointer-events-none absolute -right-16 top-10 h-72 w-40 rotate-[28deg] rounded-full bg-[#d49a5a]/30 blur-3xl" />
//             <div className="pointer-events-none absolute -left-20 bottom-20 h-64 w-40 -rotate-[20deg] rounded-full bg-[#8a4f1f]/40 blur-3xl" />
//             <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-[#c88a4a]/10 to-transparent" />

//             <div className="relative z-10">
//               {/* Logo */}
//               <div className="flex items-center gap-2">
//                 <Image
//                   src="/favicon.ico"
//                   alt="Logo"
//                   width={24}
//                   height={24}
//                   className="rounded-full"
//                 />
//                 <h2 className="text-sm font-semibold text-white">Sollnispay</h2>
//               </div>

//               {/* Heading */}
//               <h1 className="mt-8 text-3xl font-semibold leading-tight text-white">
//                 Reset your password
//               </h1>
//               <p className="mt-2 text-xs text-white/70">
//                 Enter the 6-digit code we sent to{" "}
//                 <span className="font-semibold text-white">{email}</span>, then
//                 choose a new password. The code expires in 10 minutes.
//               </p>

//               {/* Form */}
//               <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
//                 {/* OTP boxes */}
//                 <div>
//                   <label className="mb-1.5 block text-[11px] font-medium text-white">
//                     Verification code
//                   </label>
//                   <div className="flex justify-between gap-2">
//                     {otp.map((digit, i) => (
//                       <input
//                         key={i}
//                         id={`otp-${i}`}
//                         type="text"
//                         inputMode="numeric"
//                         autoComplete={i === 0 ? "one-time-code" : "off"}
//                         maxLength={1}
//                         value={digit}
//                         aria-label={`Code digit ${i + 1}`}
//                         onChange={(e) => handleOtpChange(e.target.value, i)}
//                         onKeyDown={(e) => handleOtpKeyDown(e, i)}
//                         onPaste={handleOtpPaste}
//                         className="h-12 w-10 rounded-lg bg-[#fbf1e8] text-center text-lg font-semibold text-[#3a2616] outline-none ring-2 ring-transparent transition focus:ring-[#c8864a]"
//                       />
//                     ))}
//                   </div>
//                   <div className="mt-2 text-right text-[11px] text-white/70">
//                     {cooldown > 0 ? (
//                       <span>Resend code in {cooldown}s</span>
//                     ) : (
//                       <button
//                         type="button"
//                         onClick={handleResend}
//                         disabled={resending}
//                         className="cursor-pointer font-semibold text-white hover:underline disabled:opacity-60"
//                       >
//                         {resending ? "Sending..." : "Resend code"}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* New password */}
//                 <div>
//                   <label
//                     htmlFor="newPassword"
//                     className="mb-1.5 block text-[11px] font-medium text-white"
//                   >
//                     New password
//                   </label>
//                   <div className="relative">
//                     <Lock
//                       size={14}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]"
//                     />
//                     <input
//                       id="newPassword"
//                       type={showPassword ? "text" : "password"}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       placeholder="At least 8 characters"
//                       required
//                       className={passwordInputClass}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       aria-label={showPassword ? "Hide password" : "Show password"}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89484] hover:text-[#7a5b44]"
//                     >
//                       {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm password */}
//                 <div>
//                   <label
//                     htmlFor="confirmPassword"
//                     className="mb-1.5 block text-[11px] font-medium text-white"
//                   >
//                     Confirm new password
//                   </label>
//                   <div className="relative">
//                     <Lock
//                       size={14}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]"
//                     />
//                     <input
//                       id="confirmPassword"
//                       type={showPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="Repeat new password"
//                       required
//                       className={passwordInputClass}
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
//                 >
//                   <span>{loading ? "Resetting..." : "Reset password"}</span>
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//         <Toaster position="top-center" reverseOrder={false} />
//       </div>
//     </>
//   );
// };

// export default ResetPassword;









"use client";

import PasswordChecklist, { isStrongPassword } from "components/PasswordChecklist";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


const RESEND_SECONDS = 60;

const ResetPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // email comes from the Forgot Password page; if it's missing, go back there
  useEffect(() => {
    const saved = sessionStorage.getItem("resetEmail");
    if (!saved) {
      router.replace("/Account/ForgotPassword");
      return;
    }
    setEmail(saved);
  }, [router]);

  // resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleOtpChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // paste the whole code at once
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    digits.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    document.getElementById(`otp-${Math.min(digits.length, 5)}`)?.focus();
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("If that email is registered, we've sent a new code.");
        setOtp(["", "", "", "", "", ""]);
        setCooldown(RESEND_SECONDS);
        document.getElementById("otp-0")?.focus();
      } else if (res.status === 429) {
        toast.error("Too many requests. Please wait a minute and try again.");
      } else {
        toast.error("Could not resend the code. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      toast.error("Please choose a stronger password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, newPassword }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        sessionStorage.removeItem("resetEmail");
        toast.success("Password reset successful. Please sign in.");
        router.push("/Account/Signin");
      } else if (res.status === 429) {
        toast.error("Too many attempts. Please wait a minute and try again.");
      } else {
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        toast.error(msg ?? "Could not reset password. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const passwordInputClass =
    "w-full rounded-lg bg-[#fbf1e8] py-2.5 pl-9 pr-10 text-xs text-[#3a2616] outline-none ring-2 ring-transparent transition placeholder:text-[#a89484] focus:ring-[#c8864a]";

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-black">
        {/* Go back */}
        <span className="relative z-10 flex items-center justify-between px-4 pt-5 text-sm text-white">
          <p
            onClick={() => router.push("/Account/ForgotPassword")}
            className="flex cursor-pointer items-center gap-3"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Go Back</span>
          </p>
        </span>

        <div className="flex flex-1 items-center justify-center px-4 py-8">
          {/* Card */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-sm border border-white/5 bg-linear-to-br from-[#1a0d05] via-[#4a2a12] to-[#140a04] px-7 py-8 shadow-2xl">
            {/* Silk glow effects */}
            <div className="pointer-events-none absolute -right-16 top-10 h-72 w-40 rotate-[28deg] rounded-full bg-[#d49a5a]/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-20 h-64 w-40 -rotate-[20deg] rounded-full bg-[#8a4f1f]/40 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-linear-to-l from-[#c88a4a]/10 to-transparent" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Image
                  src="/favicon.ico"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <h2 className="text-sm font-semibold text-white">Sollnispay</h2>
              </div>

              {/* Heading */}
              <h1 className="mt-8 text-3xl font-semibold leading-tight text-white">
                Reset your password
              </h1>
              <p className="mt-2 text-xs text-white/70">
                Enter the 6-digit code we sent to{" "}
                <span className="font-semibold text-white">{email}</span>, then
                choose a new password. The code expires in 10 minutes.
              </p>

              {/* Form */}
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                {/* OTP boxes */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium text-white">
                    Verification code
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit}
                        aria-label={`Code digit ${i + 1}`}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        onPaste={handleOtpPaste}
                        className="h-12 w-10 rounded-lg bg-[#fbf1e8] text-center text-lg font-semibold text-[#3a2616] outline-none ring-2 ring-transparent transition focus:ring-[#c8864a]"
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-right text-[11px] text-white/70">
                    {cooldown > 0 ? (
                      <span>Resend code in {cooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="cursor-pointer font-semibold text-white hover:underline disabled:opacity-60"
                      >
                        {resending ? "Sending..." : "Resend code"}
                      </button>
                    )}
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1.5 block text-[11px] font-medium text-white"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]"
                    />
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89484] hover:text-[#7a5b44]"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  <PasswordChecklist password={newPassword} />
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-[11px] font-medium text-white"
                  >
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]"
                    />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      className={passwordInputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
                >
                  <span>{loading ? "Resetting..." : "Reset password"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default ResetPassword;