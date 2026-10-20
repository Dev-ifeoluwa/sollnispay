// "use client";

// import { ArrowLeft } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const Signin = () => {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);



//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

//   const handleSubmit = async (e: React.FormEvent) => {

//   if (loading) return;

//   setLoading(true);
  
//     e.preventDefault();
//     try {
//       // const res = await fetch('https://shalompay.onrender.com/auth/login', {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),

//       })
//       const data = await res.json();
//       const token = data.tokens?.accessToken
//       if (res.ok) {
//         localStorage.setItem('token', token);
//         // console.log("my token", token)
//         toast.success("Login successfully!")
//         console.log('Login successful!');
//         router.push("/UserDashboard");

//       } else {
//         toast.error("Invaild email or password")
//         console.error("Signin failed");
//       }
//     }
//     catch (error) {
//       toast.error("Something went wrong. Please try again later.");
//       console.error("Error during Login:", error);
//     }finally {
//        setLoading(false);
//    }
//   }

//   // const router = useRouter()
//   const HandleClick = () => {
//     router.push("/Account/loginaccount")
//   }

//   return (
//     <>
//       <div className="flex flex-col bg-orange-100">
//         <span className="flex justify-between px-2 text-sm pt-5 items-center">
//           <p className="flex items-center gap-3">
//             <ArrowLeft
//               onClick={HandleClick}
//               className="cursor-pointer"
//               size={20} />
//             <p className="font-semibold">Go Back</p>
//           </p>
//         </span>
//         <div className="flex flex-col items-center justify-center min-h-screen">
//           <div className="flex items-center gap-4 px-auto mx-auto pb-6 ">
//             <Image
//               src="/favicon.ico"
//               alt="Logo"
//               width={40}
//               height={40}
//               className="rounded-full bg-orange-100"
//             />
//             <h2 className="text-2xl font-bold">Sollnispay</h2>
//           </div>
//           <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
//             {/* Header */}
//             <div className="flex flex-col items-center mb-4">
//               {/* <div>
//               <Image src="/favicon.ico" alt="Logo" width={72} height={72} />
//             </div> */}
//               <h2 className="text-lg font-semibold mt-3 text-gray-800">
//                 Login to your account
//               </h2>
//             </div>

//             {/* Form */}
//             <form className="space-y-10" onSubmit={handleSubmit}>
//               {/* Email */}
//               <input
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="Email Address"
//                 className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
//               />

//               {/* Mobile & Password */}
//               <div>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     placeholder="Enter Password"
//                     className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1 pr-8"
//                   />

//                   {/* Toggle Icon */}
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? (
//                       // Eye open
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.712 2.257-2.3 4.152-4.323 5.322M15 15a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                     ) : (
//                       // Eye closed
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="w-5 h-5"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M3 3l18 18M4.5 4.5a9.473 9.473 0 0113.5 0M3 12a9 9 0 0118 0"
//                         />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Login Button */}
//               <button
//                type="submit"
//                disabled={loading}
//                className="bg-linear-to-r from-orange-700 bg-amber-900 cursor-pointer flex w-full items-center justify-center gap-1 rounded-xl px-5 py-2 font-semibold text-white transition duration-300 hover:bg-gray-900 disabled:opacity-60"
//                 >
//                <span>{loading ? "Signing you in..." : "Sign in"}</span>

//                {!loading && (
//                  <ArrowLeft
//                    size={18}
//                    className="rotate-180 transition-transform duration-300 group-hover:translate-x-1"
//                  />
//                )}
//              </button>
//               <Link href="/Account/SignUp" className="text-sm text-gray-700 hover:underline -mt-6 block text-center">New to Sollnispay? <strong className="text-orange-900">Sign Up</strong></Link>
//             </form>
//           </div>
//           <Toaster position="top-center" reverseOrder={false} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Signin;












"use client";

import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Signin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      const token = data.tokens?.accessToken;
      if (res.ok) {
        localStorage.setItem("token", token);
        toast.success("Login successfully!");
        console.log("Login successful!");
        router.push("/UserDashboard");
      } else {
        toast.error("Invaild email or password");
        console.error("Signin failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Error during Login:", error);
    } finally {
      setLoading(false);
    }
  };

  const HandleClick = () => {
    router.push("/Account/loginaccount");
  };

  return (
    <>
      <div className="relative flex flex-col bg-orange-100">
        {/* Go back */}
        {/* <span className="relative z-10 flex items-center justify-between px-4 pt-5 text-sm text-black">
          <p
            onClick={HandleClick}
            className="flex cursor-pointer items-center gap-3"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Go Back</span>
          </p>
        </span> */}

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
              <h1 className="mt-10 text-3xl font-semibold leading-tight text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-xs text-white/70">
                Sign in to Sollnispay and pick up where you left off.
              </p>

              {/* Form */}
              <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-medium text-white"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]"
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-lg bg-[#fbf1e8] py-2.5 pl-9 pr-3 text-xs text-[#3a2616] outline-none ring-2 ring-transparent transition placeholder:text-[#a89484] focus:ring-[#c8864a]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a5b44]"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full rounded-lg bg-[#fbf1e8] py-2.5 pl-9 pr-10 text-xs text-[#3a2616] outline-none ring-2 ring-transparent transition placeholder:text-[#a89484] focus:ring-[#c8864a]"
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

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
                >
                  <span>{loading ? "Signing you in..." : "Sign in"}</span>
                </button>

                
              </form>

              {/* Footer */}
              <Link
                href="/Account/SignUp"
                className="mt-7 block text-center text-[11px] text-white/70 hover:underline"
              >
                New to Sollnispay?{" "}
                <strong className="font-semibold text-white">Sign Up</strong>
              </Link>
            </div>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Signin;