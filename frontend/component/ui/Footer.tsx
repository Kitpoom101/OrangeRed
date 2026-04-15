export default function Footer(){

  return(
    <footer className="w-full py-12 px-8 border-t border-card-border bg-card/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-sm font-serif tracking-widest uppercase text-text-main">
              OrangeRed Massage
            </h3>
            <p className="text-[10px] text-text-sub tracking-[0.2em] uppercase opacity-70">
              © 2026 Digital Wellness For Job Phobic People
            </p>
          </div>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Contact", "Support"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[9px] uppercase tracking-[0.3em] text-text-sub hover:text-accent transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
  )
}