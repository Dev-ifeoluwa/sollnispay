// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";

// const SetPinCom: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email");
//   const [pin, setPin] = useState(["", "", "", ""]);

//   const handleChange = (value: string, index: number) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newPin = [...pin];
//       newPin[index] = value;
//       setPin(newPin);
//       if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
//     }
//   };



//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   const pinValue = pin.join("");
//   if (pinValue.length < 4) {
//     toast.error("Please enter a 4-digit PIN");
//     return;
//   }

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
//   const token = localStorage.getItem("token");
//   if (!token) {
//     toast.error("Please sign in first.");
//     router.push("/Account/Signin");
//     return;
//   }

//   try {
//     const res = await fetch(`${API_URL}/pin/set`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ pin: pinValue }),
//     });

//     if (res.ok) {
//       toast.success("PIN created successfully!");
//       router.push("/Account/Signin"); // or "/User/Dashboard", since they're already logged in
//     } else if (res.status === 401) {
//       toast.error("Session expired. Please sign in again.");
//       router.push("/Account/Signin");
//     } else {
//       const err = await res.json().catch(() => null);
//       const msg = Array.isArray(err?.message) ? err.message[0] : err?.message;
//       toast.error(msg ?? "Failed to create PIN. Please try again.");
//     }
//   } catch (err) {
//     toast.error("Something went wrong. Please try again later.");
//   }
// };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center"
//       >
//         <h2 className="text-lg font-semibold text-gray-900 mb-2">SET PIN</h2>
//         <p className="text-sm text-gray-600 mb-8">
//           Kindly enter the 4-digit PIN to transact on our platform.
//         </p>

//         <div className="flex justify-center gap-3 mb-8">
//           {pin.map((digit, i) => (
//             <input
//               key={i}
//               id={`pin-${i}`}
//               type="password"
//               maxLength={1}
//               value={digit}
//               onChange={(e) => handleChange(e.target.value, i)}
//               className="w-10 h-10 text-center text-lg font-semibold border-b-2 border-gray-300 focus:border-green-500 outline-none"
//             />
//           ))}
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 cursor-pointer bg-linear-to-r from-orange-700 bg-amber-900 text-white rounded-lg font-medium hover:opacity-90 transition"
//         >
//           Proceed
//         </button>
//       </form>
//       <Toaster position="top-center" reverseOrder={false} />
//     </div>
//   );
// };

// export default SetPinCom;









"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SetPinCom: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const pinValue = pin.join("");
    if (pinValue.length < 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in first.");
      router.push("/Account/Signin");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/pin/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin: pinValue }),
      });

      if (res.ok) {
        toast.success("PIN created successfully!");
        router.push("/Account/Signin"); // or "/User/Dashboard", since they're already logged in
      } else if (res.status === 401) {
        toast.error("Session expired. Please sign in again.");
        router.push("/Account/Signin");
      } else {
        const err = await res.json().catch(() => null);
        const msg = Array.isArray(err?.message) ? err.message[0] : err?.message;
        toast.error(msg ?? "Failed to create PIN. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col bg-orange-100">
        {/* Go back */}
        <span className="relative z-10 flex items-center justify-between px-4 pt-5 text-sm text-white">
          <p
            onClick={() => router.back()}
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
              <div className="mt-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#fbf1e8]">
                <ShieldCheck size={22} className="text-[#7a5b44]" />
              </div>
              <h1 className="mt-5 text-3xl font-semibold leading-tight text-white">
                Set your PIN
              </h1>
              <p className="mt-2 text-xs text-white/70">
                Choose a 4-digit PIN you&apos;ll use to confirm every transaction
                on Sollnispay.
              </p>

              {/* Form */}
              <form className="mt-8" onSubmit={handleSubmit}>
                <div className="mb-8 flex justify-center gap-3">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={1}
                      value={digit}
                      aria-label={`PIN digit ${i + 1}`}
                      onChange={(e) => handleChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className="h-14 w-12 rounded-lg bg-[#fbf1e8] text-center text-xl font-semibold text-[#3a2616] outline-none ring-2 ring-transparent transition focus:ring-[#c8864a]"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
                >
                  <span>{loading ? "Setting your PIN..." : "Proceed"}</span>
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

export default SetPinCom;