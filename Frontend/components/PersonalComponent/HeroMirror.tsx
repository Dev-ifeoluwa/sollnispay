"use client";

import Animate from "components/Animate";
import { useEffect } from "react";

export default function FancyHeading() {
  useEffect(() => {
    const lens = document.querySelector<HTMLElement>(".lens");
    const move = (e: MouseEvent) => {
      if (lens) {
        lens.style.top = `${e.clientY}px`;
        lens.style.left = `${e.clientX}px`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative group">
      <Animate type="fade-right" delay={300}>
        <h1 
          className="text-balance text-white text-[length:clamp(2.2rem,5.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.025em]"
          style={{ fontFamily: "'Playfair Display', serif" }}
          // className="text-2xl mt-0.5 md:text-3xl lg:text-5xl leading-tight lg:leading-18 text-white font-stretch-85% font-semibold"
        >
            <span className="text-orange-500 font-[family-name:var(--font-serif)]">One</span> app. Every transaction you need.
        </h1>
      </Animate>
      <div className="lens hidden group-hover:block group-active:block"></div>

      <style jsx>
        {`
          .lens {
            position: fixed;
            top: 0;
            left: 0;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            pointer-events: none;
            mix-blend-mode: difference; /* inverts colors under lens */
            background: white; /* white makes text invert */
            z-index: 50;
            transform: translate(-50%, -50%);
          }
        `}
      </style>
    </div>
  );
}
