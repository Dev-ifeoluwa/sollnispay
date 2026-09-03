// import Animate from "components/Animate";
// import Image from "next/image";
// import Link from "next/link";

// export default function BankWith() {
//   return (
//     <div className="flex flex-col gap-4 px-2 py-6 md:px-8 md:py-7">
//       <div className="mt-6 flex flex-col gap-4 justify-center w-full max-w-3xl mx-auto text-center p-2 md:p-4">
//         <Animate type="fade-right" delay={300}>
//           <h1 className="text-2xl md:text-5xl font-semibold text-gray-700">Pay With <span className="text-green-700">Shalompay</span></h1>
//         </Animate>
//         <p>
//           Experience the ease of paying your bills and making transfers with
//            confidence. <span className="text-green-700"> With a 99.9% success rate</span>, enjoy seamless transactions, 
//           real-time updates, and total peace of mind knowing your money 
//           is always in safe hands
//         </p>
//       </div>
//       {/* bottom */}
//       <div className="flex flex-col-reverse items-center gap-2 md:flex-row justify-between px-2 py-3 md:px-15 md:py-4">
//         {/* left right */}
//         <div className="flex flex-col gap-6 w-full max-w-md">
//           <p className="text-gray-700 text-center w-40 p-1 bg-green-100 rounded-2xl text-sm md:text-md">Bill Payments</p>
//           <Animate type="fade-left" delay={300}>
//             <h2 className="text-lg md:text-4xl text-green-800 font-semibold">Seamless Bill Payments</h2>
//           </Animate>
//           <p className="text-md md:text-xl text-gray-700">
//             Bill payments that always go through.
//             From electricity to internet and TV subscriptions, pay your 
//             bills in seconds with a 99.9% success 
//             rate. No delays, no errors just smooth, secure payments that work every time.
//           </p>
//           <Link 
//             href={"/Account/loginaccount"}
//             className="bg-green-600 w-full max-w-40 text-white font-semibold px-1 py-2 md:p-4 text-center rounded-full"
//             >Open Account</Link>
//         </div>
//         {/* right */}
//         <div className="flex">
//           <Animate type="fade-down" delay={300}>
//             <Image src={"/app3.png"} alt="" width={300} height={300} className="mr-12 -rotate-25 max-w-[250px] md:max-w-md lg:max-w-lg" />
//           </Animate>
//           {/* <Animate type="fade-down" delay={300}>
//             <Image src={"/app2.png"} alt="" width={300} height={300} className="mr-12"/>
//           </Animate> */}
//         </div>
//       </div>
//     </div>
//   );
// }





import React from "react";
import Animate from "components/Animate";

/**
 * About Service section for the bill payment platform.
 * Brand palette: burnt orange (accent) + deep coffee brown (depth/text).
 * Add these custom colors to your tailwind.config.js theme.extend.colors,
 * or swap the class names below for your nearest Tailwind orange/brown shades:
 *
 *   brand: {
 *     orange: '#D9631A',
 *     'orange-light': '#E8A876',
 *     'orange-bg': '#FCE6D4',
 *     brown: '#2B1B12',
 *     'brown-soft': '#5A4636',
 *     'brown-muted': '#6B5645',
 *     cream: '#FBF3EC',
 *   }
 */

const stats = [
  { value: "99.9%", label: "Platform uptime" },
  { value: "<30s", label: "Average payment confirmation" },
  { value: "20+", label: "Billers and providers supported" },
];

const pillars = [
  {
    heading: "Bank-grade security",
    body: "Every transaction is encrypted end-to-end and processed through licensed payment channels, so your money and data stay protected at every step.",
  },
  {
    heading: "Built for reliability",
    body: "We monitor every biller connection around the clock and route payments through backup channels automatically if one provider is slow.",
  },
  {
    heading: "Transparent by default",
    body: "No hidden charges. You see the exact fee before you confirm, every single time — on airtime, data, cable, or electricity.",
  },
];

export default function About() {
  return (
    <section className="bg-brand-cream px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-18">
        {/* Left column — narrative */}
        <div>
          <span className="mb-6 inline-block rounded-full bg-brand-orange-bg px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-brand-orange">
            About the sollnispay
          </span>

          <Animate type="fade-down" delay={300}>
          <h2 className="mb-6 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold leading-tight text-brand-brown">
            One platform, built to make every bill payment effortless
          </h2>
          </Animate>

          <p className="mb-10 max-w-md text-[17px] leading-relaxed text-brand-brown-soft">
            We built this platform because paying bills in Nigeria
            shouldn't mean juggling five different apps, unstable
            connections, and unclear charges. From airtime and data to
            cable subscriptions and electricity tokens, everything routes
            through one secure, dependable system so you spend less
            time on logistics and more time on what actually matters to
            you.
          </p>

          {/* <div className="grid gap-7">
            {pillars.map((pillar) => (
              <div key={pillar.heading} className="flex items-start gap-4">
                <span className="mt-2.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-orange" />
                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-brand-brown">
                    {pillar.heading}
                  </h3>
                  <p className="max-w-sm text-[15px] leading-relaxed text-brand-brown-muted">
                    {pillar.body}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right column — reliability panel */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-brown px-9 py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-orange opacity-15" />

          <p className="relative mb-2 text-[13px] font-semibold tracking-wide text-brand-orange-light">
            Why people trust us
          </p>
          <p className="relative mb-9 text-xl font-medium leading-snug text-brand-cream">
            Numbers we hold ourselves to, every day.
          </p>

          <div className="relative grid gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i < stats.length - 1
                    ? "border-b border-brand-cream/10 pb-6"
                    : ""
                }
              >
                <div className="mb-2 text-4xl font-bold leading-none text-brand-orange">
                  {stat.value}
                </div>
                <div className="text-sm text-brand-cream/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}