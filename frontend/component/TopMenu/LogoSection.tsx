import Image from "next/image";

export default function LogoSection(){
  return(
    <div className="w-100 h-full flex pr-1 gap-4 hover:bg-sky-500/10 transition-all duration-150">
      <div className="relative h-full aspect-square shrink-0">
        <Image src="/Logo.jpg" alt="Logo" fill className="object-contain" />
      </div>
      <div className="flex-1 font-mono flex flex-col gap-3">
        <p className="text-2xl">JobPhobia</p>
        <p className="text-sm text-white/60">Massage Reservation Service</p>
      </div>
    </div>
  )
}