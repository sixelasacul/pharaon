import * as React from 'react'
import { validate } from 'uuid'
import {
  serializedStateSchema,
  useShareableStoreAction,
  useShareableStoreState
} from '../../state/shareableStore'
import { decodeAndDecompress } from '../../utils/compressor'
import { getHistoryEntry, hasEntry, updateHistory } from '../../utils/history'
import { logError } from '../../utils/log'

// TODO: Replace with react-query reading url hash and querying localstorage + API (tbd)

export function SyncStore() {
  const state = useShareableStoreState()
  const { resetState, updateState } = useShareableStoreAction()

  // Read URL to initialize state, and setup a listener to update the state when
  // hash changes. At some point, I should be using `react-router-dom`.
  React.useEffect(() => {
    function parseAndUpdateState() {
      // hash contains leading #
      const hash = window.location.hash.substring(1)
      // Determine whether it's an id, stored locally or externally (later), or a hash to be parsed
      if (hash !== '') {
        if (validate(hash)) {
          if (hasEntry(hash)) {
            const entry = getHistoryEntry(hash)
            if (entry !== null) {
              updateState(entry)
            }
          } else {
            // API call
          }
        } else {
          // Probably a compressed state
          try {
            const parsedFromUrl = JSON.parse(decodeAndDecompress(hash))
            // TODO: Handle version changes (e.g. addition of id, dates)
            // But there's still a decompressing error for some old links idk
            const parsedWithSchema = serializedStateSchema.parse(parsedFromUrl)
            updateState(parsedWithSchema)
          } catch (e) {
            // TODO: Show toast feedback
            logError('Invalid state in URL', hash, e)
          }
        }
      } else {
        resetState()
      }
    }

    parseAndUpdateState()

    window.addEventListener('hashchange', parseAndUpdateState)
    return () => {
      window.removeEventListener('hashchange', parseAndUpdateState)
    }
  }, [resetState, updateState])

  // Updates the URL and the history based on the generated id
  React.useEffect(() => {
    console.log({ state })
    const hash = window.location.hash.substring(1)
    const { id } = state
    if (id !== '') {
      // react-query + debounce
      // Note: we should not call updateHistory the first time the state is
      // displayed on the page; Thus we need to know when the above useEffect
      // calls `updateState`, keep that in memory to skip `updateHistory`
      updateHistory(state)
      if (id !== hash) {
        window.history.pushState(null, '', `#${id}`)
      }
    }
  }, [state])

  return null
}
