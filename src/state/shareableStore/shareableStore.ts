import { create } from 'zustand'
import { compressAndEncode } from '../../utils/compressor'

interface SharedState {
  lyrics: string
  artists: string
  name: string
  // To save space, instead of colors, we could save a short code/number from the palette
  syllablesColor: (string|null)[]
}
interface Store extends SharedState {
  shareable: string
  updateState(next: Partial<SharedState>): void
  updateSyllablesColor(index: number, color: string): void
}

// The advantage of the zustand store compared to the React context is that we
// can use selector to prevent extra renders where we don't read the state
// (we only use the actions in most components, except when sharing the link)
const useStore = create<Store>((set) => ({
  name: '',
  artists: '',
  lyrics: '',
  syllablesColor: [],
  shareable: '',
  updateState(next) {
    return set(({ shareable: _, ...state }) => {
      const newState = { ...state, ...next }
      return {
        ...newState,
        shareable: compressAndEncode(JSON.stringify(newState))
      }
    })
  },
  updateSyllablesColor(index: number, color: string) {
    return set(({ shareable: _, ...state }) => {
      state.syllablesColor[index] = color
      // Replaces `empty` values to empty string to save some space, as they
      // get stringified as `null` (2 chars per empty value saved); probably
      // not worth it though.
      state.syllablesColor = Array.from(state.syllablesColor, v => v ?? '')
      return {
        syllablesColor: state.syllablesColor,
        shareable: compressAndEncode(JSON.stringify(state))
      }
    })
  }
}))

export function useShareableStore() {
  return useStore((state) => state.shareable)
}
export function useShareableStoreAction() {
  const updateState = useStore((state) => state.updateState)
  const updateSyllablesColor = useStore((state) => state.updateSyllablesColor)
  return {
    updateState,
    updateSyllablesColor
  }
}
