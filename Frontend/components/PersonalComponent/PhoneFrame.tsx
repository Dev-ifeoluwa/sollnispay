import { ReactNode } from "react";

export default function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={`relative flex w-[280px] shrink-0 flex-col rounded-[2.8rem] border-[6px] border-[#3a2418] bg-[#0a0503] p-1.5 shadow-2xl shadow-black/50 ${className}`}
        >
            <div className="relative flex-1 overflow-hidden rounded-[2.2rem] bg-[linear-gradient(180deg,#1a0f0a_0%,#0e0704_40%,#0a0503_100%)] px-3 pt-2">
                <div className="mx-auto mb-3 h-4 w-16 rounded-full bg-black" />
                {children}
            </div>
        </div>
    );
}