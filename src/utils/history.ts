// For local entries only; For actual suggestions from other's inputs, we'll need an actual DB
// May want to use IndexedDB if quota limit is reached

import * as React from 'react'
import { z } from 'zod'
import {
  type SharedState,
  serializedStateSchema
} from '../state/shareableStore'
import { serializeState } from './compressor'
import { logError } from './log'

// stateSchema.transform

const historyEntryMapSchema = z.array(z.string())

type HistoryMap = z.infer<typeof historyEntryMapSchema>

const ENTRY_MAP = 'history'
const HISTORY_MAX_SIZE = 5
const HISTORY_UPDATE_EVENT = 'history-update'

function getHistoryEntryKey(id: string) {
  return `${ENTRY_MAP}/${id}`
}

function getHistoryMap(): HistoryMap {
  const mapFromStorage = localStorage.getItem(ENTRY_MAP)
  try {
    return historyEntryMapSchema.parse(JSON.parse(mapFromStorage ?? '[]'))
  } catch (error) {
    logError(
      'Invalid history entry map in Local Storage',
      mapFromStorage,
      error
    )
    return []
  }
}

export function getHistoryEntry(id: string) {
  const entryFromStorage = localStorage.getItem(getHistoryEntryKey(id))

  try {
    return serializedStateSchema.parse(JSON.parse(entryFromStorage ?? '{}'))
  } catch (error) {
    logError('Invalid history entry in Local Storage', entryFromStorage, error)
    return null
  }
}

export function getHistory() {
  return getHistoryMap()
    .map(getHistoryEntry)
    .filter(Boolean)
    .sort(
      (first, second) => second.updatedAt.getTime() - first.updatedAt.getTime()
    )
}

// Could it be worth to tweak zustand's persist middleware to rather than calling
// this manually?
export function updateHistory(entry: SharedState) {
  const historyMap = getHistoryMap()

  // Check the presence to add it or just update it
  if (historyMap.find((id) => id === entry.id) === undefined) {
    // We want a small history so we remove old ones
    if (historyMap.length >= HISTORY_MAX_SIZE) {
      const lastId = historyMap.pop()
      if (lastId !== undefined) {
        localStorage.removeItem(getHistoryEntryKey(lastId))
      }
    }
    historyMap.unshift(entry.id)
    localStorage.setItem(ENTRY_MAP, JSON.stringify(historyMap))
  }

  localStorage.setItem(getHistoryEntryKey(entry.id), serializeState(entry))
  window.dispatchEvent(new Event(HISTORY_UPDATE_EVENT))
}

export function hasEntry(id: string) {
  return localStorage.getItem(getHistoryEntryKey(id)) !== null
}

// May be needed if a user wants to clear their history
export function removeFromHistory(entry: SharedState) {
  const historyMap = getHistoryMap()

  const newHistoryMap = historyMap.filter((id) => id !== entry.id)
  localStorage.setItem(ENTRY_MAP, JSON.stringify(newHistoryMap))
}

// Would have loved to use `useSyncExternalStore`, but the way the history is
// built is incompatible with how the snapshot is supposed to behave (the hook
// is expecting the same object reference when there's no change, thus, to be
// cached). That'll be a challenge for another day.
export function useHistory() {
  const [history, setHistory] = React.useState(getHistory)

  React.useEffect(() => {
    function listener() {
      // Would probably be better for `updateHistory` to build the new history
      // and propagate it, but easier to just read it for the local storage.
      setHistory(getHistory)
    }

    window.addEventListener(HISTORY_UPDATE_EVENT, listener)

    return () => window.removeEventListener(HISTORY_UPDATE_EVENT, listener)
  }, [])

  return history
}
