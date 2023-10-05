import { Bars3Icon } from '@heroicons/react/24/outline'
import { useMedia } from 'react-use'
import { History } from '@/components/History'
import { Title } from '@/components/Title'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

function PreparedHistory() {
  return (
    <div className='flex h-full flex-col gap-2 py-4 md:gap-4 md:p-8'>
      <h3 className='text-center text-lg md:text-xl'>
        Historique des découpages
      </h3>
      <div className='overflow-y-auto'>
        <History />
      </div>
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
        <Button icon size='lg' variant='ghost'>
          <Bars3Icon />
        </Button>
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
