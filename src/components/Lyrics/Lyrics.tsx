import { PencilIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import * as React from 'react'
import { usePickedColor } from '../../state/PickedColorContext'
import {
  useShareableStoreAction,
  useShareableStore
} from '../../state/shareableStore'
import { identifyArrayItems } from '../../utils/identifyArrayItems'
import { extractSyllablesFromSentence } from '../../utils/parser'
import { IconButton } from '../IconButton'
import { noColor } from '../Palette'
import { QuickAction } from '../QuickActions'
import { ShareButton } from '../ShareButton'
import { Syllable as InternalSyllable } from '../Syllable'

const DEFAULT_TEXT =
  'Ajouter un texte en cliquant sur le crayon en haut à droite'

interface SyllableProps {
  index: number
}
function Syllable({ index, children }: React.PropsWithChildren<SyllableProps>) {
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
  function toggleEdit() {
    if (isEditing) {
      doneEditing()
    } else {
      startEditing()
    }
  }

  return (
    <>
      <QuickAction>
        <IconButton onClick={toggleEdit}>
          {isEditing ? <XMarkIcon /> : <PencilIcon />}
        </IconButton>
        <IconButton onClick={window.print} disabled={isEditing}>
          <PrinterIcon />
          {/* Tooltip to suggest to print backgrounds + remove header and footer */}
        </IconButton>
        <ShareButton />
      </QuickAction>
      <div className='h-full w-full max-w-lg overflow-y-scroll border-red-200'>
        {isEditing ? (
          <textarea
            className='-mb-1 h-full w-full resize-none bg-transparent font-medium tracking-wide semi-expanded placeholder:oblique'
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
              'h-max whitespace-pre-line font-medium tracking-wide semi-expanded',
              { 'opacity-75 oblique': syllables.length === 0 }
            )}
          >
            {syllables.length > 0
              ? syllables.map(({ id, content }, index) => {
                  // If it has a space, that means it's not a syllable
                  if (/\s/i.test(content)) {
                    return content
                  } else {
                    return (
                      <Syllable key={id} index={index}>
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
