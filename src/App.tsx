import * as React from 'react';
import { clsx } from 'clsx';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { identifyArrayItems } from './identifyArrayItems';
import { extractSyllablesFromSentence } from './parser';
import { Color, palette } from './palette';

const defaultText = `J'suis dans les catacombes, je vise ton canasson
J'sors des rimes à la s'conde, l'Empereur, le pharaon
Le soir, je drague ta blonde, j'vais gagner l'marathon
Chargeur plein d'balles à plomb, pas l'temps pour la baston
`;

// Using ReturnType<typeof React.useState<string>> does a union with all overloaded signatures
// which infers undefined, which isn't needed here
type PickedColorContextType = ReturnType<typeof React.useState<Color>>
const PickedColorContext = React.createContext<PickedColorContextType>([
  undefined,
  () => undefined,
]);
function PickedColorProvider({ children }: React.PropsWithChildren) {
  const colorState = React.useState<Color>();
  return (
    <PickedColorContext.Provider value={colorState}>
      {children}
    </PickedColorContext.Provider>
  );
}
function usePickedColor() {
  const ctx = React.useContext(PickedColorContext);
  if (!ctx && ctx !== '') {
    throw new Error('No PickedColorContext available');
  }
  return ctx;
}

const noColor: Color = {
  base: '',
  hover: 'hover:bg-black/10',
  border: ''
}
function Syllable({ children }: React.PropsWithChildren) {
  const [{base, hover}, setColor] = React.useState<Color>(noColor);
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

function Lyrics() {
  const [isEditMode, setEditMode] = React.useState(false);
  const [text, setText] = React.useState(defaultText);

  const syllables = React.useMemo(
    () => identifyArrayItems(extractSyllablesFromSentence(text)),
    [text]
  );

  return (
    <div className="flex-1 flex flex-col items-end overflow-y-auto pl-4 pt-4">
      <button
        onClick={() => setEditMode((v) => !v)}
        className="h-4 w-4 p-2 m-0.5 box-content rounded-full shadow hover:bg-black/10 print:hidden"
      >
        {isEditMode ? <XMarkIcon /> : <PencilIcon />}
      </button>
      {isEditMode ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-full"
        ></textarea>
      ) : (
        <p className="whitespace-pre-line">
          {syllables.map(({ id, content }) => (
            <Syllable key={id}>{content}</Syllable>
          ))}
        </p>
      )}
    </div>
  );
}

function Palette() {
  const [pickedColor, setPickedColor] = usePickedColor();
  return (
    <div className="flex flex-row items-center print:hidden">
      <div className="grid grid-cols-2 gap-2 rounded-l shadow-md p-2">
        {palette.map((color) => (
          <button
            className={clsx('rounded-full h-6 w-6', color.base, color.hover, color.border, {
              'border': pickedColor === color,
            })}
            onClick={() =>
              setPickedColor((prev) => (prev === color ? undefined : color))
            }
          ></button>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <PickedColorProvider>
      <div className="flex flex-row h-screen overflow-hidden gap-4 bg-slate-50">
        <Lyrics />
        <Palette />
      </div>
    </PickedColorProvider>
  );
}

export default App;
