import { clsx } from 'clsx'
import { type Color } from '../../state/PickedColorContext'

interface SyllableProps {
  color: Color
  className?: string
  size?: 'normal' | 'large'
  onClick(): void
}

export function Syllable({
  className,
  children,
  color,
  size = 'normal',
  onClick
}: React.PropsWithChildren<SyllableProps>) {
  return (
    <span
      className={clsx(
        'select-all py-2 transition-colors',
        color.base,
        color.hover,
        {
          'py-1 duration-75': size === 'normal',
          'py-2 duration-150': size === 'large'
        },
        className
      )}
      role='button'
      onClick={onClick}
    >
      {children}
    </span>
  )
}
