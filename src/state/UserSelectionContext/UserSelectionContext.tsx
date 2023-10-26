import * as React from 'react'

export interface Color {
  base: string
  hover: string
  border: string
  name: string
}

// Would be helpful to type that they can't be set at the same time
// TODO: Introduce a selection mode, to only edit colors or tempos (to prevent
// affecting the other one)
export interface UserSelection {
  color?: Color
  tempo?: number
}

// `typeof React.useState` seems to always assume that `value` can be `undefined`
type UserSelectionContextType = [
  UserSelection,
  React.Dispatch<React.SetStateAction<UserSelection>>
]

const defaultValue: UserSelectionContextType = [{}, () => ({})]
const UserSelectionContext =
  React.createContext<UserSelectionContextType>(defaultValue)

export function UserSelectionProvider({ children }: React.PropsWithChildren) {
  const userSelectionState = React.useState<UserSelection>({})
  return (
    <UserSelectionContext.Provider value={userSelectionState}>
      {children}
    </UserSelectionContext.Provider>
  )
}

export function useUserSelection() {
  const ctx = React.useContext(UserSelectionContext)
  if (ctx === defaultValue) {
    throw new Error('No UserSelectionContext available')
  }

  const [state, setState] = ctx

  function updateState(
    update:
      | Partial<UserSelection>
      | ((prev: UserSelection) => Partial<UserSelection>)
  ) {
    setState((prev) => {
      const updatedState = typeof update === 'function' ? update(prev) : update
      const nextState = { ...prev, ...updatedState }
      // Resets the other selection, so that only 1 can be active
      // Would be nice to find an easier way to implement this; strongly typing
      // this, and having a switch in the UI to toggle from each editing mode
      if (updatedState.color !== undefined) {
        nextState.tempo = undefined
      }
      if (updatedState.tempo !== undefined) {
        nextState.color = undefined
      }
      return nextState
    })
  }

  return [state, updateState] as const
}
