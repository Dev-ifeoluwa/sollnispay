import { Products } from 'public/ProductList'
import Link from "next/link";
import { ArrowBigDownIcon, PenIcon } from 'lucide-react';

export default function AccountProductCard() {
  
  return (
    <>
      <div className="flex flex-col gap-3 px-4 py-8">
        <div className="flex items-center justify-between">
          <h4 className="text-lg md:text-xl text-orange-950 font-semibold">
            Avaliable Service
          </h4>
          <span className="flex cursor-pointer items-baseline-last gap-2 font-semibold text-orange-950">
            {/* <PenIcon size={15} /> */}
            {/* <p>Sell all</p> */}
            <Link href={"/User/ViewMore"}>More</Link>
          </span>
        </div>
        {/* product card */}
        <div className="mt-3 text-center justify-center items-center">
          <div className="grid grid-cols-3 lg:grid-cols-4 p-0.5 gap-2">
            {Products.map(({Name, href, icon: Icon}) => (
              <Link href={href}
                key={Name}
                className="shadow-sm flex flex-col items-center gap-3 shadow-orange-200 cursor-pointer rounded-xl px-2 py-4 text-orange-950 text-sm"
              >
                <Icon />
                <p>{Name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
