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

function UpdateUrl() {
  const shareable = useShareableStore((state) => state.shareable)

  React.useEffect(() => {
    if (shareable) {
      window.history.replaceState(null, '', `${window.location.origin}#${shareable}`)
    }
  }, [shareable])

  return null
}

export function App() {
  const { updateState } = useShareableStoreAction()

  React.useEffect(() => {
    const { hash } = window.location
    if (hash) {
      // TODO: use zod here for type safe conversion
      const parsed = JSON.parse(decodeAndDecompress(hash)) as ExportedSharedState
      const state: SharedState = {
        ...parsed,
        syllablesColor: parsed.syllablesColor.map((color) => color ? paletteMap[color] : null)
      }
      updateState(state)
    }
  }, [])

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
