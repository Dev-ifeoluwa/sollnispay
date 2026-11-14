// import Animate from "components/Animate";



// const stats = [
//   { value: "99.9%", label: "Platform uptime" },
//   { value: "<30s", label: "Average payment confirmation" },
//   { value: "20+", label: "Billers and providers supported" },
// ];

// const pillars = [
//   {
//     heading: "Bank-grade security",
//     body: "Every transaction is encrypted end-to-end and processed through licensed payment channels, so your money and data stay protected at every step.",
//   },
//   {
//     heading: "Built for reliability",
//     body: "We monitor every biller connection around the clock and route payments through backup channels automatically if one provider is slow.",
//   },
//   {
//     heading: "Transparent by default",
//     body: "No hidden charges. You see the exact fee before you confirm, every single time — on airtime, data, cable, or electricity.",
//   },
// ];

// export default function About() {
//   return (
//     <section className="bg-brand-cream px-6 py-24">
//       <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-18">
//         {/* Left column — narrative */}
//         <div>
//           <span className="mb-6 inline-block rounded-full bg-brand-orange-bg px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-brand-orange">
//             About the sollnispay
//           </span>

//           <Animate type="fade-down" delay={300}>
//             <h2
//               className="text-balance mb-6 max-w-lg text-2xl font-bold leading-tight mt-0.5 md:text-3xl lg:text-5xl font-[family-name:var(--font-serif)] text-brand-brown leading-[1.02] tracking-[-0.025em]"
//             // className="mb-6 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold leading-tight text-brand-brown"
//             >
//               One platform, built to make every bill payment effortless
//             </h2>
//           </Animate>

//           <p className="mb-10 max-w-md text-[17px] leading-relaxed text-brand-brown-soft">
//             We built this platform because paying bills in Nigeria
//             shouldn't mean juggling five different apps, unstable
//             connections, and unclear charges. From gift card and data to
//             cable subscriptions and electricity tokens, everything routes
//             through one secure, dependable system so you spend less
//             time on logistics and more time on what actually matters to
//             you.
//           </p>
//         </div>

//         {/* Right column — reliability panel */}
//         <div className="relative overflow-hidden rounded-2xl bg-brand-brown px-9 py-10">
//           <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-orange opacity-15" />

//           <p className="relative mb-2 text-[13px] font-semibold tracking-wide text-brand-orange-light">
//             Why people trust us
//           </p>
//           <p className="relative mb-9 text-xl font-medium leading-snug text-brand-cream">
//             Numbers we hold ourselves to, every day.
//           </p>

//           <div className="relative grid gap-6">
//             {stats.map((stat, i) => (
//               <div
//                 key={stat.label}
//                 className={
//                   i < stats.length - 1
//                     ? "border-b border-brand-cream/10 pb-6"
//                     : ""
//                 }
//               >
//                 <div className="mb-2 text-4xl font-bold leading-none text-brand-orange">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-brand-cream/70">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





// import { PhoneFrame } from "./PhoneMock";
import PhoneFrame  from "./Phonemock";

const steps = [
    { title: "Create an account", body: "Sign up in under 60 seconds with your basic details and get verified." },
    { title: "Fund your wallet", body: "Transfer to your dedicated virtual account and get credited instantly, every time." },
    { title: "Make payments", body: "Pick a service, enter your details and get value delivered immediately." },
];

function Step({ n, title, body, active = false }: { n: number; title: string; body: string; active?: boolean }) {
    return (
        <div className={`rounded-2xl border p-5 ${active ? "border-[#ff7a3d]/50 bg-[#ff7a3d]/10" : "border-[#2B1810]/10 bg-white"}`}>
            <p className="text-xs font-semibold text-[#c1440e]">Step {n}</p>
            <h3 className="mt-1 text-lg font-semibold text-[#2B1810]">{title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#7a6455]">{body}</p>
        </div>
    );
}

export default function About() {
// export default function HowItWorks() {
    return (
        <section className="bg-[#fbf3ec] px-4 py-24 sm:px-6">
            <h2 className="text-center font-serif text-4xl font-medium tracking-tight text-[#2B1810] md:text-5xl">
                How it <span className="italic text-[#c1440e]">works</span>
            </h2>

            <div className="mx-auto mt-14 grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
                <div className="space-y-6">
                    <Step n={1} {...steps[0]} />
                    <Step n={3} {...steps[2]} />
                </div>

                <PhoneFrame className="mx-auto">
                    <div className="space-y-3 pb-3">
                        <p className="text-center text-xs font-semibold text-[#fbf3ec]">Fund wallet</p>
                        {["Bank", "Account number", "Account name"].map((l) => (
                            <div key={l} className="rounded-xl border border-white/10 bg-[#1e100a] px-3 py-2.5">
                                <p className="text-[9px] text-[#8f7768]">{l}</p>
                                <div className="mt-1 h-2 w-3/4 rounded-full bg-white/15" />
                            </div>
                        ))}
                        <div className="rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] py-2.5 text-center text-[11px] font-bold text-[#1a0d05]">
                            Copy account number
                        </div>
                        <div className="h-24" />
                    </div>
                </PhoneFrame>

                <div>
                    <Step n={2} {...steps[1]} active />
                </div>
            </div>
        </section>
    );
}