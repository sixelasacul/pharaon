import { v4 as uuid } from 'uuid'
import { create } from 'zustand'
import { type ColorUpdater, type TempoUpdater } from '../UserSelectionContext'
import { type SharedState } from './schemas'

// TODO: Rename store if we no longer need `shareable`

interface Store extends SharedState {
  resetState(): void
  updateState(next: Partial<SharedState>): void
  updateSyllablesColor(index: number, color: ColorUpdater): void
  updateSyllablesTempo(index: number, tempo: TempoUpdater): void
}

export const defaultStore: SharedState = {
  id: '',
  name: '',
  artists: '',
  lyrics: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  syllablesColor: new Map(),
  syllablesTempo: new Map()
}

// The advantage of the zustand store compared to the React context is that we
// can use selector to prevent extra renders where we don't read the state
// (we only use the actions in most components, except when sharing the link)
const useStore = create<Store>((set) => ({
  ...defaultStore,
  resetState() {
    set(defaultStore)
  },
  updateState(next) {
    set((state) => {
      if (state.id === defaultStore.id) {
        return {
          id: uuid(),
          ...next
        }
      }
      return {
        ...next,
        updatedAt: new Date()
      }
    })
  },
  updateSyllablesColor(index, color) {
    set((state) => {
      if (color === 'eraser') {
        state.syllablesColor.delete(index)
      } else {
        state.syllablesColor.set(index, color)
      }
      return {
        syllablesColor: state.syllablesColor
      }
    })
  },
  // updateSyllables(index, 'color' | 'tempo', value)?
  updateSyllablesTempo(index, tempo) {
    set((state) => {
      if (tempo === 'eraser') {
        state.syllablesTempo.delete(index)
      } else {
        state.syllablesTempo.set(index, tempo)
      }
      return {
        syllablesTempo: state.syllablesTempo
      }
    })
  }
}))

export const useShareableStore = useStore
export function useShareableStoreState() {
  return useStore(
    ({
      resetState,
      updateState,
      updateSyllablesColor,
      updateSyllablesTempo,
      ...state
    }) => state
  )
}
export function useShareableStoreAction() {
  return useStore(
    ({
      resetState,
      updateState,
      updateSyllablesColor,
      updateSyllablesTempo
    }) => ({
      resetState,
      updateState,
      updateSyllablesColor,
      updateSyllablesTempo
    })
  )
}
