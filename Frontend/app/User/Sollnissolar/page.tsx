"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Sun, BatteryCharging, Zap, Home, Building2, Wrench,
    ShieldCheck, ClipboardList, MessageCircle, CheckCircle2, ChevronRight,
} from "lucide-react";

// Replace with your real WhatsApp number (international format, no + or spaces)
const WHATSAPP_NUMBER = "2349136745664";

type SolarType = {
    id: string;
    name: string;
    tagline: string;
    powers: string;
    icon: any;
};

// Edit these to match what Sollnis Solar actually sells
const SOLAR_TYPES: SolarType[] = [
    {
        id: "generator",
        name: "Solar generator",
        tagline: "Plug-and-play power station. No wiring, no fuel.",
        powers: "Phones, lights, fans, TV, laptop",
        icon: Zap,
    },
    // {
    //     id: "battery",
    //     name: "Lithium battery pack",
    //     tagline: "Replace your old inverter batteries with longer-lasting lithium.",
    //     powers: "Works with your existing inverter",
    //     icon: BatteryCharging,
    // },
    // {
    //     id: "hybrid",
    //     name: "Panels and inverter system",
    //     tagline: "Solar panels, inverter and batteries sized to your home.",
    //     powers: "Fridge, freezer, TV, fans, pumping machine",
    //     icon: Sun,
    // },
    {
        id: "home",
        name: "Full home setup",
        tagline: "We survey, design, install and maintain the whole system.",
        powers: "Whole-house power, including heavy appliances",
        icon: Home,
    },
    {
        id: "business",
        name: "Shop or office setup",
        tagline: "Reliable power for your business hours, with less spent on diesel.",
        powers: "POS, computers, lighting, cold storage",
        icon: Building2,
    },
];

const STEPS = [
    { title: "Tell us what you need", text: "Pick a solar type and send your details." },
    { title: "We confirm and survey", text: "We call you, then visit if you need an installation." },
    { title: "Get your quote", text: "You receive a clear price for equipment and installation." },
    { title: "Install and support", text: "We install, test, and stay available after." },
];

export default function SolarPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string>("");
    const [form, setForm] = useState({ name: "", phone: "", location: "", notes: "" });
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const chosen = SOLAR_TYPES.find((t) => t.id === selected);

    const pickType = (id: string) => {
        setSelected(id);
        setError("");
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chosen) return setError("Choose a solar type first.");
        if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) {
            return setError("Fill in your name, phone number and location.");
        }
        const text =
            `Hello Sollnissolar, I'd like a quotation.\n\n` +
            `Solar type: ${chosen.name}\n` +
            `Name: ${form.name}\n` +
            `Phone: ${form.phone}\n` +
            `Location: ${form.location}\n` +
            (form.notes.trim() ? `Notes: ${form.notes}\n` : "");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
        setSent(true);
    };

    const input =
        "w-full rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-[#fbf3ec] placeholder:text-[#8f7768] outline-none focus:border-[#ff7a3d] focus:ring-2 focus:ring-[#ff7a3d]/30";

    return (
        <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)]">
            <div className="pointer-events-none absolute -top-16 left-1/4 w-72 h-72 rounded-full bg-[#ff7a3d]/25 blur-[80px]" />
            <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">

                {/* Top bar */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.07] border border-white/10 text-[#d8c3b6] hover:text-white"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg font-semibold text-[#fbf3ec]">Sollnissolar</h1>
                </div>

                {/* Hero */}
                <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#150a06] p-6 sm:p-10 shadow-2xl shadow-black/40">
                    {/* <svg
                        className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 sm:w-[26rem] sm:h-[26rem]"
                        viewBox="0 0 400 400"
                        fill="none"
                        aria-hidden
                    >
                        {[40, 80, 120, 160, 200].map((r, i) => (
                            <circle key={r} cx="200" cy="200" r={r} stroke="#f4b860" strokeOpacity={0.5 - i * 0.08} />
                        ))}
                        <circle cx="200" cy="200" r="22" fill="#f4b860" fillOpacity="0.5" />
                    </svg> */}

                    {/* background photo */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/sollnisbanner1.png')" }}
                        aria-hidden
                    />
                    {/* dark overlay so the text stays readable */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-[#150a06]/95 via-[#150a06]/75 to-[#150a06]/40"
                        aria-hidden
                    />
                    <div className="relative max-w-xl">
                        <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fbf3ec] leading-tight">
                            Power your home with the sun
                        </h2>
                        <p className="mt-4 text-sm sm:text-base text-[#d8c3b6] leading-relaxed">
                            Solar generators, lithium batteries and full installations from Sollnissolar.
                            Choose what fits you and get a quotation without leaving the app.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a
                                href="#types"
                                className="rounded-xl px-6 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                            >
                                Choose your solar type
                            </a>
                            <a
                                href="#quote"
                                className="rounded-xl px-6 py-3 font-bold text-sm text-[#fbf3ec] bg-white/[0.06] border border-white/15"
                            >
                                Request a quotation
                            </a>
                        </div>
                    </div>
                </section>

                {/* Solar types */}
                <section id="types" className="mt-10 scroll-mt-6">
                    <h3 className="font-serif italic text-xl sm:text-2xl text-[#fbf3ec]">Choose your solar type</h3>
                    <p className="mt-1 text-sm text-[#8f7768]">Not sure? Pick the closest one and we'll advise you.</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {SOLAR_TYPES.map((t) => {
                            const Icon = t.icon;
                            const active = selected === t.id;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => pickType(t.id)}
                                    aria-pressed={active}
                                    className={`text-left rounded-2xl border p-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a3d] ${
                                        active
                                            ? "border-[#ff7a3d] bg-[#2a150c]"
                                            : "border-white/[0.08] bg-[#1e100a] hover:border-white/25"
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] text-white">
                                            <Icon size={20} />
                                        </span>
                                        {active ? (
                                            <CheckCircle2 size={20} className="text-[#ff7a3d]" />
                                        ) : (
                                            <ChevronRight size={18} className="text-[#8f7768]" />
                                        )}
                                    </div>
                                    <p className="mt-4 font-semibold text-[#fbf3ec]">{t.name}</p>
                                    <p className="mt-1 text-sm text-[#b89a88] leading-relaxed">{t.tagline}</p>
                                    <p className="mt-3 text-xs text-[#f4b860]">Good for: {t.powers}</p>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Quote form */}
                <section id="quote" className="mt-10 scroll-mt-6">
                    <div className="rounded-2xl border border-white/[0.08] bg-[#1e100a] p-5 sm:p-8 max-w-2xl">
                        <h3 className="font-serif italic text-xl sm:text-2xl text-[#fbf3ec]">Request a quotation</h3>

                        {sent ? (
                            <div className="mt-5 flex items-start gap-3 text-sm text-[#d8c3b6]">
                                <CheckCircle2 className="text-[#ff7a3d] shrink-0" size={20} />
                                <p>
                                    Your request for a <b className="text-[#fbf3ec]">{chosen?.name}</b> is ready in
                                    WhatsApp. Send it and we'll reply with your quotation.{" "}
                                    <button onClick={() => setSent(false)} className="underline text-[#ff7a3d]">
                                        Edit request
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="mt-5 space-y-4">
                                <div>
                                    <label className="block text-xs text-[#8f7768] mb-1.5">Solar type</label>
                                    <div className="rounded-xl bg-white/[0.05] border border-white/10 px-4 py-3 text-sm text-[#fbf3ec]">
                                        {chosen ? chosen.name : <span className="text-[#8f7768]">Pick one from the list above</span>}
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="sname" className="block text-xs text-[#8f7768] mb-1.5">Full name</label>
                                        <input id="sname" className={input} value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label htmlFor="sphone" className="block text-xs text-[#8f7768] mb-1.5">Phone number</label>
                                        <input id="sphone" type="tel" inputMode="tel" className={input} value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="sloc" className="block text-xs text-[#8f7768] mb-1.5">Location (town and state)</label>
                                    <input id="sloc" className={input} value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="snotes" className="block text-xs text-[#8f7768] mb-1.5">
                                        What do you want to power? (optional)
                                    </label>
                                    <textarea id="snotes" rows={3} className={input} value={form.notes}
                                        placeholder="e.g. fridge, TV, 4 fans, pumping machine"
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                                </div>

                                {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-7 py-3 font-bold text-sm text-[#1a0d05] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] shadow-lg shadow-orange-900/40"
                                >
                                    <MessageCircle size={16} />
                                    Send request on WhatsApp
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                {/* How it works */}
                <section className="mt-10">
                    <h3 className="font-serif italic text-xl sm:text-2xl text-[#fbf3ec]">How it works</h3>
                    <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((s, i) => (
                            <li key={s.title} className="rounded-2xl border border-white/[0.08] bg-[#1e100a] p-5">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ff7a3d]/15 text-[#ff7a3d] text-sm font-bold">
                                    {i + 1}
                                </span>
                                <p className="mt-3 font-semibold text-[#fbf3ec]">{s.title}</p>
                                <p className="mt-1 text-sm text-[#b89a88]">{s.text}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Trust */}
                <section className="mt-10 grid gap-3 sm:grid-cols-3">
                    {[
                        { icon: Wrench, title: "Professional installation", text: "Done by our own engineers." },
                        { icon: ShieldCheck, title: "Warranty and support", text: "Help is one message away." },
                        { icon: ClipboardList, title: "Clear quotations", text: "Equipment and labour listed separately." },
                    ].map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#1e100a] p-5">
                            <Icon size={20} className="text-[#f4b860] shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-sm text-[#fbf3ec]">{title}</p>
                                <p className="text-sm text-[#b89a88]">{text}</p>
                            </div>
                        </div>
                    ))}
                </section>

                <p className="mt-8 text-center text-xs text-[#8f7768]">
                    Questions? <Link href="/UserDashboard" className="text-[#ff7a3d]">Back to dashboard</Link>
                </p>
            </div>
        </div>
    );
}