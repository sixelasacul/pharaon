import { type SharedState } from '../state/shareableStore'
import { compressState } from './compressor'

export function canNavigatorShare(url: string) {
  if ('canShare' in navigator) {
    return navigator.canShare({ url })
  }
  return false
}

export async function shareUrl(url: string) {
  await navigator.share({ url })
}

export function generateShareableUrl(state: SharedState) {
  const shareable = compressState(state)
  const url = new URL(window.location.origin)
  url.hash = shareable
  return url.toString()
}
