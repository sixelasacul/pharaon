import * as React from 'react'
import clsx from 'clsx';
import { useShareableStoreAction } from '../../state/shareableStore';

interface DynamicTextInputProps {
  name: string
  className?: string
  format?(value: string): string
  onEditDone?(value: string): void
}
export function DynamicTextInput({
  name,
  className,
  format = value => value,
  onEditDone
}: DynamicTextInputProps) {
  const [value, setValue] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)

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
          }
        }} />
    )
  }
  return (
    <p
      role='button'
      tabIndex={0}
      className={clsx({ 'italic': !value }, className)}
      onFocus={() => setIsEditing(true)}
    >
      {value ? format(value) : name}
    </p>
  )
}

export function SongMetadata() {
  const { updateState } = useShareableStoreAction()
  return (
    <div className='grid grid-cols-1 gap-2 max-w-lg'>
      <DynamicTextInput
        name='Song name'
        onEditDone={(name) => updateState({ name })}
      />
      <DynamicTextInput
        name='Song artist(s)'
        className='text-right'
        format={artists => `- ${artists}`}
        onEditDone={(artists) => updateState({ artists })}
      />
    </div>
  )
}
