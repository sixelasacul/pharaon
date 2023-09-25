import { clsx } from 'clsx'
import { usePickedColor } from '../../state/PickedColorContext'
import { palette } from './constants'

export function Palette() {
  const [pickedColor, setPickedColor] = usePickedColor()
  // Round palette, like actual paint palette?
  return (
    <div className='grid grid-cols-1 place-items-center gap-2 rounded-l bg-white p-2 shadow-md print:hidden md:grid-cols-2 md:grid-cols-2'>
      {palette.map((color) => (
        <button
          key={color.base}
          className={clsx(
            'h-5 w-5 rounded-full',
            color.base,
            color.hover,
            color.border,
            {
              'border-2': pickedColor === color
            }
          )}
          onClick={() => {
            setPickedColor((prev) => (prev === color ? undefined : color))
          }}
        ></button>
      ))}
    </div>
  )
}
