import Link from "next/link"

interface TopMenuItemProps{
  item: string
  pageRef: string
}

export default function TopMenuItem({item, pageRef}: TopMenuItemProps){
  return(
    <Link 
      href={pageRef} 
      className="relative group px-6 h-full flex items-center text-[10px] font-mono uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all duration-300"
    >
      {item}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500/50 group-hover:w-full transition-all duration-500" />
    </Link>
  )
}