export default function Footer(){

  return(
    <footer className="w-full py-12 px-8 border-t border-gray-800/50 bg-[#0f172a]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-sm font-serif tracking-widest uppercase text-gray-200">
              OrangeRed Massage
            </h3>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              © 2026 Digital Wellness For Job Phobic People
            </p>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact", "Support"].map((item) => (
              <a
                
                key={item}
                href="#"
                className="text-[9px] uppercase tracking-[0.3em] text-gray-500 hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
  )
}