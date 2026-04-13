import Image from "next/image";
import Link from "next/link";

export default function LogoSection() {
  return (
    <Link href={'/'} className="h-full flex flex-col"> 
      <div className="h-full flex items-center pr-4 gap-4 hover:bg-white/5 transition-all duration-300 rounded-lg">
        
        <div className="relative h-full aspect-square shrink-0">
          <Image 
            src="/Logo.jpg" 
            alt="Logo" 
            fill 
            className="object-contain" 
          />
        </div>

        <div className="font-mono leading-tight">
          <p className="text-xl font-bold tracking-tighter">OrangeRed</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            Massage Service
          </p>
        </div>
      </div>
    </Link>
  );
}