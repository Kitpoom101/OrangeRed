export default function FormComponent({
  children,
  handleSubmit,
  classname,
}: {
  children: React.ReactNode;
  handleSubmit: (e: React.SyntheticEvent) => void;
  classname?: string;
}) {
  const defaultStyle = `
    bg-card/30 
    backdrop-blur-md 
    flex flex-col 
    items-center 
    p-8 
    gap-6 
    rounded-2xl 
    border border-card-border/50 
    text-text-sub 
    text-center 
    text-[11px] 
    uppercase 
    tracking-[0.2em] 
    transition-all 
    duration-500
  `;

  return (
    <form
      onSubmit={handleSubmit}
      className={classname ? classname : defaultStyle}
    >
      {children}
    </form>
  );
}