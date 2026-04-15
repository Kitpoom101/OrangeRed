export default function LoadingDefault(){
  return(
    <div className="min-h-screen bg-background text-text-sub flex flex-col items-center justify-center font-mono uppercase tracking-[0.4em] text-[10px] transition-colors duration-300">
      
      <div className="h-[1px] w-8 bg-accent/30 mb-4 animate-bounce" />
      
      <div className="animate-pulse">
        Loading...
      </div>

    </div>
  )
}