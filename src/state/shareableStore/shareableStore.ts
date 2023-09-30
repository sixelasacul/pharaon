import { v4 as uuid } from 'uuid'
import { create } from 'zustand'
import { type Color } from '../PickedColorContext'
import { type SharedState } from './schemas'

// TODO: Rename store if we no longer need `shareable`

interface Store extends SharedState {
  updateState: (next: Partial<SharedState>) => void
  updateSyllablesColor: (index: number, color: Color | null) => void
}

export const defaultStore: SharedState = {
  id: '',
  name: '',
  artists: '',
  lyrics: '',
  syllablesColor: new Map()
}

// The advantage of the zustand store compared to the React context is that we
// can use selector to prevent extra renders where we don't read the state
// (we only use the actions in most components, except when sharing the link)
const useStore = create<Store>((set) => ({
  ...defaultStore,
  updateState(next) {
    set((state) => {
      if (state.id === defaultStore.id) {
        return {
          id: uuid(),
          ...next
        }
      }
      return next
    })
  },
  updateSyllablesColor(index, color) {
    set((state) => {
      if (color !== null) {
        state.syllablesColor.set(index, color)
      } else {
        state.syllablesColor.delete(index)
      }
      return {
        syllablesColor: state.syllablesColor
      }
    })
  }
}))

export const useShareableStore = useStore
export function useShareableStoreAction() {
  // It doesn't like when functions are destructured from the state
  const updateState = useStore((state) => state.updateState)
  const updateSyllablesColor = useStore((state) => state.updateSyllablesColor)
  return {
    updateState,
    updateSyllablesColor
  }
}
