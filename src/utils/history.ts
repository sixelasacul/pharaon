// For local entries only; For actual suggestions from other's inputs, we'll need an actual DB
// May want to use IndexedDB if quota limit is reached

import { z } from 'zod'
import { stateSchema } from '../state/shareableStore'
import { logError } from './log'

const historyEntryMapSchema = z.array(z.string())
const historyEntrySchema = stateSchema

type HistoryMap = z.infer<typeof historyEntryMapSchema>
type HistoryEntry = z.infer<typeof historyEntrySchema>

const ENTRY_MAP = 'history'
const HISTORY_MAX_SIZE = 5

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

export function getHistory(): HistoryEntry[] {
  return getHistoryMap()
    .map((entryId) => {
      const entryFromStorage = localStorage.getItem(entryId)

      try {
        return historyEntrySchema.parse(JSON.parse(entryFromStorage ?? '{}'))
      } catch (error) {
        logError(
          'Invalid history entry in Local Storage',
          entryFromStorage,
          error
        )
        return null
      }
    })
    .filter(Boolean)
}

export function updateHistory(entry: HistoryEntry) {
  const historyMap = getHistoryMap()

  // Check the presence to add it or just update it
  if (historyMap.find((id) => id === entry.id) === undefined) {
    // We want a small history so we remove old ones
    if (historyMap.length > HISTORY_MAX_SIZE) {
      const lastId = historyMap.pop()
      if (lastId !== undefined) {
        localStorage.removeItem(lastId)
      }
    }
    historyMap.unshift(entry.id)
    localStorage.setItem(ENTRY_MAP, JSON.stringify(historyMap))
  }
  localStorage.setItem(entry.id, JSON.stringify(entry))
}

// May be needed if a user wants to clear their history
export function removeFromHistory(entry: HistoryEntry) {
  const historyMap = getHistoryMap()

  const newHistoryMap = historyMap.filter((id) => id !== entry.id)
  localStorage.setItem(ENTRY_MAP, JSON.stringify(newHistoryMap))
}
