import { EOL } from 'os'
import { read, write } from '../helpers/file'

type Point = { x: number; y: number; value: string }
function parseInput(input: string) {
  const map = input.split(EOL).map((line) => line.split(''))
  return map
}

function universeExpansion(map: string[][]) {
  const resultMap = transpose(expandRows(transpose(expandRows(map))))
  return resultMap
}

test('universeExpansion example input', function () {
  const input = read('example-input')
  const map = parseInput(input)
  const expandedMap = universeExpansion(map)
  const str = expandedMap.map((row) => row.join('')).join(EOL)
  const expected = read('expandend-universe-example-input')
  expect(str).toEqual(expected)
})

function expandRows(map: string[][]): string[][] {
  const expandedMap: string[][] = []
  for (const row of map) {
    if (row.every((point) => point === '.')) {
      expandedMap.push(row)
    }
    expandedMap.push(row)
  }
  return expandedMap
}

function transpose<T>(map: T[][]): T[][] {
  const newMap = map[0].map((_, colIndex) => map.map((row) => row[colIndex]))
  return newMap
}

test('transpose', function () {
  const map = [
    [0, 1, 2, 3],
    [10, 11, 12, 13],
    [20, 21, 22, 23],
  ]
  const result = transpose(map)
  expect(result).toEqual([
    [0, 10, 20],
    [1, 11, 21],
    [2, 12, 22],
    [3, 13, 23],
  ])
})
test('double transpose', function () {
  const map = [
    [0, 1, 2, 3],
    [10, 11, 12, 13],
    [20, 21, 22, 23],
  ]
  const result = transpose(transpose(map))
  expect(result).toEqual(map)
})

function findGalaxies(map: string[][]) {
  const galaxies: Point[] = []
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '#') {
        galaxies.push({ y, x, value: map[y][x] })
      }
    }
  }
  return galaxies
}

function findManhatanDistances(galaxies: Point[]) {
  const distances: number[] = []
  for (let i = 0; i < galaxies.length; i++) {
    const galaxyA = galaxies[i]
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxyB = galaxies[j]
      distances.push(
        Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y)
      )
    }
  }
  return distances
}

function partOne(inputFile: string) {
  const input = read(inputFile)
  const map = parseInput(input)
  const expandedMap = universeExpansion(map)
  const galaxies = findGalaxies(expandedMap)
  const distances = findManhatanDistances(galaxies)

  return distances.reduce((t, d) => d + t, 0)
}

test('partOne example input', function () {
  const result = partOne('example-input')
  expect(result).toBe(374)
})

test('partOne real', function () {
  const result = partOne('input')
  write('ouput', result)
})

function findEmptyRows(map: string[][]) {
  const emptyRows: number[] = []
  for (let x = 0; x < map.length; x++) {
    const row = map[x]
    if (row.every((point) => point === '.')) {
      emptyRows.push(x)
    }
  }
  return emptyRows
}

function findEmptyColumns(map: string[][]) {
  return findEmptyRows(transpose(map))
}

function findSuperManhatanDistances(
  galaxies: Point[],
  emptyRows: number[],
  emptyColumns: number[],
  expansionFactor: number
) {
  const distances: number[] = []
  for (let i = 0; i < galaxies.length; i++) {
    const galaxyA = galaxies[i]
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxyB = galaxies[j]

      const leftX = Math.min(galaxyA.x, galaxyB.x)
      const rightX = Math.max(galaxyA.x, galaxyB.x)
      const topY = Math.min(galaxyA.y, galaxyB.y)
      const bottomY = Math.max(galaxyA.y, galaxyB.y)

      const emptyColumnsBetweenPoints = emptyColumns.filter(
        (x) => x > leftX && x < rightX
      ).length

      const emptyRowsBetweenPoints = emptyRows.filter(
        (y) => y > topY && y < bottomY
      ).length

      const xDistance =
        rightX - leftX + emptyColumnsBetweenPoints * (expansionFactor - 1)

      const yDistance =
        bottomY - topY + emptyRowsBetweenPoints * (expansionFactor - 1)

      distances.push(xDistance + yDistance)
    }
  }
  return distances
}

function partTwo(inputFile: string, expansionFactor: number) {
  const input = read(inputFile)
  const map = parseInput(input)
  const galaxies = findGalaxies(map)
  const emptyRows = findEmptyRows(map)
  const emptyColumns = findEmptyColumns(map)
  const distances = findSuperManhatanDistances(
    galaxies,
    emptyRows,
    emptyColumns,
    expansionFactor
  )

  return distances.reduce((t, d) => d + t, 0)
}

test('partTwo example', function () {
  const result = partTwo('example-input', 10)
  expect(result).toBe(1030)
})

test('partTwo example 2', function () {
  const result = partTwo('example-input', 100)
  expect(result).toBe(8410)
})

test('partTwo real', function () {
  const result = partTwo('input', 1_000_000)
  write('output-two', result)
})
