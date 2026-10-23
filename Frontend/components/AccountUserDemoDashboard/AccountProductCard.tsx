"use client"
import { useRouter } from "next/navigation";
import {
  PenIcon,
  Gamepad2,
  PhoneCall,
  Earth,
  EuroIcon,
  Plane,
  Network,
  Monitor,
  LoaderIcon,
  BaggageClaim,
  Banknote,
  ArrowBigDownIcon,
  ArrowRight,
  IdCard,
} from "lucide-react";
import Link from "next/link";

export default function AccountProductCard() {
  const router = useRouter()
  const handleClick = () => {
    router.push("/Account/Signin")
  }

  const DemoFeature = [
    {
      icon: IdCard,
      Name: "Gift card",
    },
    {
      icon: EuroIcon,
      Name: "Convert money",
    },
  ]

  const BankFeature = [
    {
      icon: PhoneCall,
      Name: "Airtime",
    },
    {
      icon: Gamepad2,
      Name: "Betting",
    },
    {
      icon: Monitor,
      Name: "Tv sub",
    },
  ];



  return (
    <>
      <div className="flex px-4 flex-col gap-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <h4 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
            Quick actions
          </h4>
          <Link
            href={"/Account/Signin"}
            className="text-sm font-bold text-[#ff7a3d] hover:text-[#ffa06b] transition"
          >
            See all
          </Link>
        </div>

        {/* Feature tile + stacked side tiles */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link
            href="/Account/Signin"
            className="row-span-2 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#3a1c0d] to-[#241209] px-4 py-5 sm:px-5 sm:py-6 min-h-[190px] sm:min-h-[210px]"
          >
            <div>
              <span className="inline-block text-[11px] font-bold text-[#f4b860] bg-[#f4b860]/15 px-2.5 py-1 rounded-full">
                Popular
              </span>
              <p className="mt-3 text-base sm:text-lg font-semibold italic font-serif text-[#fbf3ec] leading-snug">
                <p>Mobile data</p>
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-[#8f7768] leading-relaxed">Login to purchase Mobile data</p>
            </div>
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff7a3d] text-[#1a0d05]">
              <ArrowRight size={16} />
            </span>
          </Link>

          <div className="flex flex-col gap-3 sm:gap-4">
            {DemoFeature.map(({ Name, icon: Icon }) => (
              <Link
                href="/Account/Signin"
                key={Name}
                className="flex flex-1 flex-col justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4 sm:px-5"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                  <Icon size={18} />
                </span>
                <p className="text-sm font-semibold text-[#fbf3ec]">{Name}</p>
              </Link>
            ))}
          </div>
        </div>


        {/* Remaining tiles */}
        {BankFeature.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {BankFeature.map(({ Name, icon: Icon }) => (
              <Link
                href="/Account/Signin"
                key={Name}
                className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                  <Icon size={18} />
                </span>
                <p className="text-sm font-semibold text-[#fbf3ec]">{Name}</p>
              </Link>
            ))}

          </div>
        )}
      </div>
    </>
  );
}
