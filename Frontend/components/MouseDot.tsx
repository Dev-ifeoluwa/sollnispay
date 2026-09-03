"use client";
import { useEffect, useState } from "react";

export default function MouseDot() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);

      clearTimeout(timeout);
      timeout = setTimeout(() => setVisible(false), 200); // hide after 200ms of no movement
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {visible && (
        <div
          className="fixed w-2 h-2 bg-orange-600 rounded-full pointer-events-none transition-transform duration-75 ease-linear"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </>
  );
}
