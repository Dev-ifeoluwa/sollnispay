import { Products } from 'public/ProductList'
import Link from "next/link";
import { ArrowRight } from 'lucide-react';

export default function AccountProductCard() {
  const [featured, ...rest] = Products;
  const sideItems = rest.slice(0, 2);
  const gridItems = rest.slice(2);

  return (
    <div className="flex flex-col gap-4 py-6 sm:px-3">
      <div className="flex items-center justify-between">
        <h4 className="text-lg sm:text-xl font-semibold italic font-serif text-[#fbf3ec]">
          Quick actions
        </h4>
        <Link
          href={"/User/ViewMore"}
          className="text-sm font-bold text-[#ff7a3d] hover:text-[#ffa06b] transition"
        >
          See all
        </Link>
      </div>

      {/* Feature tile + stacked side tiles */}
      {featured && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link
            href={featured.href}
            className="row-span-2 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#3a1c0d] to-[#241209] px-4 py-5 sm:px-5 sm:py-6 min-h-[190px] sm:min-h-[210px]"
          >
            <div>
              <span className="inline-block text-[11px] font-bold text-[#f4b860] bg-[#f4b860]/15 px-2.5 py-1 rounded-full">
                Popular
              </span>
              <p className="mt-3 text-base sm:text-lg font-semibold italic font-serif text-[#fbf3ec] leading-snug">
                {featured.Name}
              </p>
              {/* {featured.description && (
                <p className="mt-1.5 text-xs sm:text-sm text-[#8f7768] leading-relaxed">
                  {featured.description}
                </p>
              )} */}
            </div>
            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ff7a3d] text-[#1a0d05]">
              <ArrowRight size={16} />
            </span>
          </Link>

          <div className="flex flex-col gap-3 sm:gap-4">
            {sideItems.map(({ Name, href, icon: Icon }) => (
              <Link
                href={href}
                key={Name}
                className="flex flex-1 flex-col justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-4 py-4 sm:px-5"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                  <Icon size={18} />
                </span>
                <p className="text-sm font-semibold text-[#fbf3ec]">{Name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Remaining tiles */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {gridItems.map(({ Name, href, icon: Icon }) => (
            <Link
              href={href}
              key={Name}
              className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#26140c] px-3 py-4 sm:px-4"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff7a3d]/15 text-[#ff7a3d]">
                <Icon size={18} />
              </span>
              <p className="text-sm font-semibold text-[#fbf3ec]">{Name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}











// second uI 
// import { Products } from 'public/ProductList'
// import Link from "next/link";
// import { ArrowBigDownIcon, PenIcon } from 'lucide-react';

// export default function AccountProductCard() {
  
//   return (
//     <>
//       <div className="flex flex-col gap-3 px-4 py-8">
//         <div className="flex items-center justify-between">
//           <h4 className="text-lg md:text-xl text-orange-950 font-semibold">
//             Avaliable Service
//           </h4>
//           <span className="flex cursor-pointer items-baseline-last gap-2 font-semibold text-orange-950">
//             {/* <PenIcon size={15} /> */}
//             {/* <p>Sell all</p> */}
//             <Link href={"/User/ViewMore"}>More</Link>
//           </span>
//         </div>
//         {/* product card */}
//         <div className="mt-3 text-center justify-center items-center">
//           <div className="grid grid-cols-3 lg:grid-cols-4 p-0.5 gap-2">
//             {Products.map(({Name, href, icon: Icon}) => (
//               <Link href={href}
//                 key={Name}
//                 className="shadow-sm flex flex-col items-center gap-3 shadow-orange-200 cursor-pointer rounded-xl px-2 py-4 text-orange-950 text-sm"
//               >
//                 <Icon />
//                 <p>{Name}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



