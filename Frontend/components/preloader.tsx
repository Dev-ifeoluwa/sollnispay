"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (e.g., wait for images/resources)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gradient-to-r from-ornage-100 p-2 rounded-full shadow-lg">
            <Image 
            src="/favicon.ico" 
            alt="loading...."
            width={40} 
            height={40}
            className="w-15 h-15 animate-pulse rounded-full"
            />
      </div>
    </div>
  );
}
