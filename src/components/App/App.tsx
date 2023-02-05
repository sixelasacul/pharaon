import * as React from "react";
import { z } from "zod";
import { PickedColorProvider } from "../../state/PickedColorContext";
import { useShareableStore, useShareableStoreAction, defaultStore } from "../../state/shareableStore";
import { decodeAndDecompress } from "../../utils/compressor";
import { Lyrics } from "../Lyrics";
import { SongMetadata } from "../Metadata";
import { Palette, paletteMap } from "../Palette";
import { QuickActionsContainer } from "../QuickActions";
import { Title } from "../Title";

// Should be in shareableStore?
const stateSchema = z.object({
  lyrics: z.string(),
  artists: z.string(),
  name: z.string()
})
const urlStateSchema = stateSchema.extend({
  syllablesColor: z.array(z.string()).transform((val) => val.map((color) => color ? paletteMap[color] : null))
})
const eventStateSchema = stateSchema.extend({
  syllablesColor: z.array(z.object({
    base: z.string(),
    border: z.string(),
    hover: z.string(),
    name: z.string()
  }).nullable())
}).optional()

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

function useStoreUpdateFromUrl() {
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
        console.warn('Invalid state in URL', hash)
      }
    }

    // Set up listeners to update store when going back via browser actions
    // (supports undo/redo)
    function listener(event: PopStateEvent) {
      console.log(event.state)
      try {
        const parsedWithSchema = eventStateSchema.parse(event.state)
        updateState(parsedWithSchema ?? defaultStore)
      } catch(e) {
        console.warn('Invalid state in popstate event', event.state)
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
        <div className="m-2 print:hidden">
          <Title />
        </div>
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
