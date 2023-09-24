export function IconButton({
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      className='box-content h-4 w-4 rounded-full bg-white p-2 shadow enabled:hover:bg-black/10 disabled:opacity-75 print:hidden'
    >
      {children}
    </button>
  )
}
