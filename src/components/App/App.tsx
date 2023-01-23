import * as React from "react";
import { PickedColorProvider } from "../../state/PickedColorContext";
import { useShareableStore, useShareableStoreAction, SharedState } from "../../state/shareableStore";
import { decodeAndDecompress } from "../../utils/compressor";
import { Lyrics } from "../Lyrics";
import { SongMetadata } from "../Metadata";
import { Palette, paletteMap } from "../Palette";
import { QuickActionsContainer } from "../QuickActions";

// To be properly configured with zod
interface ExportedSharedState extends Omit<SharedState, 'syllablesColor'> {
  syllablesColor: string[]
}

function useUrlUpdateFromStore() {
  const shareable = useShareableStore((state) => state.shareable)
  // Can cause issue as this would get all the store updates, so that when the
  // store is updated when going back in the history, it's then pushing again
  // another entry in it, breaking the history
  // Though, now, we need to decompress the shareable internally to access the
  // previous store, which is "inefficient" as we do have access to the history
  // state within the app, so we should be able to just read it.
  // const { shareable, ...rest } = useShareableStore(({ updateState, updateSyllablesColor, ...rest }) => rest)

  React.useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (shareable !== hash) {
      // window.history.replaceState(null, '', `${window.location.origin}#${shareable}`)
      window.history.pushState(null, '', `${window.location.origin}#${shareable}`)
      // window.history.pushState({ ...rest, shareable }, '', `${window.location.origin}#${shareable}`)
      // If I want to use `pushState` for the browser's built-in undo/redo
      // capability, I'll probably need react-router-dom to listen to URL changes
      // and re-update state based on that. Though thay may lead into infinite
      // loop as updating the state also updates the URL. There might be a way
      // to listen to only browser URL changes outside of the code?
      // Otherwise, probably not worth it. There might be a zustand solution
      // for that.
      // Like https://github.com/charkour/zundo
    }
  }, [shareable])
}

function useStoreUpdateFromUrl() {
  const { updateState } = useShareableStoreAction()

  React.useEffect(() => {
    // Read URL to initialize store
    const { hash } = window.location
    if (hash) {
      // TODO: use zod here for type safe conversion
      // hash contains leading #
      const parsed = JSON.parse(decodeAndDecompress(hash.substring(1))) as ExportedSharedState
      const state: SharedState = {
        ...parsed,
        syllablesColor: parsed.syllablesColor.map((color) => color ? paletteMap[color] : null)
      }
      updateState(state)
    }

    // Set up listeners to update store when going back via browser actions
    // (supports undo/redo)
    function listener(event: PopStateEvent) {
      // TODO: use zod for type safe conversion
      // updateState(event.state as SharedState)
      const { hash } = window.location
      if (hash) {
        const parsed = JSON.parse(decodeAndDecompress(hash.substring(1))) as ExportedSharedState
        const state: SharedState = {
          ...parsed,
          syllablesColor: parsed.syllablesColor.map((color) => color ? paletteMap[color] : null)
        }
        updateState(state)
      } else {
        // Should have an initial state for store
        console.log('else')
      }
    }
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])
}

// As a component rather than a hook, so that it can be called outside of the
// main component tree, avoiding extra renders that aren't relevant
function UpdateUrl() {
  useUrlUpdateFromStore()
  return null
}

export function App() {
  useStoreUpdateFromUrl()

  return (
    <PickedColorProvider>
      <div className="flex flex-row h-screen overflow-hidden gap-4 bg-slate-50 print:bg-transparent">
        <div className='flex flex-col items-center gap-4 flex-1'>
          <SongMetadata />
          <Lyrics />
        </div>
        <div className='flex flex-col justify-between'>
          <QuickActionsContainer />
          <Palette />
          <div />
        </div>
      </div>
      <UpdateUrl />
    </PickedColorProvider>
  );
}
