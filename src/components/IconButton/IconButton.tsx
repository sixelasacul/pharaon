import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const iconButtonVariants = cva(
  'p-2 box-content rounded-full hover:bg-black/10 disabled:hover:bg-white print:hidden disabled:opacity-75',
  {
    variants: {
      contained: {
        true: 'shadow bg-white'
      },
      size: {
        md: 'h-5 w-5 md:h-6 md:w-6',
        lg: 'h-6 w-6 md:h-8 md:w-8'
      }
    },
    defaultVariants: {
      size: 'md',
      contained: true
    }
  }
)

interface IconButtonProps<E extends React.ElementType>
  extends VariantProps<typeof iconButtonVariants> {
  as?: E
  contained?: boolean
}
type PolymorphedIconButtonProps<E extends React.ElementType> =
  IconButtonProps<E> & Omit<React.ComponentProps<E>, keyof IconButtonProps<E>>

const defaultElement = 'button'

export function IconButton<
  E extends React.ElementType = typeof defaultElement
>({ as, children, contained, size, ...props }: PolymorphedIconButtonProps<E>) {
  const Component = as ?? defaultElement
  return (
    <Component
      {...props}
      className={cn(iconButtonVariants({ contained, size }))}
    >
      {children}
    </Component>
  )
}
