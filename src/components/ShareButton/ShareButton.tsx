import {
  ShareIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import { useClipboard } from 'use-clipboard-copy'
import { canNavigatorShare, shareUrl } from '../../utils/share'
import { IconButton } from '../IconButton'

function ClipboardIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return <ClipboardDocumentCheckIcon />
  }
  return <ClipboardDocumentIcon />
}

export function ShareButton() {
  const url = window.location.href
  const canShare = canNavigatorShare(url)
  const { copy, copied } = useClipboard({ copiedTimeout: 1000 })

  async function share() {
    if (canShare) {
      await shareUrl(url)
    } else {
      copy(url)
    }
  }

  return (
    <IconButton
      onClick={() => {
        void share()
      }}
    >
      {canShare ? <ShareIcon /> : <ClipboardIcon copied={copied} />}
    </IconButton>
  )
}
