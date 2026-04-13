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
      className="relative w-full h-[75vh] min-h-[550px] overflow-hidden mb-16 cursor-pointer bg-background transition-colors duration-500"
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
            className="object-cover brightness-[0.4] dark:brightness-[0.45]"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background z-10 pointer-events-none transition-colors duration-500" />

      {session && (
        <div className="absolute top-12 right-12 z-30 flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-1000">
          <span className="text-accent text-[10px] font-mono uppercase tracking-[0.4em] opacity-80 font-bold">
            Welcome, {session.user?.name}
          </span>
          <div className="h-[1px] w-8 bg-accent/30 mt-2" />
        </div>
      )}

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-8 max-w-4xl">
          <p className="text-[10px] md:text-xs tracking-[0.8em] uppercase text-gold font-bold animate-pulse duration-[4000ms]">
            The Art of Traditional Healing
          </p>
          
          <h1 className="text-5xl md:text-8xl font-serif uppercase tracking-[0.05em] leading-[1.1] text-white">
            Elevate Your <br /> 
            <span className="italic font-extralight text-gray-100 dark:text-gray-300">Inner Balance</span>
          </h1>
          
          <div className="flex items-center justify-center gap-6 opacity-80">
            <div className="h-[1px] w-12 bg-white" />
            <p className="text-[9px] tracking-[0.5em] uppercase font-medium text-white">
              Bespoke Therapy • Ancient Wisdom
            </p>
            <div className="h-[1px] w-12 bg-white" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 z-30 flex items-baseline gap-2 font-mono text-[10px] tracking-widest hidden md:flex">
        <span className="text-white">0{index + 1}</span>
        <span className="text-white/40">/</span>
        <span className="text-white/40">0{covers.length}</span>
      </div>
    </div>
  );
}