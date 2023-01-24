import { fromUint8Array, toUint8Array } from 'js-base64'
import { deflate, inflate } from 'pako'

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
