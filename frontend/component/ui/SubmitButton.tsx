export default function SubmitButton() {
  return (
    <button 
      type="submit" 
      className="group relative w-40 h-12 overflow-hidden rounded-xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-card border border-white/10 group-hover:border-accent/40 transition-colors duration-500" />
      
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-accent/5 blur-xl transition-opacity duration-500" />

      <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-text-sub group-hover:text-text-main transition-colors duration-500">
        Submit
      </span>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-accent group-hover:w-1/2 transition-all duration-500 opacity-60" />
    </button>
  );
}