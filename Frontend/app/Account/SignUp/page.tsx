// "use client";

// import { ArrowLeft } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const Signup = () => {
//   const router = useRouter();

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);


//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

//   const handleSubmit = async (e: React.FormEvent) => {

//   if (loading) return;

//   setLoading(true);

//   e.preventDefault();
//   try {
//     const res = await fetch(`${API_URL}/auth/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ firstName, lastName, email, password, phoneNumber }),
//     });
//     const data = await res.json().catch(() => null);

//     if (res.ok && data?.tokens?.accessToken) {
//       localStorage.setItem("token", data.tokens.accessToken);
//       toast.success("Account created successfully!");
//       router.push("/Account/CreatePin");
//     } else {
//       const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
//       toast.error(msg ?? "Registration failed. Please try again.");
//     }
//   } catch (error) {
//     toast.error("Something went wrong. Please try again later.");
//   }finally {
//        setLoading(false);
//    }
// };


  

  

//   return (
//     <div className="flex flex-col items-center px-2 py-15 justify-center min-h-screen bg-orange-100">
//       <div className="flex items-center gap-4 px-auto mx-auto pb-6 ">
//         <Image
//           src="/favicon.ico"
//           alt="Logo"
//           width={40}
//           height={40}
//           className="rounded-full bg-orange-100"
//         />
//         <h2 className="text-2xl font-bold">Sollnispay</h2>
//       </div>
//       <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
//         {/* Header */}
//         <div className="flex flex-col items-center mb-4">
//           <h2 className="text-lg font-semibold mt-3 text-gray-800">
//             Create Account
//           </h2>
//           <p className="text-gray-400 text-md md:text-base mb-7">Let's get you started with your sollnispay account.</p>
//         </div>

//         {/* Form */}
//         <form className="space-y-10" onSubmit={handleSubmit}>
//           {/* First and Last Name */}
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               type="text"
//               value={firstName}
//               onChange={e => setFirstName(e.target.value)}
//               placeholder="Firstname"
//               className="border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
//             />
//             <input
//               type="text"
//               value={lastName}
//               onChange={e => setLastName(e.target.value)}
//               placeholder="Lastname"
//               className="border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
//             />
//           </div>

//           {/* Email */}
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             placeholder="Email Address"
//             className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
//           />

//           {/* Mobile & Password */}
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               type="tel"
//               value={phoneNumber}
//               onChange={e => setPhoneNumber(e.target.value)}
//               placeholder="Mobile Number"
//               className="border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 placeholder="Create Password"
//                 className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1 pr-8"
//               />

//               {/* Toggle Icon */}
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? (
//                   // Eye open
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-5 h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.712 2.257-2.3 4.152-4.323 5.322M15 15a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 ) : (
//                   // Eye closed
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.5}
//                     stroke="currentColor"
//                     className="w-5 h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3 3l18 18M4.5 4.5a9.473 9.473 0 0113.5 0M3 12a9 9 0 0118 0"
//                     />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Referral Code */}
//           <input
//             type="text"
//             placeholder="Referral Code (Optional)"
//             className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
//           />

//           {/* Register Button */}
//           <button
//                type="submit"
//                disabled={loading}
//                className="bg-linear-to-r from-orange-700 bg-amber-900 cursor-pointer flex w-full items-center justify-center gap-1 rounded-xl px-5 py-2 font-semibold text-white transition duration-300 hover:bg-gray-900 disabled:opacity-60"
//                 >
//                <span>{loading ? "Signing you up..." : "Sign up"}</span>

//                {!loading && (
//                  <ArrowLeft
//                    size={18}
//                    className="rotate-180 transition-transform duration-300 group-hover:translate-x-1"
//                  />
//                )}
//              </button>
//           <Link href="/Account/Signin" className="text-sm text-gray-700 hover:underline -mt-5 block text-center">Already have an account? <strong className="text-orange-900">Login</strong></Link>
//         </form>
//       </div>
//       <Toaster position="top-center" reverseOrder={false} />
//     </div>
//   );
// };

// export default Signup;









"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
      <div className="relative flex min-h-screen flex-col bg-white">
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
                Let's get you started with your sollnispay account.
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
                        placeholder="Henry"
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
                        placeholder="Godwin"
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

                {/* Divider */}
                {/* <div className="flex items-center gap-3 pt-2">
                  <span className="h-px flex-1 bg-white/20" />
                  <span className="text-[10px] text-white/60">
                    Or sign up with
                  </span>
                  <span className="h-px flex-1 bg-white/20" />
                </div> */}

                {/* Social buttons */}
                
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