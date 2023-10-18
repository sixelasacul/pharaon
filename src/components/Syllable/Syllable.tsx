import { cva, type VariantProps } from 'class-variance-authority'
import { type Color } from '../../state/PickedColorContext'
import { cn } from '@/utils/cn'

const syllableVariants = cva(
  'relative select-all py-px transition-colors md:py-1',
  {
    variants: {
      size: {
        normal: 'duration-75',
        large: 'duration-150'
      }
    }
  }
)

type SyllableVariants = VariantProps<typeof syllableVariants>

export interface SyllableProps extends Omit<SyllableVariants, 'tempo'> {
  color: Color
  className?: string
  tempo?: number
  onClick(): void
}

// Word component to solve issues with inline-flex?

export function Syllable({
  className,
  children,
  color,
  size = 'normal',
  tempo,
  onClick
}: React.PropsWithChildren<SyllableProps>) {
  const hasTempo = tempo !== undefined
  // TODO: Fix overlapping padding
  return (
    <span
      className={cn(
        color.base,
        color.hover,
        syllableVariants({ size, className })
      )}
      role='button'
      onClick={onClick}
    >
      {children}
      {hasTempo && (
        <span className='absolute -bottom-2 right-0 select-none text-xs text-slate-500'>
          {tempo}
        </span>
      )}
    </span>
  )
}
