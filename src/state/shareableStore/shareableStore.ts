import { create } from 'zustand'
import { noColor, shortenNameColor } from '../../components/Palette'
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
  updateSyllablesColor(index: number, color: Color | null): void
}

function shortenSyllablesColor(syllablesColor: (Color | null)[]): string[] {
  return Array.from(syllablesColor, (color) => color ? shortenNameColor(color) : '')
}
function compressState({ syllablesColor, ...state }: SharedState): string {
  return compressAndEncode(JSON.stringify({
    ...state,
    syllablesColor: shortenSyllablesColor(syllablesColor)
  }))
}

export const defaultStore: SharedState = {
  name: '',
  artists: '',
  lyrics: '',
  syllablesColor: []
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
      // Updated the colors if the lyrics have changed, but still pass through
      // if the colors are updated (when parsing URL's state)
      const haveLyricsChanged = !!next?.lyrics && next.lyrics === state.lyrics
      const newSyllablesColor = !!next?.syllablesColor ? next.syllablesColor : haveLyricsChanged ? [] : state.syllablesColor
      // When syllables color are passed, we need to shorten their names for the shareable, like in updateSyllablesColor
      return {
        ...next,
        shareable: compressState({
          ...state,
          ...next,
          syllablesColor: newSyllablesColor
        })
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
      return {
        syllablesColor: state.syllablesColor,
        shareable: compressState(state)
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
