import { fromUint8Array, toUint8Array } from 'js-base64'
import { deflate, inflate } from 'pako'
import { shortenNameColor } from '../components/Palettes'
import { type SharedState } from '../state/shareableStore'

// Based on https://github.com/mermaid-js/mermaid-live-editor/blob/7c64a6549779435986739d48d5dbf3710725c281/src/lib/util/serde.ts#L1

const encoder = new TextEncoder()
export function compressAndEncode(original: string): string {
  const toArray = encoder.encode(original)
  const compressed = deflate(toArray)
  return fromUint8Array(compressed)
}

export function decodeAndDecompress(encoded: string): string {
  const decoded = toUint8Array(encoded)
  return inflate(decoded, { to: 'string' })
}

function shortenSyllablesColor(syllablesColor: SharedState['syllablesColor']) {
  // Instead of colors, we save a short code from the palette
  const shortened: Array<[number, string]> = []
  for (const [index, color] of syllablesColor) {
    shortened.push([index, shortenNameColor(color)])
  }
  return shortened
}

export function serializeState({
  syllablesColor,
  syllablesTempo,
  ...state
}: SharedState) {
  return JSON.stringify({
    ...state,
    syllablesColor: shortenSyllablesColor(syllablesColor),
    syllablesTempo: [...syllablesTempo.entries()]
  })
}

export function compressState(state: SharedState): string {
  return compressAndEncode(serializeState(state))
}
