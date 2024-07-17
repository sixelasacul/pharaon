import { clsx } from 'clsx'
import { Eraser, X } from 'lucide-react'
import { Action } from './Action'
import { Palette } from './Palette'
import { tempos } from './constants'
import { useUserSelection } from '@/state/UserSelectionContext'

export function TempoPalette() {
  const { tempo: pickedTempo, changeTempo } = useUserSelection()

  return (
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
      <Action
        selected={pickedTempo === 'eraser'}
        onSelect={() => {
          changeTempo('eraser')
        }}
      >
        <Eraser className='w-4' />
      </Action>
      <Action
        selected={pickedTempo === undefined}
        onSelect={() => {
          changeTempo(undefined)
        }}
      >
        <X className='w-4' />
      </Action>
    </Palette>
  )
}
