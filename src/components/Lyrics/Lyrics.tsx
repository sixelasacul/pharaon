import clsx from 'clsx';
import * as React from 'react'
import { PencilIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { identifyArrayItems } from '../../utils/identifyArrayItems';
import { extractSyllablesFromSentence } from '../../utils/parser';
import { Color, usePickedColor } from '../../state/PickedColorContext';
import { useShareableStoreAction } from '../../state/shareableStore';
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
  const [{ base, hover }, setColor] = React.useState<Color>(noColor);
  const [pickedColor] = usePickedColor();
  const { updateSyllablesColor } = useShareableStoreAction()

  function editColor() {
    const nextColor = pickedColor ?? noColor
    setColor(nextColor)
    // To be changed later
    updateSyllablesColor(index, nextColor.base)
  }

  return (
    <span
      className={clsx('select-all', base, hover)}
      role="button"
      onClick={editColor}
    >
      {children}
    </span>
  );
}

export function Lyrics() {
  const [isEditMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(defaultText);
  const syllables = React.useMemo(
    () => identifyArrayItems(extractSyllablesFromSentence(text)),
    [text]
  );
  const { updateState } = useShareableStoreAction()

  function editText(newText: string) {
    setText(newText)
    updateState({ lyrics: newText, syllablesColor: [] })
  }

  return (
    <div className="flex flex-col items-center overflow-y-auto pl-4 pt-4 w-full h-full">
      <QuickAction>
        <IconButton
          onClick={() => setEditMode((v) => !v)}
        >
          {isEditMode ? <XMarkIcon /> : <PencilIcon />}
        </IconButton>
        <IconButton
          onClick={window.print}
          disabled={isEditMode}
        >
          <PrinterIcon />
          {/* Tooltip to suggest to print backgrounds + remove header and footer */}
        </IconButton>
        <ShareButton />
      </QuickAction>
      <div className='max-w-lg w-full h-full border-red-200'>
        {isEditMode ? (
          <textarea
            value={text}
            onChange={(e) => editText(e.target.value)}
            className="h-full w-full bg-transparent resize-none -mb-1"
          ></textarea>
        ) : (
          <p className="whitespace-pre-line h-full">
            {syllables.map(({ id, content }, index) => (
              <Syllable key={id} index={index}>{content}</Syllable>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
