import { PencilIcon, PrinterIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import * as React from 'react'
import { usePickedColor } from '../../state/PickedColorContext'
import {
  useShareableStoreAction,
  useShareableStore
} from '../../state/shareableStore'
import { identifyArrayItems } from '../../utils/identifyArrayItems'
import {
  WORD_SEPARATOR_REGEX,
  extractSyllablesFromSentence
} from '../../utils/parser'
import { noColor } from '../Palette'
import { QuickAction } from '../QuickActions'
import { ShareButton } from '../ShareButton'
import {
  Syllable as InternalSyllable,
  type SyllableProps as InternalSyllableProps
} from '../Syllable'
import { Button } from '../ui/button'
import { Toggle } from '../ui/toggle'

const DEFAULT_TEXT =
  'Ajouter un texte en cliquant sur le crayon en haut à droite'

interface SyllableProps
  extends Omit<InternalSyllableProps, 'color' | 'onClick'> {
  index: number
}
function Syllable({
  index,
  children,
  ...props
}: React.PropsWithChildren<SyllableProps>) {
  // Prefer null rather than undefined
  const [pickedColor = null] = usePickedColor()
  const { updateSyllablesColor } = useShareableStoreAction()
  const color = useShareableStore((state) => state.syllablesColor.get(index))

  return (
    <InternalSyllable
      color={color ?? noColor}
      onClick={() => {
        updateSyllablesColor(index, pickedColor)
      }}
      {...props}
    >
      {children}
    </InternalSyllable>
  )
}

export function Lyrics() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedLyrics, setEditedLyrics] = React.useState('')
  const lyrics = useShareableStore((state) => state.lyrics)
  const { updateState } = useShareableStoreAction()
  const syllables = React.useMemo(
    () => identifyArrayItems(extractSyllablesFromSentence(lyrics)),
    [lyrics]
  )

  function startEditing() {
    setEditedLyrics(lyrics)
    setIsEditing(true)
  }
  function doneEditing() {
    setIsEditing(false)
    updateState({ lyrics: editedLyrics })
  }
  function cancelEditing() {
    setIsEditing(false)
    setEditedLyrics(lyrics)
  }

  return (
    <>
      <QuickAction>
        <Toggle
          variant='outline'
          onPressedChange={(pressed) => {
            pressed ? startEditing() : doneEditing()
          }}
        >
          <PencilIcon />
        </Toggle>
        <Button
          icon
          variant='outline'
          onClick={window.print}
          disabled={isEditing}
        >
          <PrinterIcon />
          {/* Tooltip to suggest to print backgrounds + remove header and footer */}
        </Button>
        <ShareButton />
      </QuickAction>
      <div className='h-full w-full max-w-lg overflow-y-auto border-red-200'>
        {isEditing ? (
          <textarea
            className='-mb-1 h-full w-full resize-none bg-transparent font-medium leading-relaxed tracking-wide semi-expanded placeholder:oblique'
            placeholder={DEFAULT_TEXT}
            value={editedLyrics}
            onChange={(e) => {
              setEditedLyrics(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                doneEditing()
              } else if (e.key === 'Escape') {
                cancelEditing()
              }
            }}
          ></textarea>
        ) : (
          <p
            className={clsx(
              'h-max whitespace-pre-line font-medium leading-relaxed tracking-wide semi-expanded',
              { 'opacity-75 oblique': syllables.length === 0 }
            )}
          >
            {syllables.length > 0
              ? syllables.map(({ id, content }, index) => {
                  if (WORD_SEPARATOR_REGEX.test(content)) {
                    return content
                  } else {
                    return (
                      <Syllable key={id} index={index} tempo={1}>
                        {content}
                      </Syllable>
                    )
                  }
                })
              : DEFAULT_TEXT}
          </p>
        )}
      </div>
    </>
  )
}
