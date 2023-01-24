import * as React from "react";
import { PickedColorProvider } from "../../state/PickedColorContext";
import { useShareableStore, useShareableStoreAction, SharedState, defaultStore } from "../../state/shareableStore";
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
  const { shareable, ...rest } = useShareableStore(({ updateState, updateSyllablesColor, ...rest }) => rest)

  React.useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (shareable !== hash) {
      window.history.pushState(rest, '', `${window.location.origin}#${shareable}`)
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
      updateState(event.state as SharedState ?? defaultStore)
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

// TODO: Install new fonts (e.g. Mona/Hubot from GitHub)
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
