import * as React from 'react'
import { type Color, usePickedColor } from '../../state/PickedColorContext'
import { getUniqueRandomIntListInclusive } from '../../utils/random'
import { palette } from '../Palette'
import { Syllable } from '../Syllable'
import { cn } from '@/utils/cn'

type Keys = 'pha' | 'ra' | 'on'
type State = { [key in Keys]: Color }
interface TitleProps<E extends React.ElementType> {
  as?: E
  className?: string
}
type PolymorphedTitleProps<E extends React.ElementType> = TitleProps<E> &
  Omit<React.ComponentProps<E>, keyof TitleProps<E>>

const defaultElement = 'h1'

export function Title<E extends React.ElementType>({
  as,
  className,
  ...props
}: PolymorphedTitleProps<E>) {
  const [pickedColor = null] = usePickedColor()
  const [{ pha, ra, on }, setColors] = React.useState<State>(() => {
    const [first, second] = getUniqueRandomIntListInclusive(
      0,
      palette.length - 1,
      2
    ).map((r) => palette[r])
    return { pha: first, ra: first, on: second }
  })

  const Component = as ?? defaultElement

  function updateColor(key: Keys) {
    if (pickedColor !== null) {
      setColors((prev) => ({
        ...prev,
        [key]: pickedColor
      }))
    }
  }

  return (
    <Component
      className={cn(
        'py-2 font-headline text-4xl font-normal md:text-5xl',
        className
      )}
      {...props}
    >
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
    </Component>
  )
}
