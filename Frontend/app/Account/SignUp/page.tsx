// "use client";

// import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const inputClass =
//   "w-full rounded-lg bg-[#fbf1e8] py-2.5 pl-9 pr-3 text-xs text-[#3a2616] outline-none ring-2 ring-transparent transition placeholder:text-[#a89484] focus:ring-[#c8864a]";
// const iconClass =
//   "absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]";
// const labelClass = "mb-1.5 block text-[11px] font-medium text-white";

// const Signup = () => {
//   const router = useRouter();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [referralCode, setReferralCode] = useState("");
//   const [agreed, setAgreed] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (loading) return;

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     if (!agreed) {
//       toast.error("Please agree to the Terms of Service and Privacy Policy.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firstName,
//           lastName,
//           email,
//           password,
//           phoneNumber,
//         }),
//       });
//       const data = await res.json().catch(() => null);

//       if (res.ok && data?.tokens?.accessToken) {
//         localStorage.setItem("token", data.tokens.accessToken);
//         toast.success("Account created successfully!");
//         router.push("/Account/CreatePin");
//       } else {
//         const msg = Array.isArray(data?.message)
//           ? data.message[0]
//           : data?.message;
//         toast.error(msg ?? "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const HandleClick = () => {
//     router.push("/Account/loginaccount");
//   };

//   return (
//     <>
//       <div className="relative flex min-h-screen flex-col bg-orange-100">
//         {/* Go back */}
//         <span className="relative z-10 flex items-center justify-between px-4 pt-5 text-sm text-black">
//           <p
//             onClick={HandleClick}
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
//                 Create your account
//               </h1>
//               <p className="mt-2 text-xs text-white/70">
//                 Let's get you started with your sollnispay account.
//               </p>

//               {/* Form */}
//               <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
//                 {/* First and Last Name */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label htmlFor="firstName" className={labelClass}>
//                       First name
//                     </label>
//                     <div className="relative">
//                       <User size={14} className={iconClass} />
//                       <input
//                         id="firstName"
//                         type="text"
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                         placeholder="Henry"
//                         required
//                         className={inputClass}
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label htmlFor="lastName" className={labelClass}>
//                       Last name
//                     </label>
//                     <div className="relative">
//                       <User size={14} className={iconClass} />
//                       <input
//                         id="lastName"
//                         type="text"
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                         placeholder="Godwin"
//                         required
//                         className={inputClass}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label htmlFor="email" className={labelClass}>
//                     Email
//                   </label>
//                   <div className="relative">
//                     <Mail size={14} className={iconClass} />
//                     <input
//                       id="email"
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="you@example.com"
//                       required
//                       className={inputClass}
//                     />
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label htmlFor="phoneNumber" className={labelClass}>
//                     Mobile number
//                   </label>
//                   <div className="relative">
//                     <Phone size={14} className={iconClass} />
//                     <input
//                       id="phoneNumber"
//                       type="tel"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                       placeholder="08012345678"
//                       required
//                       className={inputClass}
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label htmlFor="password" className={labelClass}>
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Lock size={14} className={iconClass} />
//                     <input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Create password"
//                       required
//                       className={`${inputClass} pr-10`}
//                     />

//                     {/* Toggle Icon */}
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

//                 {/* Confirm Password */}
//                 <div>
//                   <label htmlFor="confirmPassword" className={labelClass}>
//                     Confirm password
//                   </label>
//                   <div className="relative">
//                     <Lock size={14} className={iconClass} />
//                     <input
//                       id="confirmPassword"
//                       type={showPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="Repeat password"
//                       required
//                       className={inputClass}
//                     />
//                   </div>
//                 </div>

//                 {/* Referral Code */}
//                 <div>
//                   <label htmlFor="referralCode" className={labelClass}>
//                     Referral code (optional)
//                   </label>
//                   <div className="relative">
//                     <User size={14} className={iconClass} />
//                     <input
//                       id="referralCode"
//                       type="text"
//                       value={referralCode}
//                       onChange={(e) => setReferralCode(e.target.value)}
//                       placeholder="Enter referral code"
//                       className={inputClass}
//                     />
//                   </div>
//                 </div>

//                 {/* Terms */}
//                 <label className="flex cursor-pointer items-center gap-2 text-[10px] text-white/80">
//                   <input
//                     type="checkbox"
//                     checked={agreed}
//                     onChange={(e) => setAgreed(e.target.checked)}
//                     className="h-3.5 w-3.5 cursor-pointer accent-[#b9763c]"
//                   />
//                   <span>
//                     I agree to the{" "}
//                     <span className="underline">Terms of Service</span> and{" "}
//                     <span className="underline">Privacy Policy</span>
//                   </span>
//                 </label>

//                 {/* Register Button */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
//                 >
//                   <span>{loading ? "Signing you up..." : "Create account"}</span>
//                 </button>

//                 {/* Divider */}
//                 {/* <div className="flex items-center gap-3 pt-2">
//                   <span className="h-px flex-1 bg-white/20" />
//                   <span className="text-[10px] text-white/60">
//                     Or sign up with
//                   </span>
//                   <span className="h-px flex-1 bg-white/20" />
//                 </div> */}

//                 {/* Social buttons */}
                
//               </form>

//               {/* Footer */}
//               <Link
//                 href="/Account/Signin"
//                 className="mt-7 block text-center text-[11px] text-white/70 hover:underline"
//               >
//                 Already have an account?{" "}
//                 <strong className="font-semibold text-white">Login</strong>
//               </Link>
//             </div>
//           </div>
//         </div>
//         <Toaster position="top-center" reverseOrder={false} />
//       </div>
//     </>
//   );
// };

// export default Signup;





"use client";

import PasswordChecklist, { isStrongPassword } from "components/PasswordChecklist";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import PasswordChecklist, { isStrongPassword } from "@/components/PasswordChecklist";

const inputClass =
  "w-full rounded-lg bg-[#fbf1e8] py-2.5 pl-9 pr-3 text-xs text-[#3a2616] outline-none ring-2 ring-transparent transition placeholder:text-[#a89484] focus:ring-[#c8864a]";
const iconClass =
  "absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]";
const labelClass = "mb-1.5 block text-[11px] font-medium text-white";

const Signup = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!isStrongPassword(password)) {
      toast.error("Please choose a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!agreed) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.tokens?.accessToken) {
        localStorage.setItem("token", data.tokens.accessToken);
        toast.success("Account created successfully!");
        router.push("/Account/CreatePin");
      } else {
        const msg = Array.isArray(data?.message)
          ? data.message[0]
          : data?.message;
        toast.error(msg ?? "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const HandleClick = () => {
    router.push("/Account/loginaccount");
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-orange-100">
        {/* Go back */}
        <span className="relative z-10 flex items-center justify-between px-4 pt-5 text-sm text-black">
          <p
            onClick={HandleClick}
            className="flex cursor-pointer items-center gap-3"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Go Back</span>
          </p>
        </span>

        <div className="flex flex-1 items-center justify-center px-4 py-8">
          {/* Card */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/5 bg-linear-to-br from-[#1a0d05] via-[#4a2a12] to-[#140a04] px-7 py-8 shadow-2xl">
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
                Create your account
              </h1>
              <p className="mt-2 text-xs text-white/70">
                Join Sollnispay and get started on your journey today.
              </p>

              {/* Form */}
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {/* First and Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First name
                    </label>
                    <div className="relative">
                      <User size={14} className={iconClass} />
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last name
                    </label>
                    <div className="relative">
                      <User size={14} className={iconClass} />
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className={iconClass} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phoneNumber" className={labelClass}>
                    Mobile number
                  </label>
                  <div className="relative">
                    <Phone size={14} className={iconClass} />
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08012345678"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className={iconClass} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      required
                      className={`${inputClass} pr-10`}
                    />

                    {/* Toggle Icon */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89484] hover:text-[#7a5b44]"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  <PasswordChecklist password={password} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock size={14} className={iconClass} />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Referral Code */}
                <div>
                  <label htmlFor="referralCode" className={labelClass}>
                    Referral code (optional)
                  </label>
                  <div className="relative">
                    <User size={14} className={iconClass} />
                    <input
                      id="referralCode"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-center gap-2 text-[10px] text-white/80">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-3.5 w-3.5 cursor-pointer accent-[#b9763c]"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="underline">Terms of Service</span> and{" "}
                    <span className="underline">Privacy Policy</span>
                  </span>
                </label>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
                >
                  <span>{loading ? "Signing you up..." : "Create account"}</span>
                </button>


              </form>

              {/* Footer */}
              <Link
                href="/Account/Signin"
                className="mt-7 block text-center text-[11px] text-white/70 hover:underline"
              >
                Already have an account?{" "}
                <strong className="font-semibold text-white">Login</strong>
              </Link>
            </div>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Signup;