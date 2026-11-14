// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import Image from "next/image";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <nav className="w-full fixed top-0 left-0 bg-[#2B1810] text-[#F4E3D3] shadow-md z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center gap-2 text-2xl font-bold text-white">
//             <span className="bg-[#1C110A] ring-1 ring-orange-500/40 rounded-full p-1">
//               <Image src="/favicon.ico" alt="logo" height="23" width="23" />
//             </span>
//             <Link href="/Personal">
//               Sollnispay
//               <span className="text-orange-500 font-bold text-3xl">.</span>
//             </Link>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex space-x-15 text-lg">
//             {/* <Link href="/Business" className="hover:text-orange-300 transition-colors">
//               Business
//             </Link> */}
//             <Link href="/Personal" className="hover:text-orange-300 transition-colors">
//               Personal
//             </Link>
//             <Link href="/About" className="block hover:text-orange-300 transition-colors">
//               About
//             </Link>
//             <Link href="/Company" className="hover:text-orange-300 transition-colors">
//               Company
//             </Link>
//             <Link href="/Contact" className="hover:text-orange-300 transition-colors">
//               Contact
//             </Link>
//           </div>

//           {/* Get Started Button */}
//           <div className="hidden md:block relative px-6 py-2 font-semibold rounded-md overflow-hidden group bg-orange-500 text-[#1F130C]">
//             <Link href="/Account/loginaccount">
//               <span className="absolute inset-0 bg-[#1F130C] translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
//               <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-500">
//                 Open Account
//               </span>
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button onClick={toggleMenu}>
//               {isOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Sidebar */}
//       {isOpen && (
//         <div className="md:hidden bg-[#1F130C] text-[#F4E3D3] px-6 py-4 space-y-4">
//           {/* <Link href="/Business" className="block hover:text-orange-300">
//            Business
//           </Link> */}
//           <Link href="/Personal" className="block hover:text-orange-300">
//             Personal
//           </Link>
//           <Link href="/" className="block hover:text-orange-300">
//             About Us
//           </Link>
//           <Link href="/Company" className="block hover:text-orange-300">
//             Company
//           </Link>
//           <Link href="/Contact" className="block hover:text-orange-300">
//             Contact
//           </Link>
//           <Link
//             href="/Account/loginaccount"
//             className="relative inline-block px-6 py-2 font-semibold rounded-md overflow-hidden group bg-orange-500 text-[#1F130C]"
//           >
//             <span className="absolute inset-0 bg-[#1C110A] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
//             <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-500">
//               Open Account
//             </span>
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }





"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const links = [
    { href: "/Personal", label: "Personal" },
    { href: "/About", label: "About" },
    { href: "/Company", label: "Company" },
    { href: "/Contact", label: "Contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-0 top-3 z-50 px-3 sm:px-6">
            {/* floating pill: dark, so it reads well over both the dark hero and the cream sections */}
            <nav
                aria-label="Main"
                className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#1a0f0a]/95 pl-4 pr-2 shadow-lg shadow-black/30 sm:pl-5"
            >
                {/* logo */}
                <Link href="/Personal" className="flex items-center gap-2 text-xl font-bold text-[#fbf3ec]">
                    <span className="rounded-full bg-[#0a0503] p-1 ring-1 ring-[#ff7a3d]/40">
                        <Image src="/favicon.ico" alt="" height={22} width={22} />
                    </span>
                    <span>
                        Sollnispay<span className="text-2xl text-[#ff7a3d]">.</span>
                    </span>
                </Link>

                {/* desktop links */}
                <div className="hidden items-center gap-8 text-[15px] text-[#d8c3b6] md:flex">
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} className="transition-colors hover:text-[#f4b860]">
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* desktop buttons */}
                <div className="hidden items-center gap-2 md:flex">
                    <Link
                        href="/Account/Signin"
                        className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-[#fbf3ec] transition-colors hover:bg-white/10"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/Account/loginaccount"
                        className="rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] px-5 py-2 text-sm font-bold text-[#1a0d05]"
                    >
                        Open account
                    </Link>
                </div>

                {/* mobile toggle */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#fbf3ec] md:hidden"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {/* mobile menu */}
            {open && (
                <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-white/10 bg-[#1a0f0a]/95 p-5 shadow-lg shadow-black/30 md:hidden">
                    <div className="flex flex-col gap-1">
                        {links.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-3 text-[#d8c3b6] hover:bg-white/5 hover:text-[#f4b860]"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <Link
                            href="/Account/Signin"
                            onClick={() => setOpen(false)}
                            className="rounded-full border border-white/20 py-3 text-center text-sm font-semibold text-[#fbf3ec]"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/Account/loginaccount"
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] py-3 text-center text-sm font-bold text-[#1a0d05]"
                        >
                            Open account
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}