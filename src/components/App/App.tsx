import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { PickedColorProvider } from '../../state/PickedColorContext'
import { IconButton } from '../IconButton'
import { Lyrics } from '../Lyrics'
import { Menu } from '../Menu'
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
            <div className='flex flex-row items-center gap-2 md:flex-col-reverse md:items-start md:gap-4'>
              <Menu />
              <Title />
            </div>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <SongMetadata />
            <Lyrics />
          </div>
          <div className='flex flex-col items-end justify-center'>
            <QuickActionsContainer>
              <IconButton as='a' href='#'>
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
