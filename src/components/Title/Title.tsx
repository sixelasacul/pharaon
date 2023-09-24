import * as React from 'react'
import { type Color, usePickedColor } from '../../state/PickedColorContext'
import { getUniqueRandomIntListInclusive } from '../../utils/random'
import { palette } from '../Palette'
import { Syllable } from '../Syllable'

type Keys = 'pha' | 'ra' | 'on'
type State = { [key in Keys]: Color }

export function Title() {
  const [pickedColor = null] = usePickedColor()
  const [{ pha, ra, on }, setColors] = React.useState<State>(() => {
    const [first, second] = getUniqueRandomIntListInclusive(
      0,
      palette.length - 1,
      2
    ).map((r) => palette[r])
    return { pha: first, ra: first, on: second }
  })

  function updateColor(key: Keys) {
    if (pickedColor !== null) {
      setColors((prev) => ({
        ...prev,
        [key]: pickedColor
      }))
    }
  }

  return (
    <h1 className='py-2 font-headline text-5xl'>
      <Syllable
        className='pl-2'
        size='large'
        color={pha}
        onClick={() => {
          updateColor('pha')
        }}
      >
        Pha
      </Syllable>
      <span>-</span>
      <Syllable
        size='large'
        color={ra}
        onClick={() => {
          updateColor('ra')
        }}
      >
        ra
      </Syllable>
      <span>-</span>
      <Syllable
        className='pr-2'
        size='large'
        color={on}
        onClick={() => {
          updateColor('on')
        }}
      >
        on
      </Syllable>
    </h1>
  )
}
