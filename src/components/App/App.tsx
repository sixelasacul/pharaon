import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { PickedColorProvider } from '../../state/PickedColorContext'
import { History } from '../History'
import { IconButton } from '../IconButton'
import { Lyrics } from '../Lyrics'
import { SongMetadata } from '../Metadata'
import { Palette } from '../Palette'
import { QuickActionsContainer } from '../QuickActions'
import { Title } from '../Title'
import { SyncStore } from './SyncStore'

export function App() {
  return (
    <>
      <SyncStore />
      <PickedColorProvider>
        <div className='main-layout'>
          <div className='col-span-2 h-min print:hidden md:col-span-1'>
            <Title />
          </div>
          <div className='flex flex-col items-center gap-4'>
            <SongMetadata />
            <Lyrics />
            {/* Temporary; on mobile, it will appear in a sidebar, and on desktop, just on the right */}
            <History />
          </div>
          <div className='flex flex-col justify-between'>
            <QuickActionsContainer>
              <IconButton as='a' href='/'>
                <DocumentPlusIcon />
              </IconButton>
            </QuickActionsContainer>
            <Palette />
            <div />
          </div>
        </div>
      </PickedColorProvider>
    </>
  )
}
