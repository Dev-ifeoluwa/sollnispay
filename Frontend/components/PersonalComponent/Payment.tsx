import Animate from "components/Animate";
import Image from "next/image";
import Link from "next/link";

export default function Payment() {
  return (
    <div className="px-2 py-4 md:px-8 bg-[#2B1810]">
      <div className="flex flex-col-reverse gap-5 items-center md:flex-row justify-between px-2 py-3 md:px-20 md:py-6">
        {/* left */}
        <div className="flex flex-col gap-6 w-full max-w-md">
          <p className="text-gray-700 text-center w-25 p-1 bg-orange-100 rounded-2xl text-sm md:text-md">Payment</p>
          <Animate type="fade-left" delay={300}>
            <h2 className="mb-5 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold text-white">Every transaction delivered without failure</h2>
          </Animate>
          <p className="text-[17px] text-gray-300">
            Enjoy Smooth Money Moves! Transfer funds to loved 
            ones, buy airtime, convert funds and settle bills effortlessly 
            at Sollnispay.
          </p>
          <Link 
            href={"/Account/loginaccount"}
            className="bg-orange-600 w-full max-w-40 text-white font-semibold px-1 py-2 md:p-4 text-center rounded-full"
            >Learn More</Link>
        </div>
        {/* right */}
        <div className="max-w-[250px] md:max-w-md lg:max-w-lg">
          <Animate type="fade-down" delay={300}>
            <Image src={"/app11.png"} alt="" width={300} height={300} />
          </Animate>
        </div>
      </div>
    </div>
  );
}
