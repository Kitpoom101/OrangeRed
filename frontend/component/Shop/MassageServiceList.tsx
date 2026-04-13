import Image from "next/image";
import { MassageType } from "@/interface";

export default function MassageServiceList({ services }: { services: MassageType[] }) {
  if (!services || services.length === 0) return null;

  return (
    <div className="mt-10">
      <p className="text-[11px] uppercase tracking-[0.4em] text-accent dark:text-accent-400 mb-6 font-bold">
        — Available Services —
      </p>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service, index) => (
          <div
            key={service._id || index}

            className="group flex flex-row items-center border border-card-border bg-card/50 rounded-lg hover:border-accent/50 dark:hover:border-accent-500/50 transition-all duration-500 overflow-hidden min-h-[110px]"
          >
            {service.picture ? (
              <div className="relative h-32 w-0 opacity-0 group-hover:w-40 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden shadow-xl">
                <Image
                  src={service.picture}
                  alt={service.name}
                  fill
                  className="object-cover scale-125 group-hover:scale-100 transition-transform duration-700 ease-out"
                />
              </div>
            ) : null}

            <div
              className={`flex-1 p-6 transition-all duration-500 ease-in-out
                ${service.picture ? 'group-hover:pl-10' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg tracking-widest text-text-main uppercase transition-colors duration-300 group-hover:text-accent dark:group-hover:text-accent-400">
                  {service.name}
                </h3>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-accent dark:text-accent-400 font-bold tracking-tighter">
                    {service.price} THB
                  </span>
                </div>
              </div>

              <p className="text-sm text-text-sub font-light leading-relaxed max-w-2xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}