'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ===== SETTINGS: adjust these to match your app =====
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
const TOKEN_KEY = 'token'; // the localStorage key your login page saves the access token under
// Sandbox only: skips the real image upload and sends Yangaplug's placeholder image instead
const SANDBOX_IMAGES = process.env.NEXT_PUBLIC_CARDS_SANDBOX === 'true';
const SANDBOX_IMAGE = 'https://img.freepik.com/free-photo/front-view-sensitive-man-crying_23-2149438519.jpg';
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// ===== helpers =====
class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }
  if (!res.ok) {
    const m = body?.message;
    throw new ApiError(res.status, Array.isArray(m) ? m.join(', ') : m || 'Something went wrong');
  }
  return body as T;
}

// Yangaplug needs a LINK to each image, so the photo is uploaded first and only the link is sent on.
async function uploadImage(file: File | null): Promise<string> {
  if (SANDBOX_IMAGES) return SANDBOX_IMAGE;
  if (!file) throw new Error('Please add both photos.');
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Photo upload is not set up yet.');
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.secure_url) throw new Error('Photo upload failed. Please try again.');
  return data.secure_url as string;
}

type Holder = { enrolled: boolean; status: string | null; kycVerified: boolean };
type Card = { id: number; issuer: string; last4: string | null; status: string; balanceCents: number };

const input =
  'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-orange-500';
const primaryBtn =
  'w-full rounded-xl bg-orange-500 py-3 font-semibold text-black disabled:opacity-50';

// ===== enroll form =====
function EnrollForm({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState({
    bvn: '',
    dob: '',
    id_type: 'NIN',
    id_number: '',
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const [id_image, selfie_image] = await Promise.all([uploadImage(idFile), uploadImage(selfie)]);
      await api('/cards/cardholder', {
        method: 'POST',
        body: JSON.stringify({ ...f, country: 'NG', id_image, selfie_image }),
      });
      setF((p) => ({ ...p, bvn: '', id_number: '' })); // do not keep sensitive values around
      onDone();
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="text-lg font-semibold">Verify your identity</h2>
      <p className="text-sm text-white/60">
        We need this once to issue your dollar card. Your details are sent securely to our card partner.
      </p>
      <input className={input} placeholder="BVN (11 digits)" inputMode="numeric" maxLength={11} value={f.bvn} onChange={set('bvn')} required />
      <label className="block text-xs text-white/60">Date of birth</label>
      <input className={input} type="date" value={f.dob} onChange={set('dob')} required />
      <select className={input} value={f.id_type} onChange={set('id_type')}>
        <option value="NIN">NIN</option>
        <option value="PASSPORT">International passport</option>
        <option value="VOTERS_CARD">Voter&apos;s card</option>
        <option value="DRIVERS_LICENSE">Driver&apos;s license</option>
      </select>
      <input className={input} placeholder="ID number" value={f.id_number} onChange={set('id_number')} required />
      <input className={input} placeholder="Street address" value={f.address_line_1} onChange={set('address_line_1')} required />
      <div className="grid grid-cols-2 gap-3">
        <input className={input} placeholder="City" value={f.city} onChange={set('city')} required />
        <input className={input} placeholder="State" value={f.state} onChange={set('state')} required />
      </div>
      <input className={input} placeholder="Postal code" value={f.postal_code} onChange={set('postal_code')} required />

      {!SANDBOX_IMAGES && (
        <>
          <label className="block text-xs text-white/60">Photo of your ID</label>
          <input className={input} type="file" accept="image/*" onChange={(e) => setIdFile(e.target.files?.[0] ?? null)} />
          <label className="block text-xs text-white/60">Selfie</label>
          <input className={input} type="file" accept="image/*" capture="user" onChange={(e) => setSelfie(e.target.files?.[0] ?? null)} />
        </>
      )}

      {err && <p className="text-sm text-red-400">{err}</p>}
      <button className={primaryBtn} disabled={busy}>
        {busy ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}

// ===== fund sheet =====
function FundSheet({ card, onClose, onDone }: { card: Card; onClose: () => void; onDone: () => void }) {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [quote, setQuote] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const requestId = useRef(crypto.randomUUID()); // one per attempt: a double tap can never fund twice

  const usd = Number(amount);
  const valid = Number.isFinite(usd) && usd >= 1 && usd <= 500 && Math.round(usd * 100) / 100 === usd;

  useEffect(() => {
    setQuote(null);
    if (!valid) return;
    const t = setTimeout(async () => {
      try {
        const q = await api<{ ngn: number }>(`/cards/quote?usd=${usd}`);
        setQuote(q.ngn);
      } catch {
        // the quote is only informational
      }
    }, 400);
    return () => clearTimeout(t);
  }, [usd, valid]);

  async function submit() {
    setErr('');
    setBusy(true);
    try {
      const r = await api<{ status: string; chargedNgn: number }>(`/cards/${card.id}/fund`, {
        method: 'POST',
        body: JSON.stringify({ amountUsd: usd, pin, requestId: requestId.current }),
      });
      if (r.status === 'SUCCESS') {
        onDone();
        onClose();
        return;
      }
      if (r.status === 'PENDING') {
        setMsg('Your top-up is being processed. Your card balance will update shortly.');
        onDone();
        return;
      }
      setErr('Top-up failed. You have not been charged.');
      requestId.current = crypto.randomUUID();
    } catch (e: any) {
      setErr(e.message || 'Something went wrong');
      requestId.current = crypto.randomUUID(); // a failed attempt must never be replayed
    } finally {
      setBusy(false);
      setPin('');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-md rounded-t-3xl bg-[#241510] p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Fund card</h3>
        {msg ? (
          <>
            <p className="text-sm text-white/80">{msg}</p>
            <button className={primaryBtn} onClick={onClose}>
              Done
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-white/60">Amount in USD</label>
              <input
                className={input}
                inputMode="decimal"
                placeholder="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {valid && quote !== null && (
                <p className="mt-2 text-sm text-white/70">
                  You will pay <span className="font-semibold text-orange-400">₦{quote.toLocaleString()}</span> from your wallet
                </p>
              )}
              {amount !== '' && !valid && <p className="mt-2 text-xs text-red-400">Enter an amount from $1 to $500.</p>}
            </div>
            <div>
              <label className="text-xs text-white/60">Transaction PIN</label>
              <input
                className={input}
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button className={primaryBtn} disabled={busy || !valid || pin.length < 4} onClick={submit}>
              {busy ? 'Processing...' : 'Confirm and pay'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ===== page =====
export default function CardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [holder, setHolder] = useState<Holder | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState('');
  const [fundOpen, setFundOpen] = useState(false);
  const [issuer, setIssuer] = useState<'mastercard' | 'visa'>('mastercard');
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState('');

  const load = useCallback(async () => {
    try {
      const [h, c] = await Promise.all([api<Holder>('/cards/cardholder'), api<Card[]>('/cards')]);
      setHolder(h);
      setCards(c);
      setError('');
    } catch (e: any) {
      if (e?.status === 401) {
        router.replace('/Account/Signin');
        return;
      }
      setError(e.message || 'Could not load your card');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const card = cards.find((c) => ['PENDING', 'ACTIVE', 'FROZEN'].includes(c.status)) ?? null;

  // While something is still being set up, check again every 8 seconds for up to 2 minutes
  const waiting = card?.status === 'PENDING' || (!!holder?.enrolled && !holder.kycVerified && !card);
  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(load, 8000);
    const stop = setTimeout(() => clearInterval(t), 120000);
    return () => {
      clearInterval(t);
      clearTimeout(stop);
    };
  }, [waiting, load]);

  async function createCard() {
    setCreateErr('');
    setCreating(true);
    try {
      await api('/cards', { method: 'POST', body: JSON.stringify({ issuer }) });
      await load();
    } catch (e: any) {
      setCreateErr(e.message || 'Something went wrong');
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#1a0f0a] px-4 py-6 text-white">
      <div className="mx-auto max-w-md space-y-5">
        <header className="flex items-center gap-3">
          <button onClick={() => router.back()} className="rounded-full bg-white/10 px-3 py-1 text-sm">
            Back
          </button>
          <h1 className="text-xl font-semibold">Sollnis Card</h1>
        </header>

        {loading && <p className="text-white/60">Loading...</p>}

        {error && (
          <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-300">
            {error}
            <button className="ml-2 underline" onClick={load}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && holder && !holder.enrolled && <EnrollForm onDone={load} />}

        {!loading && !error && holder?.enrolled && !card && (
          <section className="space-y-4">
            {!holder.kycVerified && (
              <p className="rounded-xl bg-orange-500/10 p-4 text-sm text-orange-200">
                Your verification is still being reviewed. You can create your card once it is approved.
              </p>
            )}
            <h2 className="text-lg font-semibold">Get your dollar card</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['mastercard', 'visa'] as const).map((i) => (
                <button
                  key={i}
                  onClick={() => setIssuer(i)}
                  className={`rounded-xl border px-4 py-4 text-sm font-semibold capitalize ${
                    issuer === i ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            {createErr && <p className="text-sm text-red-400">{createErr}</p>}
            <button className={primaryBtn} disabled={creating} onClick={createCard}>
              {creating ? 'Creating...' : 'Create virtual card'}
            </button>
          </section>
        )}

        {!loading && !error && card && (
          <section className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-[#5a2d12] p-5 shadow-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold capitalize">{card.issuer}</span>
                <span className="rounded-full bg-black/30 px-3 py-1 text-xs">
                  {card.status === 'PENDING' ? 'Creating...' : card.status === 'FROZEN' ? 'Frozen' : 'Active'}
                </span>
              </div>
              <p className="mt-8 text-lg tracking-widest">•••• •••• •••• {card.last4 ?? '••••'}</p>
              <div className="mt-6">
                <p className="text-xs text-white/70">Balance</p>
                <p className="text-2xl font-bold">${(card.balanceCents / 100).toFixed(2)}</p>
              </div>
            </div>

            {card.status === 'PENDING' && (
              <p className="text-sm text-white/60">
                Your card is being created. This usually takes a moment and this page will update by itself.
              </p>
            )}
            {card.status === 'ACTIVE' && (
              <button className={primaryBtn} onClick={() => setFundOpen(true)}>
                Fund card
              </button>
            )}
          </section>
        )}
      </div>

      {fundOpen && card && <FundSheet card={card} onClose={() => setFundOpen(false)} onDone={load} />}
    </main>
  );
}