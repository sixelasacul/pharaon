import { z } from "zod";
import { paletteMap } from "../../components/Palette";

const baseSchema = z.object({
  lyrics: z.string(),
  artists: z.string(),
  name: z.string()
})

export const stateSchema = baseSchema.extend({
  syllablesColor: z.array(z.object({
    base: z.string(),
    border: z.string(),
    hover: z.string(),
    name: z.string()
  }).nullable())
}).optional()

export const urlStateSchema = baseSchema.extend({
  syllablesColor: z.array(z.string()).transform((val) => val.map((color) => color ? paletteMap[color] : null))
})
