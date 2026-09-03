"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phoneNumber
        }),

      })
      if (res.ok) {
        toast.success("Account created successfully!");
        router.push(`/Account/CreatePin?email=${encodeURIComponent(email)}`);
      } else {
        toast.error("Registration failed. Please try again.");
        console.error("Registration failed");
      }
    }
    catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className="flex flex-col items-center px-2 py-15 justify-center min-h-screen bg-gray-100">
      <div className="flex items-center gap-4 px-auto mx-auto pb-6 ">
        <Image
          src="/favicon.ico"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full bg-green-950"
        />
        <h2 className="text-2xl font-bold">Sollnispay</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-lg font-semibold mt-3 text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-400 text-md md:text-base mb-7">Let's get you started with your sollnispay account.</p>
        </div>

        {/* Form */}
        <form className="space-y-10" onSubmit={handleSubmit}>
          {/* First and Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Firstname"
              className="border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
            />
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Lastname"
              className="border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
          />

          {/* Mobile & Password */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="Mobile Number"
              className="border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create Password"
                className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1 pr-8"
              />

              {/* Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  // Eye open
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.712 2.257-2.3 4.152-4.323 5.322M15 15a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  // Eye closed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18M4.5 4.5a9.473 9.473 0 0113.5 0M3 12a9 9 0 0118 0"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <input
            type="text"
            placeholder="Referral Code (Optional)"
            className="w-full border-b-2 border-gray-200 focus:border-green-950 outline-none py-1"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-linear-to-r from-orange-700 bg-amber-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Create My Account
          </button>
          <Link href="/Account/Signin" className="text-sm text-gray-700 hover:underline -mt-5 block text-center">Already have an account? <strong className="text-orange-900">Login</strong></Link>
        </form>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Signup;
