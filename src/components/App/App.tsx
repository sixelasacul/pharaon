import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { PickedColorProvider } from '../../state/PickedColorContext'
import { Lyrics } from '../Lyrics'
import { Menu } from '../Menu'
import { SongMetadata } from '../Metadata'
import { Palette } from '../Palette'
import { QuickActionsContainer } from '../QuickActions'
import { Title } from '../Title'
import { Button } from '../ui/button'
import { SyncStore } from './SyncStore'

export function App() {
  return (
    <>
      <SyncStore />
      <PickedColorProvider>
        <div className='main-layout'>
          <div className='col-span-2 print:hidden md:col-span-1'>
            <div className='flex h-full flex-row items-center gap-2 md:flex-col-reverse md:items-start md:gap-4'>
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
              <Button asChild icon variant='outline'>
                <a href='#'>
                  <DocumentPlusIcon />
                </a>
              </Button>
            </QuickActionsContainer>
            <Palette />
            <div />
          </div>
        </div>
      </PickedColorProvider>
    </>
  )
}
