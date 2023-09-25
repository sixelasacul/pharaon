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
      <div className='grid h-screen grid-cols-2-left flex-row gap-4 bg-slate-50 pl-2 pt-2 print:bg-transparent md:grid-cols-3-central'>
        <div className='col-span-2 h-min print:hidden md:col-span-1'>
          <Title />
        </div>
        <div className='flex flex-col items-center gap-4 overflow-hidden'>
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
