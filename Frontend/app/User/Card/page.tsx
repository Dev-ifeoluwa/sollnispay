// 'use client';

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';

// // ===== SETTINGS: adjust these to match your app =====
// const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
// const TOKEN_KEY = 'token'; // the localStorage key your login page saves the access token under
// // Sandbox only: skips the real image upload and sends Yangaplug's placeholder image instead
// const SANDBOX_IMAGES = process.env.NEXT_PUBLIC_CARDS_SANDBOX === 'true';
// const SANDBOX_IMAGE = 'https://img.freepik.com/free-photo/front-view-sensitive-man-crying_23-2149438519.jpg';
// const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
// const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// // ===== helpers =====
// class ApiError extends Error {
//   status: number;
//   constructor(status: number, message: string) {
//     super(message);
//     this.status = status;
//   }
// }

// async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
//   const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
//   const res = await fetch(`${API_URL}${path}`, {
//     ...init,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(init.headers ?? {}),
//     },
//   });
//   let body: any = null;
//   try {
//     body = await res.json();
//   } catch {
//     // no JSON body
//   }
//   if (!res.ok) {
//     const m = body?.message;
//     throw new ApiError(res.status, Array.isArray(m) ? m.join(', ') : m || 'Something went wrong');
//   }
//   return body as T;
// }

// // Yangaplug needs a LINK to each image, so the photo is uploaded first and only the link is sent on.
// async function uploadImage(file: File | null): Promise<string> {
//   if (SANDBOX_IMAGES) return SANDBOX_IMAGE;
//   if (!file) throw new Error('Please add both photos.');
//   if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Photo upload is not set up yet.');
//   const form = new FormData();
//   form.append('file', file);
//   form.append('upload_preset', UPLOAD_PRESET);
//   const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
//     method: 'POST',
//     body: form,
//   });
//   const data = await res.json().catch(() => null);
//   if (!res.ok || !data?.secure_url) throw new Error('Photo upload failed. Please try again.');
//   return data.secure_url as string;
// }

// type Holder = { enrolled: boolean; status: string | null; kycVerified: boolean };
// type Card = { id: number; issuer: string; last4: string | null; status: string; balanceCents: number };

// const input =
//   'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-orange-500';
// const primaryBtn =
//   'w-full rounded-xl bg-orange-500 py-3 font-semibold text-black disabled:opacity-50';

// // ===== enroll form =====
// function EnrollForm({ onDone }: { onDone: () => void }) {
//   const [f, setF] = useState({
//     bvn: '',
//     dob: '',
//     id_type: 'NIN',
//     id_number: '',
//     address_line_1: '',
//     city: '',
//     state: '',
//     postal_code: '',
//   });
//   const [idFile, setIdFile] = useState<File | null>(null);
//   const [selfie, setSelfie] = useState<File | null>(null);
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState('');

//   const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
//     setF((p) => ({ ...p, [k]: e.target.value }));

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setErr('');
//     setBusy(true);
//     try {
//       const [id_image, selfie_image] = await Promise.all([uploadImage(idFile), uploadImage(selfie)]);
//       await api('/cards/cardholder', {
//         method: 'POST',
//         body: JSON.stringify({ ...f, country: 'NG', id_image, selfie_image }),
//       });
//       setF((p) => ({ ...p, bvn: '', id_number: '' })); // do not keep sensitive values around
//       onDone();
//     } catch (e: any) {
//       setErr(e.message || 'Something went wrong');
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <form onSubmit={submit} className="space-y-3">
//       <h2 className="text-lg font-semibold">Verify your identity</h2>
//       <p className="text-sm text-white/60">
//         We need this once to issue your dollar card. Your details are sent securely to our card partner.
//       </p>
//       <input className={input} placeholder="BVN (11 digits)" inputMode="numeric" maxLength={11} value={f.bvn} onChange={set('bvn')} required />
//       <label className="block text-xs text-white/60">Date of birth</label>
//       <input className={input} type="date" value={f.dob} onChange={set('dob')} required />
//       <select className={input} value={f.id_type} onChange={set('id_type')}>
//         <option value="NIN">NIN</option>
//         <option value="PASSPORT">International passport</option>
//         <option value="VOTERS_CARD">Voter&apos;s card</option>
//         <option value="DRIVERS_LICENSE">Driver&apos;s license</option>
//       </select>
//       <input className={input} placeholder="ID number" value={f.id_number} onChange={set('id_number')} required />
//       <input className={input} placeholder="Street address" value={f.address_line_1} onChange={set('address_line_1')} required />
//       <div className="grid grid-cols-2 gap-3">
//         <input className={input} placeholder="City" value={f.city} onChange={set('city')} required />
//         <input className={input} placeholder="State" value={f.state} onChange={set('state')} required />
//       </div>
//       <input className={input} placeholder="Postal code" value={f.postal_code} onChange={set('postal_code')} required />

//       {!SANDBOX_IMAGES && (
//         <>
//           <label className="block text-xs text-white/60">Photo of your ID</label>
//           <input className={input} type="file" accept="image/*" onChange={(e) => setIdFile(e.target.files?.[0] ?? null)} />
//           <label className="block text-xs text-white/60">Selfie</label>
//           <input className={input} type="file" accept="image/*" capture="user" onChange={(e) => setSelfie(e.target.files?.[0] ?? null)} />
//         </>
//       )}

//       {err && <p className="text-sm text-red-400">{err}</p>}
//       <button className={primaryBtn} disabled={busy}>
//         {busy ? 'Submitting...' : 'Submit'}
//       </button>
//     </form>
//   );
// }

// // ===== fund sheet =====
// function FundSheet({ card, onClose, onDone }: { card: Card; onClose: () => void; onDone: () => void }) {
//   const [amount, setAmount] = useState('');
//   const [pin, setPin] = useState('');
//   const [quote, setQuote] = useState<number | null>(null);
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState('');
//   const [msg, setMsg] = useState('');
//   const requestId = useRef(crypto.randomUUID()); // one per attempt: a double tap can never fund twice

//   const usd = Number(amount);
//   const valid = Number.isFinite(usd) && usd >= 1 && usd <= 500 && Math.round(usd * 100) / 100 === usd;

//   useEffect(() => {
//     setQuote(null);
//     if (!valid) return;
//     const t = setTimeout(async () => {
//       try {
//         const q = await api<{ ngn: number }>(`/cards/quote?usd=${usd}`);
//         setQuote(q.ngn);
//       } catch {
//         // the quote is only informational
//       }
//     }, 400);
//     return () => clearTimeout(t);
//   }, [usd, valid]);

//   async function submit() {
//     setErr('');
//     setBusy(true);
//     try {
//       const r = await api<{ status: string; chargedNgn: number }>(`/cards/${card.id}/fund`, {
//         method: 'POST',
//         body: JSON.stringify({ amountUsd: usd, pin, requestId: requestId.current }),
//       });
//       if (r.status === 'SUCCESS') {
//         onDone();
//         onClose();
//         return;
//       }
//       if (r.status === 'PENDING') {
//         setMsg('Your top-up is being processed. Your card balance will update shortly.');
//         onDone();
//         return;
//       }
//       setErr('Top-up failed. You have not been charged.');
//       requestId.current = crypto.randomUUID();
//     } catch (e: any) {
//       setErr(e.message || 'Something went wrong');
//       requestId.current = crypto.randomUUID(); // a failed attempt must never be replayed
//     } finally {
//       setBusy(false);
//       setPin('');
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
//       <div
//         className="mx-auto w-full max-w-md rounded-t-3xl bg-[#241510] p-5 space-y-4"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="text-lg font-semibold">Fund card</h3>
//         {msg ? (
//           <>
//             <p className="text-sm text-white/80">{msg}</p>
//             <button className={primaryBtn} onClick={onClose}>
//               Done
//             </button>
//           </>
//         ) : (
//           <>
//             <div>
//               <label className="text-xs text-white/60">Amount in USD</label>
//               <input
//                 className={input}
//                 inputMode="decimal"
//                 placeholder="10"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//               />
//               {valid && quote !== null && (
//                 <p className="mt-2 text-sm text-white/70">
//                   You will pay <span className="font-semibold text-orange-400">₦{quote.toLocaleString()}</span> from your wallet
//                 </p>
//               )}
//               {amount !== '' && !valid && <p className="mt-2 text-xs text-red-400">Enter an amount from $1 to $500.</p>}
//             </div>
//             <div>
//               <label className="text-xs text-white/60">Transaction PIN</label>
//               <input
//                 className={input}
//                 type="password"
//                 inputMode="numeric"
//                 maxLength={6}
//                 value={pin}
//                 onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
//               />
//             </div>
//             {err && <p className="text-sm text-red-400">{err}</p>}
//             <button className={primaryBtn} disabled={busy || !valid || pin.length < 4} onClick={submit}>
//               {busy ? 'Processing...' : 'Confirm and pay'}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ===== page =====
// export default function CardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [holder, setHolder] = useState<Holder | null>(null);
//   const [cards, setCards] = useState<Card[]>([]);
//   const [error, setError] = useState('');
//   const [fundOpen, setFundOpen] = useState(false);
//   const [issuer, setIssuer] = useState<'mastercard' | 'visa'>('mastercard');
//   const [creating, setCreating] = useState(false);
//   const [createErr, setCreateErr] = useState('');

//   const load = useCallback(async () => {
//     try {
//       const [h, c] = await Promise.all([api<Holder>('/cards/cardholder'), api<Card[]>('/cards')]);
//       setHolder(h);
//       setCards(c);
//       setError('');
//     } catch (e: any) {
//       if (e?.status === 401) {
//         router.replace('/Account/Signin');
//         return;
//       }
//       setError(e.message || 'Could not load your card');
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const card = cards.find((c) => ['PENDING', 'ACTIVE', 'FROZEN'].includes(c.status)) ?? null;

//   // While something is still being set up, check again every 8 seconds for up to 2 minutes
//   const waiting = card?.status === 'PENDING' || (!!holder?.enrolled && !holder.kycVerified && !card);
//   useEffect(() => {
//     if (!waiting) return;
//     const t = setInterval(load, 8000);
//     const stop = setTimeout(() => clearInterval(t), 120000);
//     return () => {
//       clearInterval(t);
//       clearTimeout(stop);
//     };
//   }, [waiting, load]);

//   async function createCard() {
//     setCreateErr('');
//     setCreating(true);
//     try {
//       await api('/cards', { method: 'POST', body: JSON.stringify({ issuer }) });
//       await load();
//     } catch (e: any) {
//       setCreateErr(e.message || 'Something went wrong');
//     } finally {
//       setCreating(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-[#1a0f0a] px-4 py-6 text-white">
//       <div className="mx-auto max-w-md space-y-5">
//         <header className="flex items-center gap-3">
//           <button onClick={() => router.back()} className="rounded-full bg-white/10 px-3 py-1 text-sm">
//             Back
//           </button>
//           <h1 className="text-xl font-semibold">Sollnis Card</h1>
//         </header>

//         {loading && <p className="text-white/60">Loading...</p>}

//         {error && (
//           <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-300">
//             {error}
//             <button className="ml-2 underline" onClick={load}>
//               Retry
//             </button>
//           </div>
//         )}

//         {!loading && !error && holder && !holder.enrolled && <EnrollForm onDone={load} />}

//         {!loading && !error && holder?.enrolled && !card && (
//           <section className="space-y-4">
//             {!holder.kycVerified && (
//               <p className="rounded-xl bg-orange-500/10 p-4 text-sm text-orange-200">
//                 Your verification is still being reviewed. You can create your card once it is approved.
//               </p>
//             )}
//             <h2 className="text-lg font-semibold">Get your dollar card</h2>
//             <div className="grid grid-cols-2 gap-3">
//               {(['mastercard', 'visa'] as const).map((i) => (
//                 <button
//                   key={i}
//                   onClick={() => setIssuer(i)}
//                   className={`rounded-xl border px-4 py-4 text-sm font-semibold capitalize ${
//                     issuer === i ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5'
//                   }`}
//                 >
//                   {i}
//                 </button>
//               ))}
//             </div>
//             {createErr && <p className="text-sm text-red-400">{createErr}</p>}
//             <button className={primaryBtn} disabled={creating} onClick={createCard}>
//               {creating ? 'Creating...' : 'Create virtual card'}
//             </button>
//           </section>
//         )}

//         {!loading && !error && card && (
//           <section className="space-y-4">
//             <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-[#5a2d12] p-5 shadow-lg">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="font-semibold capitalize">{card.issuer}</span>
//                 <span className="rounded-full bg-black/30 px-3 py-1 text-xs">
//                   {card.status === 'PENDING' ? 'Creating...' : card.status === 'FROZEN' ? 'Frozen' : 'Active'}
//                 </span>
//               </div>
//               <p className="mt-8 text-lg tracking-widest">•••• •••• •••• {card.last4 ?? '••••'}</p>
//               <div className="mt-6">
//                 <p className="text-xs text-white/70">Balance</p>
//                 <p className="text-2xl font-bold">${(card.balanceCents / 100).toFixed(2)}</p>
//               </div>
//             </div>

//             {card.status === 'PENDING' && (
//               <p className="text-sm text-white/60">
//                 Your card is being created. This usually takes a moment and this page will update by itself.
//               </p>
//             )}
//             {card.status === 'ACTIVE' && (
//               <button className={primaryBtn} onClick={() => setFundOpen(true)}>
//                 Fund card
//               </button>
//             )}
//           </section>
//         )}
//       </div>

//       {fundOpen && card && <FundSheet card={card} onClose={() => setFundOpen(false)} onDone={load} />}
//     </main>
//   );
// }








'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ===== DEMO DATA (replace with real API data later) =====
const DEMO_CARD = {
  holder: '*******',
  number: '4829 5107 3392 7316',
  expiry: '**/**',
  cvv: '418',
  billing: '12 Admiralty Way, Lekki Phase 1, Lagos, NG',
};
const DEMO_RATE = 1550; // demo NGN per 1 USD

type Tx = { id: number; title: string; date: string; amount: number };

const DEMO_TXS: Tx[] = [
  { id: 1, title: 'Netflix', date: 'Today, 9:41 AM', amount: -6.99 },
  { id: 2, title: 'Wallet top-up', date: 'Yesterday', amount: 50 },
  { id: 3, title: 'Figma', date: '11 Nov', amount: -15 },
  { id: 4, title: 'Amazon', date: '9 Nov', amount: -32.5 },
  { id: 5, title: 'Spotify', date: '6 Nov', amount: -4.99 },
];

const money = (n: number) =>
  `${n < 0 ? '-' : n > 0 ? '+' : ''}$${Math.abs(n).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const primaryBtn =
  'w-full rounded-xl bg-orange-500 py-3 font-semibold text-black transition active:scale-[0.98] disabled:opacity-50';
const inputCls =
  'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-orange-500';

// ===== small icons =====
const Icon = ({ d, className = 'h-5 w-5' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS = {
  plus: 'M12 5v14M5 12h14',
  down: 'M12 4v12m0 0l-5-5m5 5l5-5M5 20h14',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A9.7 9.7 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.1 3.9M6.6 6.7C3.6 8.6 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 004.2 4.2',
  copy: 'M9 9h10v11H9zM5 15V4h10',
};

// ===== THE SOLLNIS CARD =====
function SollnisCard({
  revealed,
  frozen,
}: {
  revealed: boolean;
  frozen: boolean;
}) {
  const [a, b, c, d] = DEMO_CARD.number.split(' ');
  return (
    <div
      className={`relative mx-auto aspect-[1.586/1] w-full max-w-md overflow-hidden rounded-3xl text-[#FFF3E6] ring-1 ring-[#FFC48A]/30 transition duration-500 ${
        frozen ? 'saturate-[.35] brightness-90' : ''
      }`}
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
            <span className="grid h-7 w-7 place-items-center rounded-full border-[1.5px] border-[#FFB066]">
              <span className="h-3 w-3 rounded-full bg-[#FFB066]" />
            </span>
            <span className="text-lg font-medium tracking-wide">Sollnis</span>
          </div>
          <span className="rounded-full bg-[#FFF3E6]/20 px-3 py-1 text-xs text-[#FFE2C2]">
            {frozen ? 'Frozen' : 'Virtual'}
          </span>
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
        <p className="font-mono text-[clamp(1rem,5.2vw,1.4rem)] font-medium tracking-[0.12em]">
          {revealed ? `${a} ${b} ${c} ${d}` : `${a} •••• •••• ${d}`}
        </p>

        {/* bottom row */}
        <div className="flex items-end justify-between">
          <div className="flex gap-8">
            <div>
              <p className="text-[11px] text-[#F6C9A0]">Card holder</p>
              <p className="text-sm font-medium sm:text-[15px]">{DEMO_CARD.holder}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#F6C9A0]">Expires</p>
              <p className="text-sm font-medium sm:text-[15px]">{DEMO_CARD.expiry}</p>
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

// ===== fund sheet (demo only) =====
function FundSheet({ onClose, onFunded }: { onClose: () => void; onFunded: (usd: number) => void }) {
  const [amount, setAmount] = useState('');
  const usd = Number(amount);
  const valid = Number.isFinite(usd) && usd >= 1 && usd <= 500;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div className="mx-auto w-full max-w-md space-y-4 rounded-t-3xl bg-[#241510] p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">Fund card</h3>
        <div>
          <label className="text-xs text-white/60">Amount in USD</label>
          <input className={inputCls} inputMode="decimal" placeholder="10" value={amount} onChange={(e) => setAmount(e.target.value)} />
          {valid && (
            <p className="mt-2 text-sm text-white/70">
              You will pay <span className="font-semibold text-orange-400">₦{(usd * DEMO_RATE).toLocaleString()}</span> from your wallet
            </p>
          )}
          {amount !== '' && !valid && <p className="mt-2 text-xs text-red-400">Enter an amount from $1 to $500.</p>}
        </div>
        <button
          className={primaryBtn}
          disabled={!valid}
          onClick={() => {
            onFunded(usd);
            onClose();
          }}
        >
          Confirm and pay
        </button>
      </div>
    </div>
  );
}

// ===== page =====
export default function CardPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(124.5);
  const [txs, setTxs] = useState<Tx[]>(DEMO_TXS);
  const [revealed, setRevealed] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [fundOpen, setFundOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(DEMO_CARD.number.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  }

  function onFunded(usd: number) {
    setBalance((b) => b + usd);
    setTxs((t) => [{ id: Date.now(), title: 'Wallet top-up', date: 'Just now', amount: usd }, ...t]);
  }

  const actions = [
    { label: 'Fund', icon: ICONS.plus, onClick: () => setFundOpen(true), disabled: frozen },
    { label: 'Withdraw', icon: ICONS.down, onClick: () => {}, disabled: frozen },
    { label: frozen ? 'Unfreeze' : 'Freeze', icon: ICONS.snow, onClick: () => setFrozen((f) => !f), disabled: false },
    { label: revealed ? 'Hide' : 'Details', icon: revealed ? ICONS.eyeOff : ICONS.eye, onClick: () => setRevealed((r) => !r), disabled: false },
  ];

  return (
    <main className="min-h-screen bg-[#1a0f0a] px-4 py-6 text-white">
      <div className="mx-auto w-full space-y-6">
        <header className="flex items-center gap-3 mb-10">
          <button onClick={() => router.back()} 
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3a2a20] bg-[#261a13] text-[#f3e9df] transition hover:bg-[#32231a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9a45b]">
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
          <h1 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">Sollnis Card</h1>
        </header>

        {/* card on top */}
        <SollnisCard revealed={revealed} frozen={frozen} />

        {/* balance */}
        {/* <section className="text-center">
          <p className="text-xs text-white/60">Card balance</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-white/50">≈ ₦{Math.round(balance * DEMO_RATE).toLocaleString()}</p>
        </section> */}

        {/* quick actions */}
        {/* <section className="grid grid-cols-4 gap-3">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              disabled={a.disabled}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-xs transition active:scale-95 disabled:opacity-40"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-500/15 text-orange-400">
                <Icon d={a.icon} />
              </span>
              {a.label}
            </button>
          ))}
        </section> */}

        {/* card details */}
        {/* <section className="space-y-3 rounded-2xl border border-white/10 bg-[#241510] p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Card details</h2>
            <button onClick={copyNumber} className="flex items-center gap-1 text-xs text-orange-400">
              <Icon d={ICONS.copy} className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy number'}
            </button>
          </div>
          {[
            ['Card number', revealed ? DEMO_CARD.number : '•••• •••• •••• ••••'],
            ['Expiry date', DEMO_CARD.expiry],
            ['CVV', revealed ? DEMO_CARD.cvv : '•••'],
            ['Billing address', DEMO_CARD.billing],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 border-t border-white/5 pt-3 text-sm first:border-0 first:pt-0">
              <span className="text-white/60">{k}</span>
              <span className="text-right font-medium">{v}</span>
            </div>
          ))}
        </section> */}

        {/* transactions */}
        {/* <section className="space-y-2">
          <h2 className="font-semibold">Recent transactions</h2>
          <ul className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-[#241510]">
            {txs.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-500/15 text-sm font-semibold text-orange-400">
                    {t.title[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-white/50">{t.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>{money(t.amount)}</span>
              </li>
            ))}
          </ul>
        </section> */}
      </div>

      {fundOpen && <FundSheet onClose={() => setFundOpen(false)} onFunded={onFunded} />}
    </main>
  );
}