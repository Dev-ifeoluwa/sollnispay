"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#2B1810] text-[#F4E3D3] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <span className="bg-[#1C110A] ring-1 ring-orange-500/40 rounded-full p-1">
              <Image src="/favicon.ico" alt="logo" height="23" width="23" />
            </span>
            <Link href="/Business">
              Sollnispay
              <span className="text-orange-500 font-bold text-3xl">.</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-15 text-lg">
            {/* <Link href="/Business" className="hover:text-orange-300 transition-colors">
              Business
            </Link> */}
            <Link href="/Personal" className="hover:text-orange-300 transition-colors">
              Personal
            </Link>
            <Link href="/" className="block hover:text-orange-300 transition-colors">
              About
            </Link>
            <Link href="/Company" className="hover:text-orange-300 transition-colors">
              Company
            </Link>
            <Link href="/Contact" className="hover:text-orange-300 transition-colors">
              Contact
            </Link>
          </div>

          {/* Get Started Button */}
          <div className="hidden md:block relative px-6 py-2 font-semibold rounded-md overflow-hidden group bg-orange-500 text-[#1F130C]">
            <Link href="/Account/loginaccount">
              <span className="absolute inset-0 bg-[#1F130C] translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
              <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-500">
                Open Account
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden bg-[#1F130C] text-[#F4E3D3] px-6 py-4 space-y-4">
          {/* <Link href="/Business" className="block hover:text-orange-300">
           Business
          </Link> */}
          <Link href="/Personal" className="block hover:text-orange-300">
            Personal
          </Link>
          <Link href="/" className="block hover:text-orange-300">
            About Us
          </Link>
          <Link href="/Company" className="block hover:text-orange-300">
            Company
          </Link>
          <Link href="/Contact" className="block hover:text-orange-300">
            Contact
          </Link>
          <Link
            href="/Account/loginaccount"
            className="relative inline-block px-6 py-2 font-semibold rounded-md overflow-hidden group bg-orange-500 text-[#1F130C]"
          >
            <span className="absolute inset-0 bg-[#1C110A] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
            <span className="relative z-10 group-hover:text-orange-300 transition-colors duration-500">
              Open Account
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}