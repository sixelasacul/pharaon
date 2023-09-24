export function canShare() {
  if ('canShare' in navigator) {
    return navigator.canShare()
  }
  return false
}

export async function shareUrl(url: string) {
  await navigator.share({ url })
}
