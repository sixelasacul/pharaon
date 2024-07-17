import * as React from 'react'
import { Card } from '@/components/ui/card'

export function Palette({ children }: React.PropsWithChildren) {
  return (
    <Card className='grid grid-cols-1 place-items-center gap-2 p-2 print:hidden md:grid-cols-2'>
      {children}
    </Card>
  )
}
