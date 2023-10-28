import * as React from 'react'
import { match } from 'ts-pattern'

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
  mode?: 'color' | 'tempo'
  color?: Color
  tempo?: number
}

// `typeof React.useState` seems to always assume that `value` can be `undefined`
type UserSelectionContextType = [UserSelection, React.Dispatch<Actions>]

const defaultValue: UserSelectionContextType = [{}, () => ({})]
const UserSelectionContext =
  React.createContext<UserSelectionContextType>(defaultValue)

interface ChangeModeAction {
  type: 'change-mode'
  payload: UserSelection['mode']
}
interface ChangeColorAction {
  type: 'change-color'
  payload: UserSelection['color']
}
interface ChangeTempoAction {
  type: 'change-tempo'
  payload: UserSelection['tempo']
}

type Actions = ChangeModeAction | ChangeColorAction | ChangeTempoAction

function reducer(state: UserSelection, action: Actions) {
  return match(action)
    .returnType<UserSelection>()
    .with({ type: 'change-mode' }, ({ payload }) => ({
      mode: payload,
      color: undefined,
      tempo: undefined
    }))
    .with({ type: 'change-color' }, ({ payload }) => ({
      ...state,
      color: payload === state.color ? undefined : payload
    }))
    .with({ type: 'change-tempo' }, ({ payload }) => ({
      ...state,
      tempo: payload === state.tempo ? undefined : payload
    }))
    .exhaustive()
}

export function UserSelectionProvider({ children }: React.PropsWithChildren) {
  const userSelectionState = React.useReducer(reducer, {})
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

  function changeMode(payload: UserSelection['mode']) {
    dispatch({ type: 'change-mode', payload })
  }

  function changeColor(payload: UserSelection['color']) {
    dispatch({ type: 'change-color', payload })
  }

  function changeTempo(payload: UserSelection['tempo']) {
    dispatch({ type: 'change-tempo', payload })
  }

  return {
    ...state,
    changeMode,
    changeColor,
    changeTempo
  }
}
