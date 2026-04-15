import Image from "next/image";
import Link from "next/link";

export default function LogoSection() {
  return (
    <Link href={'/'} className="group h-full flex items-center"> 
      <div className="h-full flex items-center pr-8 gap-5 transition-all duration-700 ease-out">
        
        <div className="relative h-3/5 aspect-square shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-background/10 z-10" />
          <Image 
            src="/Logo.jpg" 
            alt="Orangeaccent Logo" 
            fill 
            className="object-contain grayscale contrast-125 opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out" 
          />
        </div>

        <div className="flex flex-col">
          <div className="relative">
            <h1 className="text-2xl font-extralight tracking-[0.15em] text-text-main/90 uppercase font-serif">
              Orange<span className="font-bold text-accent">Red</span>
            </h1>
            <div className="absolute -bottom-1 left-0 w-4 h-[1px] bg-accent/40 group-hover:w-full transition-all duration-1000 ease-in-out" />
          </div>
          
          <div className="mt-1.5 flex items-center gap-2">
            <div className="w-1.5 h-px bg-accent/30" />
            <p className="text-[8px] uppercase tracking-[0.5em] text-text-sub/50 font-medium">
              MASSAGE SERVICE
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}