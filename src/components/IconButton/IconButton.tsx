interface IconButtonProps<E extends React.ElementType> {
  as?: E
}
type PolymorphedIconButtonProps<E extends React.ElementType> =
  IconButtonProps<E> & Omit<React.ComponentProps<E>, keyof IconButtonProps<E>>

const defaultElement = 'button'
const COMMON_CLASSNAMES =
  'h-5 w-5 p-2 box-content rounded-full shadow enabled:hover:bg-black/10 print:hidden bg-white disabled:opacity-75'

export function IconButton<
  E extends React.ElementType = typeof defaultElement
>({ as, children, ...props }: PolymorphedIconButtonProps<E>) {
  const Component = as ?? defaultElement
  return (
    <Component {...props} className={COMMON_CLASSNAMES}>
      {children}
    </Component>
  )
}
