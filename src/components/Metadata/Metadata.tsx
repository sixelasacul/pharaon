import * as React from 'react'
import clsx from 'clsx';

export function DynamicTextInput({
  name,
  className,
  format = value => value
}: {
  name: string
  className?: string
  format?(value: string): string;
}) {
  const [value, setValue] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)

  if (isEditing) {
    return (
      <input
        ref={node => node?.focus()}
        type='text'
        placeholder={name}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            setIsEditing(false)
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
  return (
    <div className='grid grid-cols-1 gap-2 max-w-lg'>
      <DynamicTextInput name='Song name' />
      <DynamicTextInput
        name='Song artist(s)'
        className='text-right'
        format={artists => `- ${artists}`}
      />
    </div>
  )
}
