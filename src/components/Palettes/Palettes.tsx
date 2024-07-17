import { BlendingModeIcon, RulerHorizontalIcon } from '@radix-ui/react-icons'
import { ColorPalette } from './ColorPalette'
import { TempoPalette } from './TempoPalette'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Palettes() {
  // Round palette, like actual paint palette?
  return (
    <div className='flex flex-col gap-4'>
      <Tabs defaultValue='color' orientation='vertical'>
        <TabsList>
          <TabsTrigger value='color'>
            <div className='flex items-center gap-1'>
              <BlendingModeIcon />
              <span className='hidden md:inline'>Couleur</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value='tempo'>
            <div className='flex items-center gap-1'>
              <RulerHorizontalIcon />
              <span className='hidden md:inline'>Tempo</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='color'>
          <ColorPalette />
        </TabsContent>
        <TabsContent value='tempo'>
          <TempoPalette />
        </TabsContent>
      </Tabs>
    </div>
  )
}
