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
              <h1 className="mt-10 text-3xl font-semibold leading-tight text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-xs text-white/70">
                Sign in and pick up from where you left off.
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


                <div className="-mt-4 mb-5 text-right">
                  <Link
                    href="/Account/Forgot-password"
                    className="text-[11px] text-white/70 hover:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-[#b9763c] px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-black/30 transition duration-300 hover:bg-[#a56630] disabled:opacity-60"
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