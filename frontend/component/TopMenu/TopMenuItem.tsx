import Link from "next/link"

interface TopMenuItemProps{
  item: string
  pageRef: string
}

export default function TopMenuItem({item, pageRef}: TopMenuItemProps){
  return(
    <Link 
      href={pageRef} 
      className="relative group px-4 py-2 h-full flex items-center text-[12px] font-mono uppercase tracking-[0.3em] text-foreground/70 hover:text-foreground transition-all duration-300"
    >
      {item}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent/50 group-hover:w-full transition-all duration-500" />
    </Link>
  )
}