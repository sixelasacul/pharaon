import { z } from 'zod'
import { paletteMap } from '../../components/Palettes'
import { type Color } from '../UserSelectionContext'

export const baseSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lyrics: z.string(),
  artists: z.string(),
  name: z.string()
})
export type BaseState = z.infer<typeof baseSchema>

export const stateSchema = baseSchema.extend({
  syllablesColor: z.map(
    z.number(),
    z.object({
      base: z.string(),
      border: z.string(),
      hover: z.string(),
      name: z.string()
    })
  ),
  syllablesTempo: z.map(z.number(), z.number())
})
export type SharedState = z.infer<typeof stateSchema>

export const serializedStateSchema = baseSchema.extend({
  // transition
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  // end transition
  syllablesColor: z
    .array(z.tuple([z.number(), z.string()]))
    .transform((val) => {
      // Even though we're given a list of map entries, we can't use the Map ctor
      // directly, as we need to parse the colors first
      return val.reduce((map, [index, color]) => {
        map.set(index, paletteMap[color])
        return map
      }, new Map<number, Color>())
    })
    .default([]),
  syllablesTempo: z
    .array(z.tuple([z.number(), z.number()]))
    .transform((val) => new Map(val))
    .default([])
})
