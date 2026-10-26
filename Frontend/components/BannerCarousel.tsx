// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useCallback, useEffect, useRef, useState } from "react";

// export type Banner = {
//   src: string; // e.g. "/banners/sollnis-quote.png" (file in /public/banners)
//   alt: string;
//   href?: string; // optional: makes the banner clickable
// };

// type BannerCarouselProps = {
//   banners: Banner[];
//   /** Time between automatic slides, in ms */
//   interval?: number;
//   /** How long auto-scroll stays paused after the user touches/scrolls, in ms */
//   resumeAfter?: number;
//   /** Show the dot indicators */
//   showDots?: boolean;
//   /** Extra classes for the outer wrapper (spacing, width, etc.) */
//   className?: string;
// };

// export default function BannerCarousel({
//   banners,
//   interval = 4000,
//   resumeAfter = 5000,
//   showDots = true,
//   className = "",
// }: BannerCarouselProps) {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const hoveringRef = useRef(false);
//   const pausedUntilRef = useRef(0);
//   const [active, setActive] = useState(0);

//   const goTo = useCallback((index: number) => {
//     const el = trackRef.current;
//     if (!el) return;
//     el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
//   }, []);

//   // Auto-scroll: moves to the next banner, loops back to the first
//   useEffect(() => {
//     if (banners.length < 2) return;
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

//     const id = setInterval(() => {
//       const el = trackRef.current;
//       if (!el || hoveringRef.current || Date.now() < pausedUntilRef.current) {
//         return;
//       }
//       const current = Math.round(el.scrollLeft / el.clientWidth);
//       goTo((current + 1) % banners.length);
//     }, interval);

//     return () => clearInterval(id);
//   }, [banners.length, interval, goTo]);

//   // Keep the dots in sync, whether the scroll came from auto-play or a swipe
//   const handleScroll = () => {
//     const el = trackRef.current;
//     if (!el) return;
//     setActive(Math.round(el.scrollLeft / el.clientWidth));
//   };

//   // Pause auto-scroll briefly when the user interacts
//   const pauseForUser = () => {
//     pausedUntilRef.current = Date.now() + resumeAfter;
//   };

//   return (
//     <section
//       className={`relative w-full ${className}`}
//       aria-roledescription="carousel"
//       aria-label="Promotions"
//     >
//       <div
//         ref={trackRef}
//         onScroll={handleScroll}
//         onTouchStart={pauseForUser}
//         onPointerDown={pauseForUser}
//         onWheel={pauseForUser}
//         onMouseEnter={() => (hoveringRef.current = true)}
//         onMouseLeave={() => (hoveringRef.current = false)}
//         className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//       >
//         {banners.map((banner, i) => {
//           const image = (
//             <div className="relative aspect-[2/1] w-full">
//               <Image
//                 src={banner.src}
//                 alt={banner.alt}
//                 fill
//                 sizes="(min-width: 1024px) 1024px, 100vw"
//                 priority={i === 0}
//                 draggable={false}
//                 className="select-none object-cover"
//               />
//             </div>
//           );

//           return (
//             <div
//               key={banner.src}
//               className="w-full shrink-0 snap-center"
//               role="group"
//               aria-roledescription="slide"
//               aria-label={`${i + 1} of ${banners.length}`}
//             >
//               {banner.href ? <Link href={banner.href}>{image}</Link> : image}
//             </div>
//           );
//         })}
//       </div>

//       {showDots && banners.length > 1 && (
//         <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm">
//           {banners.map((banner, i) => (
//             <button
//               key={banner.src}
//               type="button"
//               aria-label={`Go to banner ${i + 1}`}
//               aria-current={i === active}
//               onClick={() => {
//                 pauseForUser();
//                 goTo(i);
//               }}
//               className={`h-1.5 rounded-full transition-all ${
//                 i === active ? "w-5 bg-white" : "w-1.5 bg-white/60"
//               }`}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }








"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type Banner = {
  src: string | StaticImageData; // e.g. "/quote.png" (file in /public) or an imported image
  alt: string;
  href?: string; // optional: makes the banner clickable
};

type BannerCarouselProps = {
  banners: Banner[];
  /** Time between automatic slides, in ms */
  interval?: number;
  /** How long auto-scroll stays paused after the user touches/scrolls, in ms */
  resumeAfter?: number;
  /** Show the dot indicators */
  showDots?: boolean;
  /** Extra classes for the outer wrapper (spacing, width, etc.) */
  className?: string;
};

export default function BannerCarousel({
  banners,
  interval = 4000,
  resumeAfter = 5000,
  showDots = true,
  className = "",
}: BannerCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);
  const pausedUntilRef = useRef(0);
  const [active, setActive] = useState(0);

  const getIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return 0;
    return Math.round(el.scrollLeft / el.clientWidth);
  }, []);

  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, []);

  // Auto-scroll: moves to the next banner, loops back to the first
  useEffect(() => {
    if (banners.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || hoveringRef.current || Date.now() < pausedUntilRef.current) {
        return;
      }
      goTo((getIndex() + 1) % banners.length);
    }, interval);

    return () => clearInterval(id);
  }, [banners.length, interval, goTo, getIndex]);

  // Keep the active slide aligned after a window resize
  useEffect(() => {
    const onResize = () => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollTo({ left: active * el.clientWidth, behavior: "auto" });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  // Keep the dots in sync, whether the scroll came from auto-play or a swipe
  const handleScroll = () => {
    const index = getIndex();
    setActive((prev) => (prev === index ? prev : index));
  };

  // Pause auto-scroll briefly when the user interacts
  const pauseForUser = () => {
    pausedUntilRef.current = Date.now() + resumeAfter;
  };

  return (
    <section
      className={`relative w-full ${className}`}
      aria-roledescription="carousel"
      aria-label="Promotions"
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={pauseForUser}
        onPointerDown={pauseForUser}
        onWheel={pauseForUser}
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
        className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((banner, i) => {
          const image = (
            <div className="relative aspect-[2/1] w-full">
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority={i === 0}
                draggable={false}
                className="select-none object-cover"
              />
            </div>
          );

          return (
            <div
              key={`banner-${i}`}
              className="w-full shrink-0 snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${banners.length}`}
            >
              {banner.href ? (
                <Link href={banner.href} draggable={false}>
                  {image}
                </Link>
              ) : (
                image
              )}
            </div>
          );
        })}
      </div>

      {showDots && banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm">
          {banners.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`Go to banner ${i + 1}`}
              aria-current={i === active}
              onClick={() => {
                pauseForUser();
                setActive(i);
                goTo(i);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}