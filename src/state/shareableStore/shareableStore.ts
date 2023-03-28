import { create } from 'zustand'
import { batch, computed, signal, effect } from '@preact/signals-react'
import { shortenNameColor } from '../../components/Palette'
import { compressAndEncode } from '../../utils/compressor'
import { Color } from '../PickedColorContext'
import { SharedState } from './schemas'

interface Store extends SharedState {
  shareable: string
  updateState(next: Partial<SharedState>): void
  updateSyllablesColor(index: number, color: Color | null): void
}

export const defaultStore: SharedState = {
  name: '',
  artists: '',
  lyrics: '',
  syllablesColor: new Map()
}

function shortenSyllablesColor(syllablesColor: SharedState['syllablesColor']) {
  // Instead of colors, we save a short code from the palette
  const shortened: [number, string][] = []
  for (const [index, color] of syllablesColor) {
    shortened.push([index, shortenNameColor(color)])
  }
  return shortened
}
function compressState({ syllablesColor, ...state }: SharedState): string {
  return compressAndEncode(JSON.stringify({
    ...state,
    syllablesColor: shortenSyllablesColor(syllablesColor)
  }))
}
function isDefaultStore(next: Partial<SharedState>) {
  const keys = Object.keys(defaultStore) as (keyof SharedState)[]
  return keys.every((key) => {
    if(key === 'syllablesColor') {
      return next[key]?.size === defaultStore[key].size
    }
    return next[key] === defaultStore[key]
  })
}

export const store = signal<SharedState>(defaultStore)
effect(() => console.log(store.value))
export const shareable = computed(() => isDefaultStore(store.value) ? '' : compressState(store.value))
export function updateState(next: Partial<SharedState>): void {
  // const state = store.value
  // const haveLyricsChanged = !!next?.lyrics && next.lyrics === state.lyrics
  // const newSyllablesColor = !!next?.syllablesColor ? next.syllablesColor : haveLyricsChanged ? defaultStore.syllablesColor : state.syllablesColor
  store.value = {
    ...store.value,
    ...next
  }
}
export function updateSyllablesColor(index: number, color: Color | null): void {
  batch(() => {
    if (color) {
      store.value.syllablesColor.set(index, color)
    } else {
      store.value.syllablesColor.delete(index)
    }
  })
}

// The advantage of the zustand store compared to the React context is that we
// can use selector to prevent extra renders where we don't read the state
// (we only use the actions in most components, except when sharing the link)
// const useStore = create<Store>((set) => ({
//   ...defaultStore,
//   shareable: '',
//   updateState(next) {
//     return set(({ shareable: _, ...state }) => {
//       // Updated the colors if the lyrics have changed, but still pass through
//       // if the colors are updated (when parsing URL's state)
//       const haveLyricsChanged = !!next?.lyrics && next.lyrics === state.lyrics
//       const newSyllablesColor = !!next?.syllablesColor ? next.syllablesColor : haveLyricsChanged ? defaultStore.syllablesColor : state.syllablesColor
//       return {
//         ...next,
//         // We want a clean URL when the store is unchanged, thus not compressing it
//         shareable: isDefaultStore(next) ? '' : compressState({
//           ...state,
//           ...next,
//           syllablesColor: newSyllablesColor
//         })
//       }
//     })
//   },
//   updateSyllablesColor(index, color) {
//     return set(({ shareable: _, ...state }) => {
//       if(color) {
//         state.syllablesColor.set(index, color)
//       } else {
//         state.syllablesColor.delete(index)
//       }
//       return {
//         syllablesColor: state.syllablesColor,
//         shareable: compressState(state)
//       }
//     })
//   }
// }))

// export const useShareableStore = useStore
// export function useShareableStoreAction() {
//   const updateState = useStore((state) => state.updateState)
//   const updateSyllablesColor = useStore((state) => state.updateSyllablesColor)
//   return {
//     updateState,
//     updateSyllablesColor
//   }
// }
