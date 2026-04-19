import Link from "next/link";

export default function Footer() {
  const footerItems = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "/termofservice" },
    { label: "Contact", href: "#" },
    { label: "Support", href: "#" },
  ];

  return (
    <footer className="w-full py-12 px-8 border-t border-[var(--card-border)] bg-[var(--card-bg)]/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand Section */}
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-sm font-serif tracking-widest uppercase text-[var(--text-main)]">
            Jobphobia Massage
          </h3>
          <p className="text-[10px] text-[var(--text-sub)] tracking-[0.2em] uppercase opacity-70">
            © 2026 Digital Wellness For Job Phobic People
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-8">
          {footerItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
        
      </div>
    </footer>
  );
}