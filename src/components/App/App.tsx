import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { UserSelectionProvider } from '../../state/UserSelectionContext'
import { Lyrics } from '../Lyrics'
import { Menu } from '../Menu'
import { SongMetadata } from '../Metadata'
import { Palettes } from '../Palettes'
import { QuickActionsContainer } from '../QuickActions'
import { Title } from '../Title'
import { Button } from '../ui/button'
import { SyncStore } from './SyncStore'

export function App() {
  return (
    <>
      <SyncStore />
      <QuickActionsContainer>
        <Button asChild icon variant='outline'>
          <a href='#'>
            <DocumentPlusIcon />
          </a>
        </Button>
      </QuickActionsContainer>
      <UserSelectionProvider>
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
          <div className='grid grid-rows-3 place-content-end'>
            <div />
            <Palettes />
          </div>
        </div>
      </UserSelectionProvider>
    </>
  )
}
