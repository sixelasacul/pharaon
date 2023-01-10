export function IconButton({ children, ...props }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      className="h-4 w-4 p-2 box-content rounded-full shadow enabled:hover:bg-black/10 print:hidden bg-white disabled:opacity-75"
    >
      {children}
    </button>
  )
}
