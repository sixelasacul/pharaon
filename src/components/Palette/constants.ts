import { type Color } from '../../state/PickedColorContext'

type ColorMap = Record<string, Color>

export const noColor: Color = {
  name: 'none',
  base: '',
  hover: 'hover:bg-black/10',
  border: ''
}

export const palette: Color[] = [
  {
    name: 'red',
    base: 'bg-red-300',
    hover: 'hover:bg-red-400',
    border: 'border-red-400'
  },
  {
    name: 'amber',
    base: 'bg-amber-300',
    hover: 'hover:bg-amber-400',
    border: 'border-amber-400'
  },
  {
    name: 'lime',
    base: 'bg-lime-300',
    hover: 'hover:bg-lime-400',
    border: 'border-lime-400'
  },
  {
    name: 'emerald',
    base: 'bg-emerald-300',
    hover: 'hover:bg-emerald-400',
    border: 'border-emerald-400'
  },
  {
    name: 'cyan',
    base: 'bg-cyan-300',
    hover: 'hover:bg-cyan-400',
    border: 'border-cyan-400'
  },
  {
    name: 'blue',
    base: 'bg-blue-300',
    hover: 'hover:bg-blue-400',
    border: 'border-blue-400'
  },
  {
    name: 'violet',
    base: 'bg-violet-300',
    hover: 'hover:bg-violet-400',
    border: 'border-violet-400'
  },
  {
    name: 'fuschia',
    base: 'bg-fuchsia-300',
    hover: 'hover:bg-fuchsia-400',
    border: 'border-fuchsia-400'
  }
]

export function shortenNameColor(color: Color) {
  return `${color.name.at(0)}${color.name.at(-1)}`
}

export const paletteMap = palette.reduce<ColorMap>((acc, color) => {
  acc[color.name] = color
  acc[shortenNameColor(color)] = color
  return acc
}, {})
