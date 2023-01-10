import clsx from 'clsx';
import * as React from 'react'
import { PencilIcon, XMarkIcon, PrinterIcon } from '@heroicons/react/24/solid';
import { identifyArrayItems } from '../../utils/identifyArrayItems';
import { extractSyllablesFromSentence } from '../../utils/parser';
import { Color, usePickedColor } from '../PickedColorContext';
import { noColor } from '../Palette';
import { QuickAction } from '../QuickActions';
import { IconButton } from '../IconButton';

const defaultText = `J'suis dans les catacombes, je vise ton canasson
J'sors des rimes à la s'conde, l'Empereur, le pharaon
Le soir, je drague ta blonde, j'vais gagner l'marathon
Chargeur plein d'balles à plomb, pas l'temps pour la baston
`;

function Syllable({ children }: React.PropsWithChildren) {
  const [{ base, hover }, setColor] = React.useState<Color>(noColor);
  const [pickedColor] = usePickedColor();

  return (
    <span
      className={clsx('select-all', base, hover)}
      role="button"
      onClick={() => setColor(pickedColor ?? noColor)}
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
      </QuickAction>
      <div className='max-w-lg w-full h-full border-red-200'>
        {isEditMode ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-full w-full bg-transparent resize-none -mb-1"
          ></textarea>
        ) : (
          <p className="whitespace-pre-line h-full">
            {syllables.map(({ id, content }) => (
              <Syllable key={id}>{content}</Syllable>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
