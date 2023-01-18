import { create } from 'zustand'
import { compressAndEncode } from '../../utils/compressor'

interface SharedState {
  lyrics: string
  artists: string
  name: string
  // To save space, instead of colors, we could save a short code/number from the palette
  syllablesColor: string[]
}
interface Store extends SharedState {
  shareable: string
  updateState(next: Partial<SharedState>): void
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
    return set(({shareable: _, ...state}) => {
      const newState = { ...state, ...next }
      return {
        ...newState,
        shareable: compressAndEncode(JSON.stringify(newState))
      }
    })
  }
}))

export function useShareableStore() {
  return useStore((state) => state.shareable)
}
export function useShareableStoreAction() {
  return useStore((state) => state.updateState)
}
