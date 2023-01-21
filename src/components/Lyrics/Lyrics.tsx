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

const defaultText = `J'suis dans les catacombes, je vise ton canasson
J'sors des rimes à la s'conde, l'Empereur, le pharaon
Le soir, je drague ta blonde, j'vais gagner l'marathon
Chargeur plein d'balles à plomb, pas l'temps pour la baston
`;

interface SyllableProps {
  index: number
}
function Syllable({ index, children }: React.PropsWithChildren<SyllableProps>) {
  const [pickedColor] = usePickedColor()
  const { updateSyllablesColor } = useShareableStoreAction()
  const color = useShareableStore((state) => state.syllablesColor[index])
  const { base, hover } = color ?? noColor

  return (
    <span
      role="button"
      className={clsx('select-all', base, hover)}
      onClick={() => updateSyllablesColor(index, pickedColor ?? noColor)}
    >
      {children}
    </span>
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
    <div className="flex flex-col items-center overflow-y-auto pl-4 pt-4 w-full h-full">
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
      <div className='max-w-lg w-full h-full border-red-200'>
        {isEditing ? (
          <textarea
            className="h-full w-full bg-transparent resize-none -mb-1"
            value={editedLyrics}
            onChange={(e) => setEditedLyrics(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter') {
                doneEditing()
              } else if(e.key === 'Escape') {
                cancelEditing()
              }
            }}
          ></textarea>
        ) : (
          <p className="whitespace-pre-line h-full">
            {syllables.map(({ id, content }, index) => {
              // If it has a space, that means it's not a syllable
              if(/\s/i.test(content)) {
                return content
              } else {
                return <Syllable key={id} index={index}>{content}</Syllable>
              }
            })}
          </p>
        )}
      </div>
    </div>
  );
}
