import { PickedColorProvider } from '../../state/PickedColorContext'
import { Lyrics } from '../Lyrics'
import { SongMetadata } from '../Metadata'
import { Palette } from '../Palette'
import { QuickActionsContainer } from '../QuickActions'
import { Title } from '../Title'
import { UpdateUrl, useStoreUpdateFromUrl } from './urlState'

export function App() {
  useStoreUpdateFromUrl()

  return (
    <PickedColorProvider>
      <div className='flex h-screen flex-row gap-4 overflow-hidden bg-slate-50 print:bg-transparent'>
        <div className='m-2 print:hidden'>
          <Title />
        </div>
        <div className='flex flex-1 flex-col items-center gap-4'>
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
  )
}
