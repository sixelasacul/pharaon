import { z } from "zod";
import { paletteMap } from "../../components/Palette";
import { Color } from "../PickedColorContext";

const baseSchema = z.object({
  lyrics: z.string(),
  artists: z.string(),
  name: z.string()
})

export const stateSchema = baseSchema.extend({
  syllablesColor: z.map(
    z.number(),
    z.object({
      base: z.string(),
      border: z.string(),
      hover: z.string(),
      name: z.string()
    })
  )
})
export type SharedState = z.infer<typeof stateSchema>

export const urlStateSchema = baseSchema.extend({
  syllablesColor: z.array(z.tuple([z.number(), z.string()])).transform((val) => {
    // Even though we're given a list of map entries, we can't use the Map ctor
    // directly, as we need to parse the colors first
    return val.reduce((map, [index, color]) => {
      map.set(index, paletteMap[color])
      return map
    }, new Map<number, Color>())
  })
})
