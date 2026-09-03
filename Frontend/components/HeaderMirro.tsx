"use client";

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
      <h1 className="text-4xl text-white xl:text-5xl font-semibold leading-tight md:cursor-default relative z-10">
        <span className="text-orange-600">Power</span> your business at ease today
      </h1>
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
