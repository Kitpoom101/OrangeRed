"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Banner() {
  const [index, setIndex] = useState(0);
  const covers = [
    "/Banner/cover1.jpg",
    "/Banner/cover2.jpg",
    "/Banner/cover3.jpg",
    "/Banner/cover4.jpg",
  ];

  const { data: session } = useSession();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % covers.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [covers.length]);

  return (
    <div
      className="relative w-full h-[75vh] min-h-[550px] overflow-hidden mb-16 cursor-pointer bg-[#0f172a]"
      onClick={() => setIndex((prev) => (prev + 1) % covers.length)}
    >
      {covers.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-all duration-[2500ms] ease-in-out transform ${
            index === i 
              ? "opacity-100 scale-105 translate-x-0" 
              : "opacity-0 scale-110 translate-x-4"
          }`}
        >
          <Image
            src={src}
            alt="Luxury Spa Interior"
            fill
            priority={i === 0}
            className="object-cover brightness-[0.45]"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/60 via-transparent to-[#0f172a] z-10 pointer-events-none" />

      {session && (
        <div className="absolute top-12 right-12 z-30 flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-1000">
          <span className="text-blue-400 text-[10px] font-mono uppercase tracking-[0.4em] opacity-70">
            Welcome, {session.user?.name}
          </span>
          <div className="h-[1px] w-8 bg-blue-500/20 mt-2" />
        </div>
      )}

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <div className="space-y-8 max-w-4xl">
          <p className="text-[10px] md:text-xs tracking-[0.8em] uppercase text-blue-400/60 font-medium animate-pulse duration-[4000ms]">
            The Art of Traditional Healing
          </p>
          
          <h1 className="text-5xl md:text-8xl font-serif uppercase tracking-[0.05em] leading-[1.1]">
            Elevate Your <br /> 
            <span className="italic font-extralight text-gray-300">Inner Balance</span>
          </h1>
          
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="h-[1px] w-12 bg-white/20" />
            <p className="text-[9px] tracking-[0.5em] uppercase font-light">
              Bespoke Therapy • Ancient Wisdom
            </p>
            <div className="h-[1px] w-12 bg-white/20" />
          </div>
        </div>
      </div>


      <div className="absolute bottom-12 left-12 z-30 flex items-baseline gap-2 text-gray-500 font-mono text-[10px] tracking-widest hidden md:flex">
        <span className="text-gray-300">0{index + 1}</span>
        <span className="text-gray-700">/</span>
        <span>0{covers.length}</span>
      </div>
    </div>
  );
}