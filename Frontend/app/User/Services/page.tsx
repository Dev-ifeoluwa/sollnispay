"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

/**
 * All Services page  ->  app/User/Services/page.tsx
 *
 * To wire a service later, just set its `href` below.
 * Services with no href show a "Soon" tag and don't navigate.
 */

type Service = {
  id: string;
  name: string;
  description: string;
  href?: string; // <- add the route when the service page is ready
  icon: ReactNode;
};

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const SERVICES: Service[] = [
  {
    id: "travel",
    name: "Travel",
    description: "Flights and trip bookings",
    href: undefined,
    icon: (
      <svg {...iconProps}>
        <path d="M2 16l20-8-8 14-3-6-9 0z" />
        <path d="M11 16l11-8" />
      </svg>
    ),
  },
  {
    id: "dollar-card",
    name: "Dollar Virtual Card",
    description: "Pay online in USD",
    href: undefined,
    icon: (
      <svg {...iconProps}>
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </svg>
    ),
  },
  {
    id: "sollnis-solar",
    name: "Sollnissolar",
    description: "Solar power and batteries",
    href: undefined,
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    id: "airtime-to-cash",
    name: "Airtime to Cash",
    description: "Convert airtime to naira",
    href: undefined,
    icon: (
      <svg {...iconProps}>
        <path d="M17 3l4 4-4 4" />
        <path d="M21 7H8a5 5 0 00-5 5" />
        <path d="M7 21l-4-4 4-4" />
        <path d="M3 17h13a5 5 0 005-5" />
      </svg>
    ),
  },
  {
    id: "print-recharge-card",
    name: "Print Recharge Card",
    description: "Generate recharge PINs to print",
    href: undefined,
    icon: (
      <svg {...iconProps}>
        <path d="M6 9V3h12v6" />
        <rect x="3" y="9" width="18" height="8" rx="2" />
        <path d="M6 14h12v7H6z" />
      </svg>
    ),
  },
  {
    id: "save-and-spend",
    name: "Save and Spend",
    description: "Lock money away, spend what's left",
    href: undefined,
    icon: (
      <svg {...iconProps}>
        <path d="M3 7a2 2 0 012-2h13a1 1 0 011 1v3" />
        <path d="M3 7v11a2 2 0 002 2h14a1 1 0 001-1v-3" />
        <path d="M21 10h-5a2 2 0 000 4h5z" />
      </svg>
    ),
  },
];

export default function AllServicesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SERVICES;
    return SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)] text-[#f3e9df]">
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
        {/* Header */}
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2a20] bg-[#261a13] text-[#f3e9df] transition hover:bg-[#32231a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9a45b]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold tracking-tight">All services</h1>
        </header>

        {/* Search */}
        <div className="relative mt-6">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a8927f]"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services"
            aria-label="Search services"
            className="w-full rounded-2xl border border-[#3a2a20] bg-[#261a13] py-3 pl-11 pr-4 text-sm text-[#f3e9df] placeholder:text-[#a8927f] focus:border-[#d9a45b] focus:outline-none"
          />
        </div>

        {/* Grid */}
        {results.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {results.map((s) => {
              const ready = Boolean(s.href);
              const card = (
                <div
                  className={`relative flex h-full flex-col gap-3 rounded-2xl border p-4 transition ${
                    ready
                      ? "border-[#3a2a20] bg-[#261a13] hover:border-[#d9a45b]/60 hover:bg-[#2d1f16]"
                      : "border-[#2e2018] bg-[#21160f] opacity-80"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                    {s.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold leading-snug">
                      {s.name}
                    </span>
                    <span className="mt-1 block text-xs leading-snug text-[#a8927f]">
                      {s.description}
                    </span>
                  </span>
                  {!ready && (
                    <span className="absolute right-3 top-3 rounded-full bg-[#3a2a20] px-2 py-0.5 text-[10px] font-medium text-[#d9a45b]">
                      Soon
                    </span>
                  )}
                </div>
              );

              return (
                <li key={s.id}>
                  {ready ? (
                    <Link
                      href={s.href!}
                      className="block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9a45b]"
                    >
                      {card}
                    </Link>
                  ) : (
                    <div aria-disabled="true" className="h-full cursor-not-allowed">
                      {card}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-[#a8927f]">
            No service matches &ldquo;{query}&rdquo;. Try a different word.
          </p>
        )}
      </div>
    </main>
  );
}