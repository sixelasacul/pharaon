import * as React from 'react'
import { match } from 'ts-pattern'

export interface Color {
  base: string
  hover: string
  border: string
  name: string
}

export type Tempo = 1 | 2 | 3 | 4

export type ColorUpdater = Color | 'eraser'
export type TempoUpdater = Tempo | 'eraser'

export interface UserSelection {
  mode: 'color' | 'tempo'
  // `undefined` means no selected action (though mode is selected)
  color?: ColorUpdater
  tempo?: TempoUpdater
}

// `typeof React.useState` seems to always assume that `value` can be `undefined`
type UserSelectionContextType = [UserSelection, React.Dispatch<Actions>]

const defaultState: UserSelection = { mode: 'color' }
const defaultValue: UserSelectionContextType = [defaultState, () => ({})]
const UserSelectionContext =
  React.createContext<UserSelectionContextType>(defaultValue)

interface ChangeColorAction {
  type: 'change-color'
  payload: UserSelection['color']
}
interface ChangeTempoAction {
  type: 'change-tempo'
  payload: UserSelection['tempo']
}

type Actions = ChangeColorAction | ChangeTempoAction

function reducer(state: UserSelection, action: Actions) {
  return match(action)
    .returnType<UserSelection>()
    .with({ type: 'change-color' }, ({ payload }) => ({
      ...state,
      mode: 'color',
      tempo: undefined,
      color: payload === state.color ? undefined : payload
    }))
    .with({ type: 'change-tempo' }, ({ payload }) => ({
      ...state,
      mode: 'tempo',
      color: undefined,
      tempo: payload === state.tempo ? undefined : payload
    }))
    .exhaustive()
}

export function UserSelectionProvider({ children }: React.PropsWithChildren) {
  const userSelectionState = React.useReducer(reducer, defaultState)
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

  const [state, dispatch] = ctx

  function changeColor(payload: UserSelection['color']) {
    dispatch({ type: 'change-color', payload })
  }

  function changeTempo(payload: UserSelection['tempo']) {
    dispatch({ type: 'change-tempo', payload })
  }

  return {
    ...state,
    changeColor,
    changeTempo
  }
}
