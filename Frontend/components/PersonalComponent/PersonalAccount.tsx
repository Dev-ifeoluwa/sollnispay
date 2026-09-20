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
              src={"/app001.png"}
              alt=""
              width={350}
              height={350}
              // className="-rotate-20"
            />
          </Animate>
        </div>
        {/* left */}
        <div className="flex flex-col gap-6 w-full max-w-md">
          <p className="text-gray-700 text-center w-40 p-1 bg-orange-100 rounded-2xl text-sm md:text-md">Personal Account</p>
          <Animate type="fade-left" delay={300}>
            <h2 
            className="text-balance mb-6 max-w-lg text-2xl font-bold leading-tight mt-0.5 md:text-3xl lg:text-5xl font-[family-name:var(--font-serif)] text-brand-brown leading-[1.02] tracking-[-0.025em]"
            // className="mb-5 max-w-lg text-2xl mt-0.5 md:text-3xl lg:text-5xl font-bold leading-tight text-brand-brown"
            >Bill payments, made effortless all for you</h2>
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
