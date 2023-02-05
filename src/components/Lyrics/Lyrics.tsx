import clsx from 'clsx';
import * as React from 'react'
import { PencilIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { identifyArrayItems } from '../../utils/identifyArrayItems';
import { extractSyllablesFromSentence } from '../../utils/parser';
import { usePickedColor } from '../../state/PickedColorContext';
import { useShareableStoreAction, useShareableStore } from '../../state/shareableStore';
import { noColor } from '../Palette';
import { QuickAction } from '../QuickActions';
import { IconButton } from '../IconButton';
import { ShareButton } from '../ShareButton';
import { Syllable as InternalSyllable } from '../Syllable';

const DEFAULT_TEXT = 'Ajouter un texte en cliquant sur le crayon en haut à droite'

interface SyllableProps {
  index: number
}
function Syllable({ index, children }: React.PropsWithChildren<SyllableProps>) {
  // Prefer null rather than undefined
  const [pickedColor = null] = usePickedColor()
  const { updateSyllablesColor } = useShareableStoreAction()
  const color = useShareableStore((state) => state.syllablesColor[index])

  return (
    <InternalSyllable
      color={color ?? noColor}
      onClick={() => updateSyllablesColor(index, pickedColor)}
    >
      {children}
    </InternalSyllable>
  );
}

export function Lyrics() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedLyrics, setEditedLyrics] = React.useState('')
  const lyrics = useShareableStore((state) => state.lyrics)
  const { updateState } = useShareableStoreAction()
  const syllables = React.useMemo(
    () => identifyArrayItems(extractSyllablesFromSentence(lyrics)),
    [lyrics]
  );

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
    if(isEditing) {
      doneEditing()
    } else {
      startEditing()
    }
  }

  return (
    <div className="flex flex-col items-center overflow-y-auto w-full h-full">
      <QuickAction>
        <IconButton
          onClick={toggleEdit}
        >
          {isEditing ? <XMarkIcon /> : <PencilIcon />}
        </IconButton>
        <IconButton
          onClick={window.print}
          disabled={isEditing}
        >
          <PrinterIcon />
          {/* Tooltip to suggest to print backgrounds + remove header and footer */}
        </IconButton>
        <ShareButton />
      </QuickAction>
      <div className='max-w-lg w-full h-full border-red-200 font-medium tracking-wide semi-expanded'>
        {isEditing ? (
          <textarea
            className="h-full w-full bg-transparent resize-none -mb-1"
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter' && e.shiftKey) {
                doneEditing()
              } else if(e.key === 'Escape') {
                cancelEditing()
              }
            }}
          ></textarea>
        ) : (
          <p className={clsx("whitespace-pre-line h-full", {'oblique opacity-75': syllables.length === 0})}>
            {syllables.length > 0 ? (
              syllables.map(({ id, content }, index) => {
                // If it has a space, that means it's not a syllable
                if(/\s/i.test(content)) {
                  return content
                } else {
                  return <Syllable key={id} index={index}>{content}</Syllable>
                }
              })
            ) : DEFAULT_TEXT}
          </p>
        )}
      </div>
    </div>
  );
}
