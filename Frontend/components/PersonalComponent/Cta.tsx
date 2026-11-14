import Link from "next/link";
import { PhoneFrame, WalletScreen } from "./Phonemock";
// import { PhoneFrame, WalletScreen } from "./PhoneMock";

export default function CTA() {
    return (
        <section className="bg-[#fbf3ec] px-4 py-20 sm:px-6">
            <div className="relative mx-auto grid max-w-6xl items-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff7a3d] to-[#c1440e] px-8 pt-12 sm:px-14 md:grid-cols-2 md:py-0">
                <span className="pointer-events-none absolute -bottom-10 -left-4 select-none font-serif text-[12rem] font-bold italic leading-none text-white/10">
                    Sollnis
                </span>
                <div className="relative pb-12 md:py-16">
                    <p className="text-sm font-semibold text-[#1a0d05]/70">Built for you. Built for tomorrow.</p>
                    <h2 className="mt-3 font-serif text-4xl font-medium leading-tight text-white md:text-5xl">
                        Start paying with SollnisPay today
                    </h2>
                    <Link
                        href="/Account/loginaccount"
                        className="mt-8 inline-block rounded-full bg-[#1a0d05] px-7 py-3 text-sm font-bold text-[#fbf3ec]"
                    >
                        Open account
                    </Link>
                </div>
                <div className="relative mx-auto h-[300px] overflow-hidden md:ml-auto md:mr-0 md:mt-12 md:h-[360px]">
                    <PhoneFrame className="h-[560px] -rotate-3">
                        <WalletScreen />
                    </PhoneFrame>
                </div>
            </div>
        </section>
    );
}