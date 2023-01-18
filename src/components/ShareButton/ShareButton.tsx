import { useClipboard } from 'use-clipboard-copy'
import { ShareIcon } from '@heroicons/react/24/solid';
import { IconButton } from '../IconButton';
import { useShareableStore } from '../../state/shareableStore';

export function ShareButton() {
  const shareable = useShareableStore()
  const { copy } = useClipboard()

  return (
    <IconButton
      onClick={() => copy(shareable)}
    >
      <ShareIcon />
    </IconButton>
  )
}
