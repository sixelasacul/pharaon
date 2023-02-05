import * as React from "react";
import { useShareableStore, useShareableStoreAction, defaultStore, stateSchema, urlStateSchema } from "../../state/shareableStore";
import { decodeAndDecompress } from "../../utils/compressor";

function logError(description: string, data: unknown, error: unknown) {
  if(import.meta.env.DEV) {
    console.group(description)
    console.error(data)
    console.error(error)
    console.groupEnd()
  } else {
    console.warn(description)
  }
}

export function useStoreUpdateFromUrl() {
  const { updateState } = useShareableStoreAction()

  React.useEffect(() => {
    // Read URL to initialize store
    const { hash } = window.location
    if (hash) {
      try {
        // hash contains leading #
        const parsedFromUrl = JSON.parse(decodeAndDecompress(hash.substring(1)))
        const parsedWithSchema = urlStateSchema.parse(parsedFromUrl)
        updateState(parsedWithSchema)
      } catch(e) {
        logError('Invalid state in URL', hash, e)
      }
    }

    // Set up listeners to update store when going back via browser actions
    // (supports undo/redo)
    function listener(event: PopStateEvent) {
      try {
        const parsedWithSchema = event.state ? stateSchema.parse(event.state) : defaultStore
        updateState(parsedWithSchema)
      } catch(e) {
        logError('Invalid state in popstate event', event.state, e)
      }
    }
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])
}

function useUrlUpdateFromStore() {
  const { shareable, ...rest } = useShareableStore(({ updateState, updateSyllablesColor, ...rest }) => rest)

  React.useEffect(() => {
    // hash contains leading #
    const hash = window.location.hash.substring(1)
    if (shareable && shareable !== hash) {
      window.history.pushState(rest, '', `#${shareable}`)
    }
  }, [shareable])
}

// As a component rather than a hook, so that it can be called outside of the
// main component tree, avoiding extra renders that aren't relevant
export function UpdateUrl() {
  useUrlUpdateFromStore()
  return null
}
