export function logError(description: string, data: unknown, error: unknown) {
  if (import.meta.env.DEV) {
    console.group(description)
    console.error(data)
    console.error(error)
    console.groupEnd()
  } else {
    console.warn(description)
  }
}
