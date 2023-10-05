import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  ShareIcon
} from '@heroicons/react/24/outline'
import { useClipboard } from 'use-clipboard-copy'
import { useShareableStoreState } from '../../state/shareableStore'
import {
  canNavigatorShare,
  generateShareableUrl,
  shareUrl
} from '../../utils/share'
import { Button } from '../ui/button'

function ClipboardIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return <ClipboardDocumentCheckIcon />
  }
  return <ClipboardDocumentIcon />
}

export function ShareButton() {
  const { copy, copied } = useClipboard({ copiedTimeout: 1000 })
  const state = useShareableStoreState()
  const shareableUrl = generateShareableUrl(state)
  const canShare = canNavigatorShare(shareableUrl)

  async function share() {
    if (canShare) {
      await shareUrl(shareableUrl)
    } else {
      copy(shareableUrl)
    }
  }

  return (
    <Button
      icon
      variant='outline'
      onClick={() => {
        void share()
      }}
    >
      {canShare ? <ShareIcon /> : <ClipboardIcon copied={copied} />}
    </Button>
  )
}
