import { create } from 'zustand'
import { shortenNameColor } from '../../components/Palette'
import { compressAndEncode } from '../../utils/compressor'
import { type Color } from '../PickedColorContext'
import { type SharedState } from './schemas'

interface Store extends SharedState {
  shareable: string
  updateState: (next: Partial<SharedState>) => void
  updateSyllablesColor: (index: number, color: Color | null) => void
}

export const defaultStore: SharedState = {
  name: '',
  artists: '',
  lyrics: '',
  syllablesColor: new Map()
}

function shortenSyllablesColor(syllablesColor: SharedState['syllablesColor']) {
  // Instead of colors, we save a short code from the palette
  const shortened: Array<[number, string]> = []
  for (const [index, color] of syllablesColor) {
    shortened.push([index, shortenNameColor(color)])
  }
  return shortened
}
function compressState({ syllablesColor, ...state }: SharedState): string {
  return compressAndEncode(
    JSON.stringify({
      ...state,
      syllablesColor: shortenSyllablesColor(syllablesColor)
    })
  )
}
function isDefaultStore(next: Partial<SharedState>) {
  const keys = Object.keys(defaultStore) as Array<keyof SharedState>
  return keys.every((key) => {
    if (key === 'syllablesColor') {
      return next[key]?.size === defaultStore[key].size
    }
    return next[key] === defaultStore[key]
  })
}

// The advantage of the zustand store compared to the React context is that we
// can use selector to prevent extra renders where we don't read the state
// (we only use the actions in most components, except when sharing the link)
const useStore = create<Store>((set) => ({
  ...defaultStore,
  shareable: '',
  updateState(next) {
    set(({ shareable: _, ...state }) => {
      // Updated the colors if the lyrics have changed, but still pass through
      // if the colors are updated (when parsing URL's state)
      const haveLyricsChanged =
        Boolean(next?.lyrics) && next.lyrics === state.lyrics
      const newSyllablesColor =
        next?.syllablesColor !== undefined
          ? next.syllablesColor
          : haveLyricsChanged
          ? defaultStore.syllablesColor
          : state.syllablesColor
      return {
        ...next,
        // We want a clean URL when the store is unchanged, thus not compressing it
        shareable: isDefaultStore(next)
          ? ''
          : compressState({
              ...state,
              ...next,
              syllablesColor: newSyllablesColor
            })
      }
    })
  },
  updateSyllablesColor(index, color) {
    set(({ shareable: _, ...state }) => {
      if (color !== null) {
        state.syllablesColor.set(index, color)
      } else {
        state.syllablesColor.delete(index)
      }
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
