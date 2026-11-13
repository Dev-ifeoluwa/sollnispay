'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CREATION_FEE_USD = 6;

// ===== small icons =====
const Icon = ({ d, className = 'h-5 w-5' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS = {
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18',
  wallet: 'M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0V6a2 2 0 012-2h11M16 14h2',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  lock: 'M6 11V8a6 6 0 1112 0v3M5 11h14v10H5z',
  check: 'M5 13l4 4L19 7',
};

const FEATURES = [
  {
    icon: ICONS.globe,
    title: 'Pay online in dollars',
    text: 'Use your card on websites and apps that accept Mastercard or Visa, for subscriptions, shopping and more.',
  },
  {
    icon: ICONS.wallet,
    title: 'Fund it from your naira wallet',
    text: 'Top up in naira whenever you need to. You always see exactly what you will pay before you confirm.',
  },
  {
    icon: ICONS.bolt,
    title: 'Fully digital',
    text: 'Your card is created inside Sollnis Pay. There is nothing to collect and no branch to visit.',
  },
  {
    icon: ICONS.lock,
    title: 'Protected by your PIN',
    text: 'Every top-up needs your transaction PIN, so only you can add money to your card.',
  },
];

const STEPS = [
  { title: 'Verify your identity', text: 'A quick one-time check with your BVN, ID and a selfie.' },
  { title: 'Create your card', text: `Pay the one-time $${CREATION_FEE_USD} creation fee and your virtual card is issued.` },
  { title: 'Fund it and spend', text: 'Add dollars from your naira wallet, then use the card online.' },
];

const NEEDS = ['Your BVN', 'A valid ID: NIN, passport, voter\u2019s card or driver\u2019s license', 'A clear selfie'];

// ===== THE SOLLNIS CARD =====
function SollnisCard() {
  return (
    <div
      className="relative mx-auto aspect-[1.586/1] w-full max-w-md overflow-hidden rounded-3xl text-[#FFF3E6] ring-1 ring-[#FFC48A]/30"
      style={{ background: 'linear-gradient(135deg, #2B160C 0%, #6B3416 45%, #E8650A 100%)' }}
      >
      {/* sun rings, top right */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 440 277" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[60, 100, 140, 180].map((r, i) => (
          <circle key={r} cx="420" cy="60" r={r} fill="none" stroke="#FFC48A" strokeOpacity={0.18 - i * 0.03} strokeWidth="1.5" />
        ))}
        <circle cx="350" cy="280" r="150" fill="#F58220" fillOpacity="0.22" />
        <circle cx="380" cy="310" r="110" fill="#FFB066" fillOpacity="0.16" />
      </svg>

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        {/* top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <span className="grid h-7 w-7 place-items-center rounded-full border-[1.5px] border-[#FFB066]">
              <span className="h-3 w-3 rounded-full bg-[#FFB066]" />
            </span> */}
            <Image src="/favicon.ico" alt="logo" height={23} width={23} />
            <span className="text-md font-medium tracking-wide">Sollnispay</span>
          </div>
          <span className="rounded-full bg-[#FFF3E6]/20 px-3 py-1 text-xs text-[#FFE2C2]">Virtual</span>
        </div>

        {/* chip + contactless */}
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 50 38" className="h-9 w-12" aria-hidden="true">
            <rect width="50" height="38" rx="7" fill="#F2B866" />
            <path d="M0 13H50M0 25H50M25 0V38" stroke="#B97A2E" strokeWidth="1" fill="none" />
            <rect x="15" y="13" width="20" height="12" rx="3" fill="#F2B866" stroke="#B97A2E" strokeWidth="1" />
          </svg>
          <svg viewBox="0 0 30 44" className="h-9 w-6" fill="none" stroke="#FFE2C2" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M2 14q8 10 0 20" />
            <path d="M11 8q13 16 0 32" />
            <path d="M20 2q18 22 0 44" />
          </svg>
        </div>

        {/* number */}
        <p className="font-mono text-[clamp(1rem,5.2vw,1.4rem)] font-medium tracking-[0.12em]">•••• •••• •••• ••••</p>

        {/* bottom row */}
        <div className="flex items-end justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-[11px] text-[#F6C9A0]">Card holder</p>
              <p className="text-sm font-medium sm:text-[15px]">*****</p>
            </div>
            <div>
              <p className="text-[11px] text-[#F6C9A0]">Expires</p>
              <p className="text-sm font-medium sm:text-[15px]">••/••</p>
            </div>
          </div>
          <div className="flex" aria-hidden="true">
            <span className="h-7 w-7 rounded-full bg-[#2B160C]/60" />
            <span className="-ml-2.5 h-7 w-7 rounded-full bg-[#FFD9A8]/90" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== page =====
export default function VirtualCardLandingPage() {
  const router = useRouter();
  const goVerify = () => router.push('');
  // const goVerify = () => router.push('/User/Card/Verify');

  return (
    // <main className="min-h-screen bg-[#1a0f0a] px-4 py-6 pb-32 text-white">
    //   <div className="mx-auto w-full space-y-6">
    <main className="flex min-h-screen flex-col bg-[#1a0f0a] px-4 pt-6 text-white">
      <div className="mx-auto w-full flex-1 space-y-6 pb-6">
        <header className="mb-10 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2a20] bg-[#261a13] text-[#f3e9df] transition hover:bg-[#32231a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9a45b]"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="font-serif text-lg font-semibold italic text-[#fbf3ec] sm:text-xl">Virtual card</h1>
        </header>

        {/* card on top */}
        <SollnisCard />

        <div className="mx-auto  w-full max-w-xl space-y-8">
          {/* intro */}
          {/* <section className="space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Your dollar card, inside Sollnis Pay</h2>
            <p className="text-sm leading-relaxed text-white/65">
              Get a virtual Sollnis card for paying online in dollars. Fund it from your naira wallet and spend it
              anywhere Mastercard or Visa is accepted online.
            </p>
          </section> */}

          {/* fee */}
          <section className="flex mt-5 items-center justify-between gap-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4">
            <div>
              <p className="text-sm font-semibold">One-time card creation fee</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                Charged once when your card is created. Funding your card is separate, and you will see the cost before
                you confirm.
              </p>
            </div>
            <p className="shrink-0 text-3xl font-bold text-orange-400">${CREATION_FEE_USD}</p>
          </section>

          {/* features */}
          {/* <section className="space-y-3">
            <h2 className="font-semibold">Why get one</h2>
            <ul className="space-y-3">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3 rounded-2xl border border-white/10 bg-[#241510] p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-500/15 text-orange-400">
                    <Icon d={f.icon} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section> */}

          {/* how it works */}
          {/* <section className="space-y-3">
            <h2 className="font-semibold">How it works</h2>
            <ol className="space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-500 text-sm font-bold text-black">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/60">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section> */}

          {/* what you need */}
          <section className="space-y-3 rounded-2xl border border-white/10 bg-[#241510] p-4">
            <h2 className="font-semibold">What you will need</h2>
            <ul className="space-y-2">
              {NEEDS.map((n) => (
                <li key={n} className="flex items-start gap-2 text-sm text-white/75">
                  <Icon d={ICONS.check} className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                  {n}
                </li>
              ))}
            </ul>
            {/* <p className="text-xs text-white/50">It takes about two minutes, and you only do it once.</p> */}
          </section>
        </div>
      </div>

      {/* sticky call to action */}
      {/* <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[#1a0f0a] via-[#1a0f0a]/95 to-transparent px-4 pb-5 pt-8">
        <div className="mx-auto w-full max-w-xl">
          <button
            onClick={goVerify}
            className="w-full rounded-xl bg-orange-500 py-3.5 font-semibold text-black transition active:scale-[0.98]"
          >
            Get your card
          </button>
          <p className="mt-2 text-center text-xs text-white/50">One-time ${CREATION_FEE_USD} creation fee</p>
        </div>
      </div> */}
            {/* call to action: sticks to the bottom inside the page, solid background */}
      <div className="sticky bottom-0 z-40 -mx-4 border-t border-white/5 bg-[#1a0f0a] px-4 pb-5 pt-4">
        <div className="mx-auto w-full max-w-xl">
          <button
            onClick={goVerify}
            className="w-full rounded-xl bg-orange-500 py-3.5 font-semibold text-black transition active:scale-[0.98]"
          >
            Get your card
          </button>
          {/* <p className="mt-2 text-center text-xs text-white/50">One-time ${CREATION_FEE_USD} creation fee</p> */}
        </div>
      </div>
    </main>
  );
}