export function getRandomIntInclusive(min: number, max: number) {
  const intMin = Math.ceil(min)
  const intMax = Math.floor(max)
  return Math.floor(Math.random() * (intMax - intMin + 1) + intMin)
}

export function getUniqueRandomIntListInclusive(min: number, max: number, count: number) {
  const uniques = new Set<number>()
  while(uniques.size < count) {
    uniques.add(getRandomIntInclusive(min, max))
  }
  return [...uniques.values()]
}
