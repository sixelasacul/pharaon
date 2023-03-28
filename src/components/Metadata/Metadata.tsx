import * as React from 'react'
import clsx from 'clsx';
import { useSignal } from '@preact/signals-react'
import { store, updateState } from '../../state/shareableStore';

interface DynamicTextInputProps {
  name: string
  externalValue: string
  className?: string
  format?(value: string): string
  onEditDone?(value: string): void
}
export function DynamicTextInput({
  name,
  externalValue,
  className,
  format = value => value,
  onEditDone
}: DynamicTextInputProps) {
  // Could be a hook, as it is a very similar logic as in Lyrics
  // const [value, setValue] = React.useState('')
  const text = useSignal('')
  const [isEditing, setIsEditing] = React.useState(false)

  function startEditing() {
    // setValue(externalValue)
    text.value = externalValue
    setIsEditing(true)
  }
  function doneEditing() {
    setIsEditing(false)
    // onEditDone?.(value)
    onEditDone?.(text.value)
  }

  if (isEditing) {
    return (
      <input
        ref={node => node?.focus()}
        type='text'
        className={clsx('bg-transparent placeholder:oblique w-full', className)}
        placeholder={name}
        // value={value}
        value={text.value}
        // onChange={e => setValue(e.target.value)}
        onChange={e => text.value = e.target.value}
        onBlur={doneEditing}
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            doneEditing()
          } else if(e.key === 'Escape') {
            setIsEditing(false)
          }
        }} />
    )
  }
  return (
    <p
      role='button'
      tabIndex={0}
      className={clsx({ 'oblique opacity-75': !externalValue }, className)}
      onFocus={startEditing}
    >
      {externalValue ? format(externalValue) : name}
    </p>
  )
}

export function SongMetadata() {
  const name = store.value.name
  const artists = store.value.artists
  
  return (
    <div className='grid grid-cols-1 gap-2 max-w-xs w-full'>
      <DynamicTextInput
        name='Nom du son'
        externalValue={name}
        onEditDone={(updatedName) => updateState({ name: updatedName })}
      />
      <DynamicTextInput
        name='Artiste(s)'
        className='text-right'
        externalValue={artists}
        format={artists => `- ${artists}`}
        onEditDone={(updatedArtists) => updateState({ artists: updatedArtists })}
      />
    </div>
  )
}
