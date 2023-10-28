import { clsx } from 'clsx'
import * as React from 'react'
import {
  type UserSelection,
  useUserSelection
} from '../../state/UserSelectionContext'
import { Card } from '../ui/card'
import { ToggleGroup } from '../ui/toggle'
import { palette, tempos } from './constants'

function Palette({ children }: React.PropsWithChildren) {
  return (
    <Card className='grid grid-cols-1 place-items-center gap-2 p-2 print:hidden md:grid-cols-2'>
      {children}
    </Card>
  )
}

export function Palettes() {
  const {
    mode,
    color: pickedColor,
    tempo: pickedTempo,
    changeMode,
    changeColor,
    changeTempo
  } = useUserSelection()

  // Round palette, like actual paint palette?
  return (
    <div className='flex flex-col gap-4'>
      <ToggleGroup<UserSelection['mode']>
        variant='outline'
        options={[
          { label: 'Color', value: 'color' },
          { label: 'Tempo', value: 'tempo' }
        ]}
        onChange={(newMode) => {
          changeMode(newMode)
        }}
      />
      {(mode === 'color' || mode === undefined) && (
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
        </Palette>
      )}
      {mode === 'tempo' && (
        <Palette>
          {tempos.map((tempo) => (
            <button
              key={tempo}
              className={clsx(
                // `w-4` is 1rem, like the font-size of `text-base`, to create a square
                'box-content w-4 rounded-full p-1 text-base leading-none hover:bg-slate-100',
                {
                  'bg-slate-100': pickedTempo === tempo
                }
              )}
              onClick={() => {
                changeTempo(tempo)
              }}
            >
              {tempo}
            </button>
          ))}
        </Palette>
      )}
    </div>
  )
}
