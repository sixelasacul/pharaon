import * as React from 'react'
import { useShareableStore } from '../../state/shareableStore'

// TODO: Replace with react-query reading url hash and querying localstorage + API (tbd)
// export function useStoreUpdateFromUrl() {
//   const { updateState } = useShareableStoreAction()

//   React.useEffect(() => {
//     // Read URL to initialize store
//     const { hash } = window.location
//     if (Boolean(hash)) {
//       try {
//         // hash contains leading #
//         const parsedFromUrl = JSON.parse(decodeAndDecompress(hash.substring(1)))
//         const parsedWithSchema = urlStateSchema.parse(parsedFromUrl)
//         updateState(parsedWithSchema)
//       } catch (e) {
//         logError('Invalid state in URL', hash, e)
//       }
//     }

//     // Set up listeners to update store when going back via browser actions
//     // (supports undo/redo)
//     function listener(event: PopStateEvent) {
//       try {
//         const parsedWithSchema = Boolean(event.state)
//           ? stateSchema.parse(event.state)
//           : defaultStore
//         updateState(parsedWithSchema)
//       } catch (e) {
//         logError('Invalid state in popstate event', event.state, e)
//       }
//     }
//     window.addEventListener('popstate', listener)
//     return () => {
//       window.removeEventListener('popstate', listener)
//     }
//   }, [updateState])
// }

function useUrlUpdateFromStore() {
  const id = useShareableStore((state) => state.id)

  React.useEffect(() => {
    // hash contains leading #
    const hash = window.location.hash.substring(1)
    if (id !== '' && id !== hash) {
      window.history.pushState(null, '', `#${id}`)
    }
  }, [id])
}

// As a component rather than a hook, so that it can be called outside of the
// main component tree, avoiding extra renders that aren't relevant
export function UpdateUrl() {
  useUrlUpdateFromStore()
  return null
}
