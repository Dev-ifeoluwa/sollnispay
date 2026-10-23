// import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
// import Link from "next/link";

// export const fmtDate = (v?: string | null) => {
//     if (!v) return "";
//     const d = new Date(v);
//     return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
// };

// export const fmtTime = (v?: string | null) => {
//     if (!v) return "";
//     const d = new Date(v);
//     return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// };

// export default function TransactionRow({ tx }: { tx: any }) {
//     // wallet funding is money in, everything else is money out
//     const isCredit = tx.type === "WALLET_FUNDING";
//     const amountText = `${isCredit ? "+" : "-"}₦${Number(tx.amount).toLocaleString("en-NG", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//     })}`;

//     return (
//         <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4">
//             <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#26140c] border border-white/[0.08] text-[#ff7a3d]">
//                 {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
//             </div>
//             <Link
//                 href={`/user/receipt/${tx.id}`}
//                 className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
//                 <div className="min-w-0">
//                     <p className="text-sm font-semibold text-[#fbf3ec] truncate">{tx.itemsPurchased}</p>
//                     <div className="flex flex-wrap gap-x-1.5 text-[11px] sm:text-xs text-[#8f7768]">
//                         <span>{tx.description}</span>
//                         <span>{fmtDate(tx.dayPurchased ?? tx.createdAt)}</span>
//                         <span>{fmtTime(tx.itemsTime ?? tx.createdAt)}</span>
//                     </div>
//                 </div>
//                 <p className={`text-sm sm:text-base font-bold flex-shrink-0 ${isCredit ? "text-[#f4b860]" : "text-[#fbf3ec]"}`}>
//                     {amountText}
//                 </p>
//             </Link>
//         </div>
//     );
// }




import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const fmtDate = (v?: string | null) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
};

export const fmtTime = (v?: string | null) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function TransactionRow({ tx }: { tx: any }) {
    // wallet funding is money in, everything else is money out
    const isCredit = tx.type === "WALLET_FUNDING";
    const amountText = `${isCredit ? "+" : "-"}₦${Number(tx.amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

    return (
        // The whole row is the link now (icon + text + amount)
        <Link
            href={`/User/Receipt/${tx.id}`}
            className="flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 hover:bg-white/[0.03] transition"
        >
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#26140c] border border-white/[0.08] text-[#ff7a3d]">
                {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
            </div>

            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#fbf3ec] truncate">{tx.itemsPurchased}</p>
                    <div className="flex flex-wrap gap-x-1.5 text-[11px] sm:text-xs text-[#8f7768]">
                        <span>{tx.description}</span>
                        <span>{fmtDate(tx.dayPurchased ?? tx.createdAt)}</span>
                        <span>{fmtTime(tx.itemsTime ?? tx.createdAt)}</span>
                    </div>
                </div>
                <p className={`text-sm sm:text-base font-bold flex-shrink-0 ${isCredit ? "text-[#f4b860]" : "text-[#fbf3ec]"}`}>
                    {amountText}
                </p>
            </div>
        </Link>
    );
}