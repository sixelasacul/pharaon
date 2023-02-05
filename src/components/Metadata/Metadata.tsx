import * as React from 'react'
import clsx from 'clsx';
import { useShareableStore, useShareableStoreAction } from '../../state/shareableStore';

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
  const [value, setValue] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)

  function startEditing() {
    setValue(externalValue)
    setIsEditing(true)
  }
  function doneEditing() {
    setIsEditing(false)
    onEditDone?.(value)
  }

  if (isEditing) {
    return (
      <input
        ref={node => node?.focus()}
        type='text'
        placeholder={name}
        value={value}
        onChange={e => setValue(e.target.value)}
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
  const { updateState } = useShareableStoreAction()
  const name = useShareableStore((state) => state.name)
  const artists = useShareableStore((state) => state.artists)
  
  return (
    <div className='grid grid-cols-1 gap-2 max-w-lg'>
      <DynamicTextInput
        name='Nom du son'
        externalValue={name}
        onEditDone={(name) => updateState({ name })}
        />
      <DynamicTextInput
        name='Artiste(s)'
        className='text-right'
        externalValue={artists}
        format={artists => `- ${artists}`}
        onEditDone={(artists) => updateState({ artists })}
      />
    </div>
  )
}
