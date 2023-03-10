import { clsx } from 'clsx';
import { usePickedColor } from '../../state/PickedColorContext';
import { palette } from './constants';

export function Palette() {
  const [pickedColor, setPickedColor] = usePickedColor();
  // Round palette, like actual paint palette?
  return (
    <div className="grid grid-cols-2 gap-2 rounded-l shadow-md p-2 bg-white print:hidden">
      {palette.map((color) => (
        <button
          key={color.base}
          className={clsx('rounded-full h-6 w-6', color.base, color.hover, color.border, {
            'border': pickedColor === color,
          })}
          onClick={() =>
            setPickedColor((prev) => (prev === color ? undefined : color))
          }
        ></button>
      ))}
    </div>
  );
}
