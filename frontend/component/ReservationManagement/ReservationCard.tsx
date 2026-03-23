import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ReservationCard({
  item, 
  onDelete, 
  index
}:{
  item: ReservationItem, 
  onDelete: (rid: string) => void,
  index: number
}) {
  const { data: session } = useSession();
  
  const isRoleUser = session?.user?.role === "user";

  return (
    <div className="group relative grid grid-cols-1 md:grid-cols-[60px_1fr_auto] items-center gap-y-6 p-8 bg-[#1e2d3d]/40 border border-gray-700/30 rounded-xl hover:border-blue-500/30 transition-all duration-500">
      
      <div className="hidden md:flex justify-start">
        <span className="text-[10px] font-mono text-blue-500/30 tracking-tighter">
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>

      <div className={`flex-1 grid grid-cols-1 ${isRoleUser ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-8`}>
        
        {!isRoleUser && (
          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-[0.3em] text-blue-400 font-semibold">User</p>
            <h2 className="text-lg font-serif text-gray-100 tracking-tight">{item.user.name}</h2>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Shop Venue</p>
          <Link 
            href={`/shop/${item.shop._id}`} 
            className="inline-block text-[11px] font-medium text-gray-300 uppercase tracking-widest hover:text-blue-400 transition-colors duration-300 border-b border-transparent hover:border-blue-400/30"
          >
            {item.shop.name}
          </Link>
        </div>

        <div className="space-y-1">
          <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Appointment Date</p>
          <p className="text-[11px] font-medium text-gray-300 font-mono tracking-normal">
             {new Date(item.appDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[8px] uppercase tracking-[0.2em] text-gray-500">Contact Registry</p>
          <p className="text-[11px] font-medium text-gray-300">{item.shop.tel}</p>
        </div>
      </div>

      <div className="flex flex-row md:flex-col gap-6 items-end justify-end border-t md:border-t-0 border-gray-700/50 pt-6 md:pt-0">
        <p 
          
          className="group/edit relative py-1 text-[9px] uppercase tracking-[0.3em] text-gray-400 hover:text-blue-400 transition-colors"
        >
          Edit Details
          <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-blue-500/50 group-hover/edit:w-full transition-all duration-300" />
        </p>

        <button
          onClick={() => onDelete(item._id)}
          className="group/btn relative py-1 transition-all"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 group-hover/btn:text-red-500 transition-colors duration-300">
            Cancel Order
          </span>
          <div className="absolute bottom-0 right-0 w-0 h-[1px] bg-red-900 group-hover/btn:w-full transition-all duration-500" />
        </button>
      </div>
    </div>
  );
}