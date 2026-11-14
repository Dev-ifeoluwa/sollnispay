// import Image from "next/image";
// import Link from "next/link";
// import FancyHeading from "./HeroMirror";
// import Animate from "components/Animate";

// export default function Hero() {
//   return (
//     <section className="flex items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_#3D2416,_#1C110A_60%)] flex-col md:flex-row mt-15 px-2 py-8 md:px-10 mx-auto md:py-8">
//       <div className="flex flex-col gap-6 w-full max-w-2xl px-1 py-5 md:px-8">
//         <div className="mt-10 md:mt-20">
//           <p className="text-orange-300 text-left text-sm md:text-lg">Built For You Built For Tomorrow</p>
//           <FancyHeading />
//         </div>
//         <p 
//         // className="mt-4 max-w-2xl  text-[#F4E3D3] text-lg md:text-2xl cursor-default"
//         className="mt-[0.4rem] text-[length:clamp(1.05rem,1.5vw,1.2rem)] leading-[1.6] text-[#d3bba7]"
//         >
//           Gift cards currency swaps airtime data betting funding and TV 
//           subscriptions we brings it all together in 
//           one place. Fast secure and always reliable.
//         </p>
//         {/* ----button section----- */}
//         <div className="flex flex-wrap gap-[.85rem]">
//           <div
//             className="mt-8 flex hover:bg-[#1C110A] items-center gap-4 bg-orange-600 md:font-medium
//                 text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer border-rounded-xl
//                 transition-colors duration-300 hover:border-[#ff6a1f] hover:bg-[#ff8547] hover:text-[#1C110A]"
//             >
//             <Link href={"/Account/loginaccount"} className="flex items-center gap-3">
//               {/* <Image src="/playstore.svg" alt="logo" height="30" width="30" /> */}
//               <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[26px] w-[26px] shrink-0">
//                 <path d="M5 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 5 3.5z" />
//               </svg>
//               <span>
//                 <p className="text-sm font-light">Get it on</p>
//                 <h2 className="text-md md:text-xl">Google Play</h2>
//               </span>
//             </Link>
//           </div>
//           {/*  */}
//           <div
//             className="mt-8 flex hover:bg-orange-600 items-center gap-4 bg-[#1C110A] md:font-medium
//                 text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer 
//                 transition-colors duration-300 border border-[#fbebdd]/20 hover:border-[#ff6a1f] hover:bg-[#ff6a1f]/10"
//             >
//             <Link href={"/Account/loginaccount"} className="flex items-center gap-3">
//               {/* <Image src="/apple.svg" alt="logo" height="30" width="30" /> */}
//               <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[26px] w-[26px] shrink-0">
//                 <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
//               </svg>
//               <span>
//                 <p className="text-sm font-light">Download on the</p>
//                 <h2 className="text-md md:text-xl">Apple Store</h2>
//               </span>
//             </Link>
//           </div>
//         </div>
//         {/* <div className="flex flex-col gap-7">
//           <h3 className="text-white font-serif text-lg mt-6 md:text-xl">
//             We're Working With
//           </h3>
//           <div className="flex gap-5 items-center">
//             <Image
//               src={"/client-logo-1.svg"}
//               className="animate-pulse"
//               alt=""
//               width={100}
//               height={30}
//             />
//             <Image
//               src={"/client-logo-2.svg"}
//               className="animate-pulse"
//               alt=""
//               width={100}
//               height={30}
//             />
//             <Image
//               src={"/client-logo-3.svg"}
//               className="animate-pulse"
//               alt=""
//               width={100}
//               height={30}
//             />
//           </div>
//         </div> */}
//       </div>
//       {/* -------------- */}
//       <div className="relative pr-0 md:pr-15 mt-10 -mb-10 max-w-[250px] md:max-w-md lg:max-w-lg">
//         {/* right section */}
//         <Animate type="flip-right" delay={300}>
//           <Image
//             // src={"/app220.png"}
//             src={"/app12.png"}
//             alt=""
//             width={350}
//             height={350}
//             // width={450}
//             // height={450}
//             className="rotate-20" />
//         </Animate>
//       </div>
//     </section>
//   );
// }





// import Link from "next/link";
// import { CheckCircle2, ArrowDownToLine } from "lucide-react";
// import { PhoneFrame, WalletScreen } from "./Phonemock";
// // import { PhoneFrame, WalletScreen } from "./PhoneMock";

// const methods = ["Airtime", "Data", "Cable TV", "Gift cards", "Betting", "Swaps"];

// export default function Hero() {
//     return (
//         <section className="relative overflow-hidden rounded-b-[2.5rem] bg-[#0a0503] bg-[radial-gradient(ellipse_at_top_right,#3D2416,#1C110A_60%)] px-4 pt-28 sm:px-6 md:pt-32">
//             <div className="mx-auto max-w-3xl text-center">
//                 <h1 className="font-serif text-[length:clamp(2.2rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em] text-[#fbf3ec]">
//                     One app.
//                     <br />
//                     <span className="text-[#b89a88]">Every transaction you need.</span>
//                 </h1>
//                 <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#d3bba7]">
//                     Gift cards, currency swaps, airtime, data, betting and TV subscriptions in one place. Fast, secure and always reliable.
//                 </p>
//                 <div className="mt-8 flex flex-wrap justify-center gap-3">
//                     <Link
//                         href="/Account/loginaccount"
//                         className="rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] px-7 py-3 text-sm font-bold text-[#1a0d05] shadow-lg shadow-orange-900/40"
//                     >
//                         Open account
//                     </Link>
//                     <Link
//                         href="/Account/Signin"
//                         className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-[#fbf3ec] hover:bg-white/5"
//                     >
//                         Log in
//                     </Link>
//                 </div>
//             </div>

//             {/* phone, cropped at the bottom, with floating cards on large screens */}
//             <div className="relative mx-auto mt-14 h-[360px] max-w-4xl overflow-hidden sm:h-[440px]">
//                 <PhoneFrame className="mx-auto h-[640px]">
//                     <WalletScreen />
//                 </PhoneFrame>

//                 <div className="absolute left-0 top-24 hidden w-56 rounded-2xl border border-white/10 bg-[#1e100a] p-4 shadow-xl shadow-black/40 md:block">
//                     <p className="text-xs text-[#8f7768]">Airtime purchase</p>
//                     <p className="mt-1 font-serif text-xl text-[#fbf3ec]">₦2,000.00</p>
//                     <p className="mt-2 flex items-center gap-1.5 text-xs text-[#f4b860]">
//                         <CheckCircle2 size={14} /> Delivered instantly
//                     </p>
//                 </div>

//                 <div className="absolute right-0 top-14 hidden w-56 rounded-2xl border border-white/10 bg-[#1e100a] p-4 shadow-xl shadow-black/40 md:block">
//                     <p className="text-xs text-[#8f7768]">Wallet funded</p>
//                     <p className="mt-1 font-serif text-xl text-[#fbf3ec]">+₦10,000.00</p>
//                     <p className="mt-2 flex items-center gap-1.5 text-xs text-[#f4b860]">
//                         <ArrowDownToLine size={14} /> Via your virtual account
//                     </p>
//                 </div>

//                 <div className="absolute bottom-16 right-0 hidden text-right md:block">
//                     <p className="mb-2 text-xs font-semibold text-[#b89a88]">What you can pay for</p>
//                     <div className="flex max-w-[15rem] flex-wrap justify-end gap-2">
//                         {methods.map((m) => (
//                             <span key={m} className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs text-[#fbf3ec]">
//                                 {m}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }




// import Link from "next/link";
// import PhoneShowcase from "./PhoneShowcase";

// export default function Hero() {
//     return (
//         <section className="relative overflow-hidden rounded-b-[2.5rem] bg-[#0a0503] bg-[radial-gradient(ellipse_at_top_right,#3D2416,#1C110A_60%)] px-4 pt-28 sm:px-6 md:pt-32">
//             <div className="mx-auto max-w-3xl text-center">
//                 <h1 className="font-serif text-[length:clamp(2.2rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em] text-[#fbf3ec]">
//                     One app.
//                     <br />
//                     <span className="text-[#b89a88]">Every transaction you need.</span>
//                 </h1>
//                 <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#d3bba7]">
//                     Gift cards, currency swaps, airtime, data, betting and TV subscriptions in one place. Fast, secure and always reliable.
//                 </p>
//                 <div className="mt-8 flex flex-wrap justify-center gap-3">
//                     <Link
//                         href="/Account/loginaccount"
//                         className="rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] px-7 py-3 text-sm font-bold text-[#1a0d05] shadow-lg shadow-orange-900/40"
//                     >
//                         Open account
//                     </Link>
//                     <Link
//                         href="/Account/Signin"
//                         className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-[#fbf3ec] hover:bg-white/5"
//                     >
//                         Log in
//                     </Link>
//                 </div>
//             </div>

//             <div className="mt-12">
//                 <PhoneShowcase />
//             </div>
//         </section>
//     );
// }





import Link from "next/link";
import FancyHeading from "./HeroMirror";
import PhoneShowcase from "./Phonemock";
// import PhoneShowcase from "./PhoneShowcase";

export default function Hero() {
    return (
        <section className="relative overflow-hidden rounded-b-[2.5rem] bg-[#0a0503] bg-[radial-gradient(ellipse_at_top_right,#3D2416,#1C110A_60%)] px-4 pt-28 sm:px-6 md:pt-32">
            <div className="mx-auto max-w-3xl text-center">
                {/* <h1 className="font-serif text-[length:clamp(2.2rem,6vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em] text-[#fbf3ec]">
                    One app.
                    <br />
                    <span className="text-[#b89a88]">Every transaction you need.</span>
                </h1> */}
                 <FancyHeading />
                <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[#d3bba7]">
                    Gift cards, currency swaps, airtime, data, betting and TV subscriptions in one place. Fast, secure and always reliable.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/Account/loginaccount"
                        className="rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] px-7 py-3 text-sm font-bold text-[#1a0d05] shadow-lg shadow-orange-900/40"
                    >
                        Open account
                    </Link>
                    <Link
                        href="/Account/Signin"
                        className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-[#fbf3ec] hover:bg-white/5"
                    >
                        Log in
                    </Link>
                </div>
            </div>

            <div className="mt-12">
                <PhoneShowcase />
            </div>
        </section>
    );
}