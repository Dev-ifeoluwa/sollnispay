"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SetPinCom: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [pin, setPin] = useState(["", "", "", ""]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3) document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const transactionPin = pin.join("");

  //   if (transactionPin.length < 4) {
  //     alert("Please enter a 4-digit PIN");
  //     return;
  //   }

  //   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  //   try {
  //     const res = await fetch(`${API_URL}/pin/set`, {
  //     // const res = await fetch('https://shalompay.onrender.com/auth/setPin', {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, transactionPin }),
  //     });

  //     if (res.ok) {
  //       toast.success("Pin created successfully!");
  //       router.push("/Account/Signin");
  //     } else {
  //       toast.error("Fail to create pin. Please try again.");
  //       console.error("Failed to set PIN");
  //     }
  //   } catch (err) {
  //     toast.error("Something went wrong. Please try again later.");
  //     console.error("Error:", err);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
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
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm text-center"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">SET PIN</h2>
        <p className="text-sm text-gray-600 mb-8">
          Kindly enter the 4-digit PIN to transact on our platform.
        </p>

        <div className="flex justify-center gap-3 mb-8">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-10 h-10 text-center text-lg font-semibold border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 cursor-pointer bg-linear-to-r from-orange-700 bg-amber-900 text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Proceed
        </button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default SetPinCom;
