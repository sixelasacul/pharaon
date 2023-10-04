import { Bars3Icon } from '@heroicons/react/24/outline'
import { useMedia } from 'react-use'
import { History } from '@/components/History'
import { IconButton } from '@/components/IconButton'
import { Title } from '@/components/Title'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

function PreparedHistory() {
  return (
    <div className='flex flex-col gap-2 p-0 py-4 md:gap-4 md:p-8'>
      <h3 className='text-center text-lg md:text-xl'>
        Historique des découpages
      </h3>
      <History />
    </div>
  )
}

export function Menu() {
  const isDesktop = useMedia('(min-width: 768px)')

  if (isDesktop) {
    return <PreparedHistory />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <IconButton size='lg' contained={false}>
          <Bars3Icon />
        </IconButton>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetHeader>
          <Title as={SheetTitle} className='text-left' />
        </SheetHeader>
        <PreparedHistory />
      </SheetContent>
    </Sheet>
  )
}
