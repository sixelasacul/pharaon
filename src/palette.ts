export interface Color {
  base: string;
  hover: string;
  border: string;
}

export const palette: Color[] = [
  { base: 'bg-red-300', hover: 'hover:bg-red-400', border: 'border-red-400' },
  {
    base: 'bg-amber-200',
    hover: 'hover:bg-amber-400',
    border: 'border-amber-400',
  },
  {
    base: 'bg-lime-300',
    hover: 'hover:bg-lime-400',
    border: 'border-lime-400',
  },
  {
    base: 'bg-emerald-300',
    hover: 'hover:bg-emerald-400',
    border: 'border-emerald-400',
  },
  {
    base: 'bg-cyan-300',
    hover: 'hover:bg-cyan-400',
    border: 'border-cyan-400',
  },
  {
    base: 'bg-blue-300',
    hover: 'hover:bg-blue-400',
    border: 'border-blue-400',
  },
  {
    base: 'bg-violet-300',
    hover: 'hover:bg-violet-400',
    border: 'border-violet-400',
  },
  {
    base: 'bg-fuchsia-300',
    hover: 'hover:bg-fuchsia-400',
    border: 'border-fuchsia-400',
  },
];
