export function canNavigatorShare(url: string) {
  if ('canShare' in navigator) {
    return navigator.canShare({ url })
  }
  return false
}

export async function shareUrl(url: string) {
  await navigator.share({ url })
}
