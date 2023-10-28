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
      icon: {
        false: '',
        true: ''
      },
      size: {
        sm: 'p-1 md:p-2',
        md: 'p-2 md:p-3',
        lg: 'p-3 md:p-4'
      }
    },
    compoundVariants: [
      {
        icon: true,
        size: 'sm',
        className: 'h-4 w-4 md:h-5 md:w-5'
      },
      {
        icon: true,
        size: 'md',
        className: 'h-5 w-5 md:h-6 md:w-6'
      },
      {
        icon: true,
        size: 'lg',
        className: 'h-6 w-6 md:h-7 md:w-7'
      }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      icon: false
    }
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, icon, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, icon, className }))}
    {...props}
  />
))

interface ToggleGroupProps<V>
  extends VariantProps<typeof toggleVariants>,
    Omit<
      TogglePrimitive.ToggleProps,
      'defaultPressed' | 'pressed' | 'onPressChange' | 'onChange'
    > {
  defaultOption?: V
  options: Array<{ label: string; value: V }>
  onChange?(value?: V): void
}

export function ToggleGroup<V>({
  defaultOption,
  options,
  onChange,
  ...props
}: ToggleGroupProps<V>) {
  const [selectedOption, setSelectedOption] = React.useState(defaultOption)

  return (
    <div className='flex flex-col'>
      {options.map(({ label, value }, index) => (
        <Toggle
          key={String(value)}
          pressed={selectedOption === value}
          onPressedChange={(pressed) => {
            const newValue = pressed ? value : undefined
            setSelectedOption(newValue)
            onChange?.(newValue)
          }}
          // See how I can do that with cva
          // Should do the same for borders, but only on outline variant
          className={cn({
            'rounded-b-none': index === 0,
            'rounded-none': index > 0 && index < options.length - 1,
            'rounded-t-none': index === options.length - 1
          })}
          {...props}
        >
          {label}
        </Toggle>
      ))}
    </div>
  )
}

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
