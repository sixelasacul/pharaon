export function canShare() {
  if('canShare' in navigator) {
    return navigator.canShare()
  }
  return false
}

export function shareUrl(url: string) {
  return navigator.share({ url })
}
