// import Animate from "components/Animate";
// import { DollarSign } from "lucide-react";
// import Image from "next/image";
// import BenefitCard from "./BenefitCard";
// import Link from "next/link";


// export default function Benefit() {
//   return (
//     <>
//       <div className="flex flex-col gap-4 px-4 py-7 md:px-7 md:py-14">
//         {/* top */}
//         <div className="flex justify-between items-center lg:flex-row">
//           <div className="w-full max-w-lg">
//             <Animate type="fade-up" delay={300}>
//               <h2 className="text-lg md:text-4xl font-semibold mb-9 px-2 leading-lung">
//                 Our Key <span className="text-green-800">Service</span>{" "}
//                 (Our Solutions)
//               </h2>
//             </Animate>
//           </div>
//           <div className="flex items-center gap-3 text-white bg-green-500 font-semibold text-md whitespace-nowrap py-1 text-center px-2 rounded-4xl md:py-3 md:px-5 md:text-xl">
//                 {/* <span>Learn More</span> */}
//                 <Link href={"/Account/loginaccount"}>See All</Link>
//                 <span>
//                     <Image 
//                         src="/arrow-white.svg" 
//                         alt="logo" 
//                         height={20} 
//                         width={20}
//                         />
//                 </span>
//           </div>
//         </div>
//         {/* bottom */}
//         <div>
//             <BenefitCard />
//         </div>
//       </div>
//     </>
//   );
// }



import React from "react";
import Animate from "components/Animate";

/**
 * "How to register" section — 3-step onboarding walkthrough.
 * Left: numbered steps with copy. Right: an on-brand step-flow
 * graphic (icon + connector line) instead of an app-screen mockup,
 * so the section reads as editorial rather than a product screenshot.
 *
 * Uses the brand.* colors already defined in tailwind.config.js.
 */

type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Create an account",
    description:
      "Sign up in under 60 seconds with just your basic details. No hidden fees.",
  },
  {
    number: "02",
    title: "Fund your wallet",
    description:
      "Transfer to your dedicated virtual account and get credited instantly, every time.",
  },
  {
    number: "03",
    title: "Make payments",
    description:
      "Select a service, enter your details, and get value delivered immediately.",
  },
];

function IconUserPlus({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M18 8v5M15.5 10.5h5" />
    </svg>
  );
}

function IconWallet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="6.5" width="18" height="12" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconSend({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 3 3 10.5l7 2.5 2 7L21 3Z" />
      <path d="M10 13 21 3" />
    </svg>
  );
}

const flowSteps = [
  { icon: IconUserPlus, label: "Account created" },
  { icon: IconWallet, label: "Wallet funded" },
  { icon: IconSend, label: "Payment sent" },
];

export default function Benefit() {
  return (
    <section className="bg-brand-cream px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        {/* Left column — steps */}
        <div>
          <span className="mb-6 inline-block rounded-full bg-brand-orange-bg px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-brand-orange">
            Getting started
          </span>
          <Animate type="fade-up" delay={300}>
            <h2 className="mb-5 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold leading-tight text-brand-brown">
              Start transacting in 3 simple steps
            </h2>
          </Animate>

          <p className="mb-12 max-w-md text-[17px] leading-relaxed text-brand-brown-soft">
            We&apos;ve built this platform to be as intuitive as possible.
            No complicated forms, no delays.
          </p>

          <ol className="space-y-9">
            {steps.map((step, i) => (
              <li key={step.number} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-brand-cream">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mt-2 h-full w-px flex-1 bg-brand-brown/15" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="mb-1.5 text-lg font-semibold text-brand-brown">
                    {step.title}
                  </h3>
                  <p className="max-w-sm text-[15px] leading-relaxed text-brand-brown-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Right column — step-flow graphic */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-brown px-9 py-12">
          <div className="pointer-events-none absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-brand-orange opacity-15" />

          <p className="relative mb-1 text-[13px] font-semibold tracking-wide text-brand-orange-light">
            From sign-up to payment
          </p>
          <p className="relative mb-10 text-xl font-medium leading-snug text-brand-cream">
            Every step, tracked in real time.
          </p>

          <div className="relative flex flex-col">
            {flowSteps.map((item, i) => {
              const Icon = item.icon;
              const isLast = i === flowSteps.length - 1;
              return (
                <div key={item.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-brand-orange bg-brand-brown">
                      <Icon className="h-5 w-5 text-brand-orange" />
                    </span>
                    {!isLast && (
                      <span className="my-1 w-px flex-1 bg-brand-cream/15" />
                    )}
                  </div>
                  <div className={isLast ? "pb-0" : "pb-10"}>
                    <p className="pt-2.5 text-[15px] font-medium text-brand-cream">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative mt-2 inline-flex items-center gap-2 rounded-full bg-brand-cream/10 px-4 py-2 text-sm font-medium text-brand-cream">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            You&apos;re all set — under 60 seconds
          </div>
        </div>
      </div>
    </section>
  );
}
