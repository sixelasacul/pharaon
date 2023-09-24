import { ShareIcon } from '@heroicons/react/24/solid'
import { useClipboard } from 'use-clipboard-copy'
import { IconButton } from '../IconButton'

export function ShareButton() {
  const { copy } = useClipboard()

  return (
    <IconButton
      onClick={() => {
        copy(window.location.href)
      }}
    >
      <ShareIcon />
    </IconButton>
  )
}
