export function transpose<T>(map: T[][]): T[][] {
  const newMap = map[0].map((_, colIndex) => map.map((row) => row[colIndex]))
  return newMap
}
