import Animate from "components/Animate";
import Image from "next/image";
import Link from "next/link";

export default function PersonalAccount() {
  return (
    <div className="px-2 py-8 md:px-8">
      <div className="flex flex-col-reverse items-center gap-5 md:flex-row justify-between px-2 py-3 md:px-15 md:py-4">
        <div>
          <Animate type="fade-up" delay={300}>
            <Image
              src={"/back22.png"}
              alt=""
              width={700}
              height={800}
              className="rounded-b-[800px]"
            />
          </Animate>
        </div>
        {/* left */}
        <div className="flex flex-col gap-6 w-full max-w-md">
          <p className="text-gray-700 text-center w-40 p-1 bg-orange-100 rounded-2xl text-sm md:text-md">Personal Account</p>
          <Animate type="fade-left" delay={300}>
            <h2 className="mb-5 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold leading-tight text-brand-brown">Bill payments, made effortless all for you</h2>
          </Animate>
          <p className="text-[17px] text-gray-700">
            Paying bills shouldn't be complicated. We take
             your money seriously, 
            so we built a platform where 
            you can manage your funds, make payments, and settle every
             bill all in one place.
          </p>
          <Link
            href={"/Account/loginaccount"}
            className="bg-orange-600 w-full max-w-40 text-white font-semibold px-1 py-2 md:p-4 text-center rounded-full"
          >Learn More</Link>
        </div>
        {/* right */}
      </div>
    </div>
  );
}
