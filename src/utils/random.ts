export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getUniqueRandomIntListInclusive(min: number, max: number, count: number) {
  const uniques = new Set<number>()
  while(uniques.size < count) {
    uniques.add(getRandomIntInclusive(min, max))
  }
  return [...uniques.values()]
}
