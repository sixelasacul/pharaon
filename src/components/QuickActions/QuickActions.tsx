import * as React from 'react'
import * as ReactDOM from 'react-dom'

const QUICK_ACTIONS_ID = 'quick-actions'

export function QuickActionsContainer() {
  return (
    <div
      id={QUICK_ACTIONS_ID}
      className='flex flex-col items-end gap-2 p-4'
    ></div>
  )
}

export function QuickAction({ children }: React.PropsWithChildren) {
  const [quickActionsContainer, setquickActionsContainer] =
    React.useState<Element>()

  React.useEffect(() => {
    const quickActionsNode = document.querySelector(`#${QUICK_ACTIONS_ID}`)
    if (quickActionsContainer === undefined && quickActionsNode !== null) {
      setquickActionsContainer(quickActionsNode)
    }
  }, [quickActionsContainer])

  if (quickActionsContainer === undefined) {
    return null
  }

  return ReactDOM.createPortal(children, quickActionsContainer)
}
