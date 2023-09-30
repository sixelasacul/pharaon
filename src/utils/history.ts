// For local entries only; For actual suggestions from other's inputs, we'll need an actual DB
// May want to use IndexedDB if quota limit is reached

import { z } from 'zod'
import { baseSchema } from '../state/shareableStore'
import { logError } from './log'

const historyEntryMapSchema = z.array(z.string())
const historyEntrySchema = baseSchema.omit({ lyrics: true }).extend({
  id: z.string(),
  urlState: z.string()
})
type HistoryEntry = z.infer<typeof historyEntrySchema>

const ENTRY_MAP = 'history'

export function getHistory(): HistoryEntry[] {
  const mapFromStorage = localStorage.getItem(ENTRY_MAP)
  try {
    const historyEntryMap = historyEntryMapSchema.parse(
      JSON.parse(mapFromStorage ?? '[]')
    )

    // @ts-expect-error need ts-reset
    return (
      historyEntryMap
        .map((entryId) => {
          const entryFromStorage = localStorage.getItem(entryId)

          try {
            return historyEntrySchema.parse(
              JSON.parse(entryFromStorage ?? '{}')
            )
          } catch (error) {
            logError(
              'Invalid history entry in Local Storage',
              entryFromStorage,
              error
            )
            return null
          }
        })
        //   total-typescript?
        .filter((entry) => entry !== null)
    )
  } catch (error) {
    logError(
      'Invalid history entry map in Local Storage',
      mapFromStorage,
      error
    )
    return []
  }
}

export function addToHistory(entry: HistoryEntry) {}

export function removeFromHistory(entry: HistoryEntry) {}
