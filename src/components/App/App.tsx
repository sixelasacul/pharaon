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
      <div className='main-layout'>
        <div className='col-span-2 h-min print:hidden md:col-span-1'>
          <Title />
        </div>
        <div className='flex flex-col items-center gap-4'>
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
