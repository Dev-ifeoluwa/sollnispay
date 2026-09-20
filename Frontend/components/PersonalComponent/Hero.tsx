import Image from "next/image";
import Link from "next/link";
import FancyHeading from "./HeroMirror";
import Animate from "components/Animate";

export default function Hero() {
  return (
    <section className="flex items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_#3D2416,_#1C110A_60%)] flex-col md:flex-row mt-15 px-2 py-8 md:px-10 mx-auto md:py-8">
      <div className="flex flex-col gap-6 w-full max-w-2xl px-1 py-5 md:px-8">
        <div className="mt-10 md:mt-20">
          <p className="text-orange-300 text-left text-sm md:text-lg">Built For You Built For Tomorrow</p>
          <FancyHeading />
        </div>
        <p 
        // className="mt-4 max-w-2xl  text-[#F4E3D3] text-lg md:text-2xl cursor-default"
        className="mt-[0.4rem] text-[length:clamp(1.05rem,1.5vw,1.2rem)] leading-[1.6] text-[#d3bba7]"
        >
          Gift cards currency swaps airtime data betting funding and TV 
          subscriptions we brings it all together in 
          one place. Fast secure and always reliable.
        </p>
        {/* ----button section----- */}
        <div className="flex flex-wrap gap-[.85rem]">
          <div
            className="mt-8 flex hover:bg-[#1C110A] items-center gap-4 bg-orange-600 md:font-medium
                text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer border-rounded-xl
                transition-colors duration-300 hover:border-[#ff6a1f] hover:bg-[#ff8547] hover:text-[#1C110A]"
            >
            <Link href={"/Account/loginaccount"} className="flex items-center gap-3">
              {/* <Image src="/playstore.svg" alt="logo" height="30" width="30" /> */}
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[26px] w-[26px] shrink-0">
                <path d="M5 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 5 3.5z" />
              </svg>
              <span>
                <p className="text-sm font-light">Get it on</p>
                <h2 className="text-md md:text-xl">Google Play</h2>
              </span>
            </Link>
          </div>
          {/*  */}
          <div
            className="mt-8 flex hover:bg-orange-600 items-center gap-4 bg-[#1C110A] md:font-medium
                text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer 
                transition-colors duration-300 border border-[#fbebdd]/20 hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
            >
            <Link href={"/Account/loginaccount"} className="flex items-center gap-3">
              {/* <Image src="/apple.svg" alt="logo" height="30" width="30" /> */}
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[26px] w-[26px] shrink-0">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              <span>
                <p className="text-sm font-light">Download on the</p>
                <h2 className="text-md md:text-xl">Apple Store</h2>
              </span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-7">
          <h3 className="text-white font-serif text-lg mt-6 md:text-xl">
            We're Working With
          </h3>
          <div className="flex gap-5 items-center">
            <Image
              src={"/client-logo-1.svg"}
              className="animate-pulse"
              alt=""
              width={100}
              height={30}
            />
            <Image
              src={"/client-logo-2.svg"}
              className="animate-pulse"
              alt=""
              width={100}
              height={30}
            />
            <Image
              src={"/client-logo-3.svg"}
              className="animate-pulse"
              alt=""
              width={100}
              height={30}
            />
          </div>
        </div>
      </div>
      {/* -------------- */}
      <div className="relative pr-0 md:pr-15 -mb-10 max-w-[250px] md:max-w-md lg:max-w-lg">
        {/* right section */}
        <Animate type="flip-right" delay={300}>
          <Image
            src={"/app12.png"}
            alt=""
            width={350}
            height={350}
            className="rotate-20" />
        </Animate>
      </div>
    </section>
  );
}





// import Image from "next/image";
// import Link from "next/link";
// import type { ReactNode } from "react";

// /**
//  * Sollnis Pay hero section (Next.js App Router + Tailwind CSS, v3.2+ or v4).
//  *
//  * Needs three things outside this file (see the setup notes):
//  *  1. /public/images/sollnis-phone.webp  – the phone image
//  *  2. next/font variables --font-serif and --font-sans in app/layout.tsx
//  *  3. the `rise` keyframes in app/globals.css
//  *
//  * All colours use arbitrary values, so there is nothing to add to tailwind.config.
//  *   espresso #1c110a · ember #ff6a1f · amber #f5a85b · cream #fbebdd · muted #d3bba7
//  */

// const focusRing =
//   "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#f5a85b]";

// /* ---------- Icons ---------- */

// function LineIcon({ children }: { children: ReactNode }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       aria-hidden="true"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth={1.7}
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="h-[18px] w-[18px] shrink-0 text-[#f5a85b]"
//     >
//       {children}
//     </svg>
//   );
// }

// function PlayIcon() {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[26px] w-[26px] shrink-0">
//       <path d="M5 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 5 3.5z" />
//     </svg>
//   );
// }

// function AppleIcon() {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[26px] w-[26px] shrink-0">
//       <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
//     </svg>
//   );
// }

// /* ---------- Content ---------- */

// const navLinks = [
//   { label: "Services", href: "#services" },
//   { label: "How it works", href: "#how-it-works" },
//   { label: "Support", href: "#support" },
// ];

// const services: { label: string; icon: ReactNode }[] = [
//   {
//     label: "Gift cards",
//     icon: (
//       <LineIcon>
//         <rect x="3" y="8" width="18" height="4" rx="1" />
//         <path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
//       </LineIcon>
//     ),
//   },
//   {
//     label: "Currency swaps",
//     icon: (
//       <LineIcon>
//         <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
//       </LineIcon>
//     ),
//   },
//   {
//     label: "Airtime",
//     icon: (
//       <LineIcon>
//         <rect x="7" y="2" width="10" height="20" rx="2.5" />
//         <path d="M11 18h2" />
//       </LineIcon>
//     ),
//   },
//   {
//     label: "Data",
//     icon: (
//       <LineIcon>
//         <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" />
//         <circle cx="12" cy="19.5" r=".6" />
//       </LineIcon>
//     ),
//   },
//   {
//     label: "Betting funding",
//     icon: (
//       <LineIcon>
//         <path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H4v1a3 3 0 0 0 3 3M16 6h4v1a3 3 0 0 1-3 3M12 13v4M8 21h8M10 17h4" />
//       </LineIcon>
//     ),
//   },
//   {
//     label: "TV subscriptions",
//     icon: (
//       <LineIcon>
//         <rect x="3" y="5" width="18" height="12" rx="2" />
//         <path d="M8 21h8M12 17v4" />
//       </LineIcon>
//     ),
//   },
// ];

// /* ---------- Pieces ---------- */

// type StoreButtonProps = {
//   href: string;
//   kicker: string;
//   label: string;
//   icon: ReactNode;
//   variant: "primary" | "secondary";
// };

// function StoreButton({ href, kicker, label, icon, variant }: StoreButtonProps) {
//   const variants = {
//     primary: "bg-[#ff6a1f] text-[#1c110a] hover:bg-[#ff8547]",
//     secondary:
//       "border-[1.5px] border-[#fbebdd]/35 text-[#fbebdd] hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10",
//   };

//   return (
//     <a
//       href={href}
//       className={`inline-flex min-h-[60px] items-center gap-[.8rem] rounded-2xl py-[.7rem] pl-[1.1rem] pr-[1.35rem] leading-[1.15] transition active:translate-y-px max-[420px]:flex-[1_1_100%] ${variants[variant]} ${focusRing}`}
//     >
//       {icon}
//       <span>
//         <small className="block text-[.78rem] font-medium">{kicker}</small>
//         <strong className="block text-[1.15rem] font-bold tracking-[-0.01em]">{label}</strong>
//       </span>
//     </a>
//   );
// }

// /* ---------- Hero ---------- */

// export default function Hero() {
//   return (
//     <section
//       aria-labelledby="hero-title"
//       className="relative isolate grid min-h-[max(680px,100svh)] grid-rows-[auto_1fr] overflow-hidden bg-[#1c110a] font-[family-name:var(--font-sans)] text-[#fbebdd] [background-image:linear-gradient(to_right,transparent_52%,rgba(58,35,21,0.7)_100%),radial-gradient(55%_75%_at_76%_64%,#33200f_0%,transparent_70%)]"
//     >
//       {/* Soft ember glow behind the phone */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -bottom-[18%] -right-[4%] -z-10 aspect-square w-[min(760px,90vw)] [background-image:radial-gradient(closest-side,rgba(255,106,31,0.16),rgba(255,106,31,0.05)_55%,transparent_100%)] max-[860px]:right-1/2 max-[860px]:translate-x-1/2"
//       />

//       {/* Nav */}
//       <header className="mx-auto grid w-full max-w-[1240px] grid-cols-[1fr_auto] items-center gap-4 px-[clamp(20px,5vw,72px)] py-6 min-[861px]:grid-cols-[1fr_auto_1fr]">
//         <Link
//           href="/"
//           aria-label="Sollnis Pay home"
//           className={`inline-flex items-center gap-[.65rem] justify-self-start text-[1.05rem] font-semibold ${focusRing}`}
//         >
//           <span
//             aria-hidden="true"
//             className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#ff6a1f] font-[family-name:var(--font-serif)] text-xl font-semibold italic leading-none text-[#1c110a]"
//           >
//             S
//           </span>
//           Sollnis Pay
//         </Link>

//         <nav aria-label="Primary" className="hidden gap-8 text-[.95rem] text-[#d3bba7] min-[861px]:flex">
//           {navLinks.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               className={`py-1.5 transition-colors hover:text-[#fbebdd] ${focusRing}`}
//             >
//               {link.label}
//             </a>
//           ))}
//         </nav>

//         <Link
//           href="/login"
//           className={`justify-self-end rounded-full border border-[#fbebdd]/20 px-[1.1rem] py-[.55rem] text-[.95rem] font-medium transition-colors hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10 ${focusRing}`}
//         >
//           Sign in
//         </Link>
//       </header>

//       {/* Content */}
//       <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 px-[clamp(20px,5vw,72px)] min-[861px]:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] min-[861px]:gap-[clamp(1rem,3vw,3rem)]">
//         <div className="relative z-10 self-center pb-8 pt-4 min-[861px]:pb-12">
//           <h1
//             id="hero-title"
//             className="max-w-[14ch] text-balance font-[family-name:var(--font-serif)] text-[length:clamp(2.7rem,5.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.025em]"
//           >
//             One app. Every transaction you need.
//           </h1>

//           <p className="mt-[1.4rem] max-w-[35rem] text-[length:clamp(1.05rem,1.5vw,1.2rem)] leading-[1.6] text-[#d3bba7]">
//             Buy and sell gift cards, swap currencies and pay for everyday services from one wallet.
//             Fast, secure and always reliable.
//           </p>

//           <div className="mt-8 flex flex-wrap gap-[.85rem]">
//             <StoreButton
//               variant="primary"
//               href="#"
//               kicker="Get it on"
//               label="Google Play"
//               icon={<PlayIcon />}
//             />
//             <StoreButton
//               variant="secondary"
//               href="#"
//               kicker="Download on the"
//               label="App Store"
//               icon={<AppleIcon />}
//             />
//           </div>

//           <ul
//             id="services"
//             aria-label="What you can do with Sollnis Pay"
//             className="mt-8 flex max-w-xl flex-wrap gap-[.55rem]"
//           >
//             {services.map((service) => (
//               <li
//                 key={service.label}
//                 className="inline-flex items-center gap-2 rounded-full border border-[#fbebdd]/[.18] bg-[#fbebdd]/[.04] py-2 pl-3 pr-[.95rem] text-[.92rem] font-medium transition-colors hover:border-[#ff6a1f]/70 hover:bg-[#ff6a1f]/10"
//               >
//                 {service.icon}
//                 {service.label}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Phone: bleeds off the bottom edge */}
//         <div className="pointer-events-none relative flex items-end self-end justify-self-center min-[861px]:justify-self-end">
//           <Image
//             src="/app12.png"
//             alt="Sollnis Pay app home screen with wallet balance, a Fund wallet button and quick actions for gift cards and converting funds"
//             width={1170}
//             height={1152}
//             priority
//             sizes="(min-width: 861px) 50vw, 118vw"
//             className="-mx-[9%] -mt-[22vw] block h-auto w-[min(118vw,560px)] motion-safe:animate-[rise_1s_cubic-bezier(.2,.7,.2,1)_both] min-[861px]:-ml-[18%] min-[861px]:-mr-[9%] min-[861px]:mt-0 min-[861px]:w-[clamp(340px,50vw,700px)]"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }