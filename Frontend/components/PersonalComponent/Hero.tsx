// // import FancyHeading from "components/HeaderMirro";
// import Image from "next/image";
// import Link from "next/link";
// import FancyHeading from "./HeroMirror";
// import Animate from "components/Animate";

// export default function Hero() {
//   return (
//     <section className="flex items-center justify-between overflow-hidden bg-green-900 flex-col md:flex-row mt-15 px-2 py-8 md:px-10 mx-auto md:py-8">
//       <div className="flex flex-col gap-6 w-full max-w-2xl px-1 py-5 md:px-8">
//         <div className="mt-10 md:mt-20">
//           <p className="text-green-200 text-left text-sm md:text-lg">Built For You Built For Tomorrow</p>
//           <FancyHeading />
//         </div>
//           <p className="mt-4 max-w-2xl  text-white text-lg md:text-2xl cursor-default">
//             A fast simple and secure company to carryout daily to daily transactions and pay bills and more Shalompay
//             offers you a reliable experience.
//           </p>
//         {/* ----button section----- */}
//         <div className="flex items-center gap-5 px-2 md:px-1">
//           <div
//             className="mt-8 flex hover:bg-black items-center gap-4 bg-green-600 md:font-medium
//                 text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer 
//                 transition-colors duration-300"
//             >
//             <Link href={"/Account/loginaccount"} className="flex items-center">
//               <Image src="/playstore.svg" alt="logo" height="30" width="30" />
//               <span>
//                 <p className="text-sm md:text-xl font-medium">Get it on</p>
//                 <h2 className="text-md md:text-xl">Google Play</h2>
//               </span>
//             </Link>
//           </div>
//           {/*  */}
//           <div
//             className="mt-8 flex hover:bg-green-600 items-center gap-4 bg-black md:font-medium
//                 text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer 
//                 transition-colors duration-300"
//             >
//             <Link href={"/Account/loginaccount"} className="flex items-center">
//               <Image src="/apple.svg" alt="logo" height="30" width="30" />
//               <span>
//                 <p className="text-sm md:text-xl font-medium">Get it on</p>
//                 <h2 className="text-md md:text-xl">Apple Store</h2>
//               </span>
//             </Link>
//           </div>
//         </div>
//         {/* <div className="flex flex-col gap-7">
//           <h3 className="text-white font-serif text-lg mt-6 md:text-xl">
//             We're Working With
//           </h3>
//           <div className="flex gap-5 items-center">
//             <Image
//               src={"/client-logo-1.svg"}
//               className="animate-pulse"
//               alt=""
//               width={100}
//               height={30}
//             />
//             <Image
//               src={"/client-logo-2.svg"}
//               className="animate-pulse"
//               alt=""
//               width={100}
//               height={30}
//             />
//             <Image
//               src={"/client-logo-3.svg"}
//               className="animate-pulse"
//               alt=""
//               width={100}
//               height={30}
//             />
//           </div>
//         </div> */}
//       </div>
//       {/* -------------- */}
//       <div className="relative pr-0 md:pr-15 -mb-10 max-w-[250px] md:max-w-md lg:max-w-lg">
//         {/* right section */}
//         <Animate type="flip-right" delay={300}>
//           <Image 
//             src={"/app1.png"} 
//             alt="" 
//             width={350} 
//             height={350} 
//             className="rotate-20"/>
//         </Animate>
//         {/* <div className="absolute bottom-15 md:bottom-25 lg:bottom-30 left-1 md:-left-15 px-6 py-3 animate-bounce bg-green-500 rounded-xl max-w-[350px] text-white flex items-center gap-2">
//           <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">2+</h2>
//           <p className="text-md md:text-xl">
//             {" "}
//             Years of experience <br />
//             in finance
//           </p>
//         </div> */}
//       </div>
//     </section>
//   );
// }



// import FancyHeading from "components/HeaderMirro";
import Image from "next/image";
import Link from "next/link";
import FancyHeading from "./HeroMirror";
import Animate from "components/Animate";

export default function Hero() {
  return (
    <section className="flex items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_#3D2416,_#1C110A_60%)] flex-col md:flex-row mt-15 px-2 py-8 md:px-10 mx-auto md:py-8">
      <div className="flex flex-col gap-6 w-full max-w-2xl px-1 py-5 md:px-8">
        <div className="mt-10 md:mt-20">
          <p className="text-orange-300 text-left text-sm md:text-lg">Built For You Built For Tomorrow</p>
          <FancyHeading />
        </div>
          <p className="mt-4 max-w-2xl  text-[#F4E3D3] text-lg md:text-2xl cursor-default">
            No more juggling apps for every bill. Sollnis Pay brings your airtime 
            data cable and electricity payments together fast secure and always reliable.
          </p>
        {/* ----button section----- */}
        <div className="flex items-center gap-5 px-2 md:px-1">
          <div
            className="mt-8 flex hover:bg-[#1C110A] items-center gap-4 bg-orange-600 md:font-medium
                text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer 
                transition-colors duration-300"
            >
            <Link href={"/Account/loginaccount"} className="flex items-center">
              <Image src="/playstore.svg" alt="logo" height="30" width="30" />
              <span>
                <p className="text-sm md:text-xl font-medium">Get it on</p>
                <h2 className="text-md md:text-xl">Google Play</h2>
              </span>
            </Link>
          </div>
          {/*  */}
          <div
            className="mt-8 flex hover:bg-orange-600 items-center gap-4 bg-[#1C110A] md:font-medium
                text-white p-3 md:px-3 md:py-4 rounded-xl cursor-pointer 
                transition-colors duration-300"
            >
            <Link href={"/Account/loginaccount"} className="flex items-center">
              <Image src="/apple.svg" alt="logo" height="30" width="30" />
              <span>
                <p className="text-sm md:text-xl font-medium">Get it on</p>
                <h2 className="text-md md:text-xl">Apple Store</h2>
              </span>
            </Link>
          </div>
        </div>
        {/* <div className="flex flex-col gap-7">
          <h3 className="text-white font-serif text-lg mt-6 md:text-xl">
            We're Working With
          </h3>
          <div className="flex gap-5 items-center">
            <Image
              src={"/client-logo-1.svg"}
              className="animate-pulse"
              alt=""
              width={100}
              height={30}
            />
            <Image
              src={"/client-logo-2.svg"}
              className="animate-pulse"
              alt=""
              width={100}
              height={30}
            />
            <Image
              src={"/client-logo-3.svg"}
              className="animate-pulse"
              alt=""
              width={100}
              height={30}
            />
          </div>
        </div> */}
      </div>
      {/* -------------- */}
      <div className="relative pr-0 md:pr-15 -mb-10 max-w-[250px] md:max-w-md lg:max-w-lg">
        {/* right section */}
        <Animate type="flip-right" delay={300}>
          <Image 
            src={"/app11.png"} 
            alt="" 
            width={350} 
            height={350} 
            className="rotate-20"/>
        </Animate>
        {/* <div className="absolute bottom-15 md:bottom-25 lg:bottom-30 left-1 md:-left-15 px-6 py-3 animate-bounce bg-green-500 rounded-xl max-w-[350px] text-white flex items-center gap-2">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">2+</h2>
          <p className="text-md md:text-xl">
            {" "}
            Years of experience <br />
            in finance
          </p>
        </div> */}
      </div>
    </section>
  );
}
