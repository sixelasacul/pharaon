import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils/cn'

const toggleVariants = cva(
  'box-content inline-flex items-center justify-center rounded-md bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: '',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        sm: 'h-4 w-4 p-1 md:h-5 md:w-5 md:p-2',
        md: 'h-5 w-5 p-2 md:h-6 md:w-6 md:p-3',
        lg: 'h-6 w-6 p-3 md:h-7 md:w-7 md:p-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
