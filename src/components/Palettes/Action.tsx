import { clsx } from 'clsx'
import * as React from 'react'

interface ActionProps {
  selected: boolean
  onSelect(): void
}

export function Action({
  selected,
  children,
  onSelect
}: React.PropsWithChildren<ActionProps>) {
  return (
    <button
      className={clsx(
        'flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-100',
        {
          'bg-slate-100': selected
        }
      )}
      onClick={onSelect}
    >
      {children}
    </button>
  )
}
