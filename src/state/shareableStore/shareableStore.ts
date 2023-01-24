import { create } from 'zustand'
import { shortenNameColor } from '../../components/Palette'
import { compressAndEncode } from '../../utils/compressor'
import { Color } from '../PickedColorContext'

export interface SharedState {
  lyrics: string
  artists: string
  name: string
  syllablesColor: (Color | null)[]
}
interface Store extends SharedState {
  shareable: string
  updateState(next: Partial<SharedState>): void
  updateSyllablesColor(index: number, color: Color): void
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
      const newState: SharedState = {
        ...state,
        ...next
      }
      // Updated the colors if the lyrics have changed, but still pass through
      // if the colors are updated (when parsing URL's state)
      const haveLyricsChanged = !!next?.lyrics && next.lyrics === state.lyrics
      const areColorsUpdated = !!next?.syllablesColor
      const newSyllablesColor = areColorsUpdated ? next.syllablesColor : haveLyricsChanged ? [] : state.syllablesColor
      return {
        ...next,
        syllablesColor: newSyllablesColor,
        shareable: compressAndEncode(JSON.stringify(newState))
      }
    })
  },
  updateSyllablesColor(index: number, color: Color) {
    return set(({ shareable: _, ...state }) => {
      state.syllablesColor[index] = color
      // Replaces `empty` values to empty string to save some space, as they
      // get stringified as `null` (2 chars per empty value saved); probably
      // not worth it though.
      // To save space, instead of colors, we could save a short code/number from the palette
      const simplifiedSyllablesColor = Array.from(state.syllablesColor, (color) => color ? shortenNameColor(color) : '')
      return {
        syllablesColor: state.syllablesColor,
        shareable: compressAndEncode(JSON.stringify({ ...state, syllablesColor: simplifiedSyllablesColor }))
      }
    })
  }
}))

export const useShareableStore = useStore
export function useShareableStoreAction() {
  const updateState = useStore((state) => state.updateState)
  const updateSyllablesColor = useStore((state) => state.updateSyllablesColor)
  return {
    updateState,
    updateSyllablesColor
  }
}
