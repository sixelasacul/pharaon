import * as React from 'react'
import {
  urlStateSchema,
  useShareableStoreAction,
  useShareableStoreState
} from '../../state/shareableStore'
import { decodeAndDecompress } from '../../utils/compressor'
import { updateHistory } from '../../utils/history'
import { logError } from '../../utils/log'

// TODO: Replace with react-query reading url hash and querying localstorage + API (tbd)

export function SyncStore() {
  const state = useShareableStoreState()
  const { updateState } = useShareableStoreAction()

  // Read URL to initialize store
  React.useEffect(() => {
    // hash contains leading #
    const hash = window.location.hash.substring(1)
    if (hash !== '') {
      try {
        const parsedFromUrl = JSON.parse(decodeAndDecompress(hash))
        const parsedWithSchema = urlStateSchema.parse(parsedFromUrl)
        updateState(parsedWithSchema)
      } catch (e) {
        logError('Invalid state in URL', hash, e)
      }
    }
  }, [updateState])

  // Updates the URL and the history based on the generated id
  React.useEffect(() => {
    const hash = window.location.hash.substring(1)
    const { id } = state
    if (id !== '') {
      // react-query + debounce
      updateHistory(state)
      if (id !== hash) {
        window.history.pushState(null, '', `#${id}`)
      }
    }
  }, [state])

  return null
}
