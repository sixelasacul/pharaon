import { clsx } from 'clsx'
import { Eraser, X } from 'lucide-react'
import { Action } from './Action'
import { Palette } from './Palette'
import { palette } from './constants'
import { useUserSelection } from '@/state/UserSelectionContext'

export function ColorPalette() {
  const { color: pickedColor, changeColor } = useUserSelection()

  return (
    <Palette>
      {palette.map((color) => (
        <button
          key={color.base}
          className={clsx(
            'h-6 w-6 rounded-full',
            color.base,
            color.hover,
            color.border,
            {
              'border-4': pickedColor === color
            }
          )}
          onClick={() => {
            changeColor(color)
          }}
        ></button>
      ))}
      <Action
        selected={pickedColor === 'eraser'}
        onSelect={() => {
          changeColor('eraser')
        }}
      >
        <Eraser className='w-4' />
      </Action>
      <Action
        selected={pickedColor === undefined}
        onSelect={() => {
          changeColor(undefined)
        }}
      >
        <X className='w-4' />
      </Action>
    </Palette>
  )
}
