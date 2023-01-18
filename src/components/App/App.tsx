import { Lyrics } from "../Lyrics";
import { SongMetadata } from "../Metadata";
import { Palette } from "../Palette";
import { PickedColorProvider } from "../../state/PickedColorContext";
import { QuickActionsContainer } from "../QuickActions";

export function App() {
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
    </PickedColorProvider>
  );
}
