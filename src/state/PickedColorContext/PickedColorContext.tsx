import * as React from 'react'

export interface Color {
  base: string
  hover: string
  border: string
  name: string
}

type PickedColorContextType = ReturnType<typeof React.useState<Color>>

const defaultContextValue: PickedColorContextType = [undefined, () => undefined]
const PickedColorContext =
  React.createContext<PickedColorContextType>(defaultContextValue)

export function PickedColorProvider({ children }: React.PropsWithChildren) {
  const colorState = React.useState<Color>()
  return (
    <PickedColorContext.Provider value={colorState}>
      {children}
    </PickedColorContext.Provider>
  )
}

export function usePickedColor() {
  const ctx = React.useContext(PickedColorContext)
  if (ctx === defaultContextValue) {
    throw new Error('No PickedColorContext available')
  }
  return ctx
}
