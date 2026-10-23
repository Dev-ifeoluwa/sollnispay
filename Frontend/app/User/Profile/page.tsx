"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Settings,
  Pencil,
  ChevronRight,
  User,
  CreditCard,
  ShieldCheck,
  Lock,
  Fingerprint,
  ShieldAlert,
  HelpCircle,
  Gift,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Preloader from "components/preloader";
import { Toaster } from "react-hot-toast";
import { clearPwaCaches } from "lib/pwa";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("No token found, redirecting to signin.");
      router.push('/Account/Signin');
      return;
    }

    const fetchProfile = async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json'
        },
      })
      if (res.ok) {
        const data = await res.json();
        setProfile(data.dashboard ?? data.profile ?? data);
      } else if (res.status === 401) {
        console.error("Unauthorized, redirecting to signin.");
        router.push('/Account/Signin');
      } else {
        console.error("Failed to fetch profile data.");
      }
    }
    fetchProfile();
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   router.push('/Account/Signin');
  // };


  async function handleLogout() {
  await clearPwaCaches()
  localStorage.removeItem('token');
  router.push('/Account/Signin');
}

  const handleDeleteAccount = () => {
    router.push('/User/DeleteAccount');
  }
  

  return (
    <>
      {!profile ? (
        <div>
          <Preloader />
        </div>
      ) : (
        <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
          <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-2xl" />

          <div className="z-10 mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:max-w-3xl">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
                Profile
              </h1>
              <Link
                href={"/User/Settings"}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#d8c3b6] hover:text-white transition"
              >
                <Settings size={16} />
              </Link>
            </div>

            {/* Identity block */}
            <div className="flex flex-col items-center text-center pt-4 pb-2">
              <div className="relative">
                <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-[#1a0d05] font-bold text-2xl sm:text-3xl font-serif border-[3px] border-white/[0.12] shadow-lg shadow-orange-900/40">
                  {`${profile.firstName?.[0] ?? "U"}${profile.lastName?.[0] ?? ""}`}
                </div>
                <button className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#0a0503] border-2 border-[#1e100a] text-[#fbf3ec]">
                  <Pencil size={12} />
                </button>
              </div>

              <h2 className="mt-3 text-xl sm:text-2xl font-semibold italic font-serif text-[#fbf3ec]">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-[#8f7768] mt-0.5">{profile.email}</p>

              <div className="flex gap-2 mt-3">
                <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1.5 rounded-full bg-[#f4b860]/15 text-[#f4b860]">
                  <CheckCircle2 size={12} />
                  {profile.isVerified ? "Verified" : "Unverified"}
                </span>
                <span className="text-[11.5px] font-bold px-2.5 py-1.5 rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d]">
                  {profile.tier ?? "Tier 1"} account
                </span>
              </div>
            </div>

            {/* Profile completion */}
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#301a10] to-[#26140c] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-[#fbf3ec]">Complete your profile</p>
                <span className="text-sm font-bold text-[#f4b860]">
                  {profile.completionPercent ?? 10}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff7a3d] to-[#f4b860]"
                  style={{ width: `${profile.completionPercent ?? 10}%` }}
                />
              </div>
              <p className="text-xs text-[#8f7768] mt-2.5">
                Complete your KYC.
              </p>
            </div>

            {/* Account group */}
            <p className="text-xs font-bold text-[#8f7768] mt-7 mb-2.5 px-1">Account</p>
            <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] divide-y divide-white/[0.06] overflow-hidden">
              <ProfileRow
                icon={<User size={16} />}
                tone="tone-1"
                label="Personal information"
                sub="Name, phone, address"
                href="/User/Profile/Personal"
              />
              <ProfileRow
                icon={<CreditCard size={16} />}
                tone="tone-2"
                label="Linked cards"
                value={`${profile.linkedCards?.length ?? 0} cards`}
                href="/User/Profile/Cards"
              />
              <ProfileRow
                icon={<ShieldCheck size={16} />}
                tone="tone-3"
                label="Identity verification"
                sub={profile.bvnLinked ? "BVN linked" : "BVN not linked"}
                href="/User/Profile/Verification"
              />
            </div>

            {/* Security group */}
            <p className="text-xs font-bold text-[#8f7768] mt-7 mb-2.5 px-1">Security</p>
            <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] divide-y divide-white/[0.06] overflow-hidden">
              <ProfileRow
                icon={<Lock size={16} />}
                tone="tone-1"
                label="Transaction PIN"
                href="/User/Profile/Pin"
              />
              <ProfileRow
                icon={<Fingerprint size={16} />}
                tone="tone-2"
                label="Biometric login"
                value={profile.biometricEnabled ? "On" : "Off"}
                href="/User/Profile/Biometrics"
              />
              <ProfileRow
                icon={<ShieldAlert size={16} />}
                tone="tone-3"
                label="Two-factor authentication"
                href="/User/Profile/TwoFactor"
              />
            </div>

            {/* Support group */}
            <p className="text-xs font-bold text-[#8f7768] mt-7 mb-2.5 px-1">Support</p>
            <div className="rounded-2xl border border-white/[0.08] bg-[#26140c] divide-y divide-white/[0.06] overflow-hidden">
              <ProfileRow
                icon={<HelpCircle size={16} />}
                tone="tone-1"
                label="Help centre"
                href="/User/Support"
              />
              <ProfileRow
                icon={<Gift size={16} />}
                tone="tone-2"
                label="Refer & earn"
                href="/User/Refer"
              />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full mt-7 mb-5 flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm text-[#e8563a] bg-[#e8563a]/10 border border-[#e8563a]/25"
              >
              <LogOut size={15} />
              Log out
            </button>
            <button
              onClick={handleDeleteAccount}
              className="cursor-pointer w-full mt-2 mb-10 flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-sm text-[#e8563a] bg-[#e8563a]/10 border border-[#e8563a]/25"
              >
              
              Delete Account
            </button>

            <p className="text-center text-[11px] text-[#8f7768] mt-4">
              Sollnispay v2.4.1
            </p>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

function ProfileRow({
  icon,
  tone,
  label,
  sub,
  value,
  href,
}: {
  icon: React.ReactNode;
  tone: "tone-1" | "tone-2" | "tone-3";
  label: string;
  sub?: string;
  value?: string;
  href: string;
}) {
  const toneClasses = {
    "tone-1": "bg-[#ff7a3d]/15 text-[#ff7a3d]",
    "tone-2": "bg-[#f4b860]/15 text-[#f4b860]",
    "tone-3": "bg-[#d8c3b6]/10 text-[#d8c3b6]",
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
    >
      <span className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-[10px] ${toneClasses[tone]}`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#fbf3ec] truncate">{label}</p>
        {sub && <span className="text-[11.5px] text-[#8f7768]">{sub}</span>}
      </span>
      {value && (
        <span className="text-xs text-[#8f7768] flex-shrink-0">{value}</span>
      )}
      <ChevronRight size={16} className="text-[#8f7768] flex-shrink-0" />
    </Link>
  );
}