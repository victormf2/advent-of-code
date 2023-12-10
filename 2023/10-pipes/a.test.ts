import { EOL } from 'os'
import { append, read, write } from '../helpers/file'

function parseInput(input: string) {
  return input.split(EOL).map((line) => line.split(''))
}

interface Tile {
  x: number
  y: number
  value: string
}
function findS(map: string[][]): Tile {
  const y = map.findIndex((row) => row.includes('S'))
  const x = map[y].indexOf('S')

  return { y, x, value: 'S' }
}

test('findS example', function () {
  const input = read('example-input')
  const map = parseInput(input)
  const result = findS(map)
  expect(result).toEqual({ y: 2, x: 0, value: 'S' })
})

function getLeft(tile: Tile, map: string[][]): Tile {
  const newPosition = { x: tile.x - 1, y: tile.y }
  return { ...newPosition, value: map[newPosition.y][newPosition.x] }
}
function getRight(tile: Tile, map: string[][]): Tile {
  const newPosition = { x: tile.x + 1, y: tile.y }
  return { ...newPosition, value: map[newPosition.y][newPosition.x] }
}
function getUp(tile: Tile, map: string[][]): Tile {
  const newPosition = { x: tile.x, y: tile.y - 1 }
  return { ...newPosition, value: map[newPosition.y][newPosition.x] }
}
function getDown(tile: Tile, map: string[][]): Tile {
  const newPosition = { x: tile.x, y: tile.y + 1 }
  return { ...newPosition, value: map[newPosition.y][newPosition.x] }
}

type Direction = 'up' | 'right' | 'down' | 'left'
function getNextPipe(
  currentTile: Tile,
  currentDirection: Direction,
  map: string[][]
): { tile: Tile; direction: Direction } {
  if (currentTile.value === '|') {
    if (currentDirection === 'down') {
      return { tile: getDown(currentTile, map), direction: 'down' }
    }
    if (currentDirection === 'up') {
      return { tile: getUp(currentTile, map), direction: 'up' }
    }
    throw new Error('Unexpected state')
  }
  if (currentTile.value === '-') {
    if (currentDirection === 'left') {
      return { tile: getLeft(currentTile, map), direction: 'left' }
    }
    if (currentDirection === 'right') {
      return { tile: getRight(currentTile, map), direction: 'right' }
    }
    throw new Error('Unexpected state')
  }
  if (currentTile.value === 'L') {
    if (currentDirection === 'down') {
      return { tile: getRight(currentTile, map), direction: 'right' }
    }
    if (currentDirection === 'left') {
      return { tile: getUp(currentTile, map), direction: 'up' }
    }
    throw new Error('Unexpected state')
  }
  if (currentTile.value === 'J') {
    if (currentDirection === 'down') {
      return { tile: getLeft(currentTile, map), direction: 'left' }
    }
    if (currentDirection === 'right') {
      return { tile: getUp(currentTile, map), direction: 'up' }
    }
    throw new Error('Unexpected state')
  }
  if (currentTile.value === '7') {
    if (currentDirection === 'right') {
      return { tile: getDown(currentTile, map), direction: 'down' }
    }
    if (currentDirection === 'up') {
      return { tile: getLeft(currentTile, map), direction: 'left' }
    }
    throw new Error('Unexpected state')
  }
  if (currentTile.value === 'F') {
    if (currentDirection === 'left') {
      return { tile: getDown(currentTile, map), direction: 'down' }
    }
    if (currentDirection === 'up') {
      return { tile: getRight(currentTile, map), direction: 'right' }
    }
    throw new Error('Unexpected state')
  }
  throw new Error('Invalid tile')
}

function getStartPipe(
  STile: Tile,
  map: string[][]
): { tile: Tile; direction: Direction } {
  const rowLength = map[0].length
  if (STile.y > 0) {
    const up = getUp(STile, map)
    if (up.value === '|' || up.value === 'F' || up.value === '7') {
      return { tile: up, direction: 'up' }
    }
  }
  if (STile.x < rowLength - 1) {
    const right = getRight(STile, map)
    if (right.value === '-' || right.value === '7' || right.value === 'J') {
      return { tile: right, direction: 'right' }
    }
  }
  if (STile.y < map.length - 1) {
    const down = getDown(STile, map)
    if (down.value === '|' || down.value === 'J' || down.value === 'L') {
      return { tile: down, direction: 'down' }
    }
  }
  if (STile.x > 0) {
    const left = getLeft(STile, map)
    if (left.value === '-' || left.value === 'L' || left.value === 'F') {
      return { tile: left, direction: 'left' }
    }
  }
  throw new Error('Invalid starting position')
}

function partOne(inputFile: string) {
  const input = read(inputFile)
  const map = parseInput(input)
  const S = findS(map)
  let current = getStartPipe(S, map)
  let steps = 1
  while (!(current.tile.x === S.x && current.tile.y === S.y)) {
    current = getNextPipe(current.tile, current.direction, map)
    steps++
  }
  return steps / 2
}

test('partOne example', function () {
  const result = partOne('example-input')
  expect(result).toBe(8)
})

test('partOne real', function () {
  const result = partOne('input')
  write('output', result)
})

// R = red
// G = green
// P = pipe
// null = unknown
const boxDrawingMap = {
  '-': '─',
  '|': '|',
  L: '└',
  F: '┌',
  J: '┘',
  '7': '┐',
  S: 'O',
}
function isPipe(char: string): char is Pipe {
  return Object.keys(boxDrawingMap).includes(char)
}
type Pipe = keyof typeof boxDrawingMap
type Color = 'R' | 'G' | Pipe | null

function paint(
  source: Tile,
  greenPaintDirection: Direction,
  colorMap: Color[][]
) {
  colorMap[source.y][source.x] = source.value as Pipe
  if (greenPaintDirection === 'down') {
    paintDown(source, 'G', colorMap)
    paintUp(source, 'R', colorMap)
  } else if (greenPaintDirection === 'up') {
    paintUp(source, 'G', colorMap)
    paintDown(source, 'R', colorMap)
  } else if (greenPaintDirection === 'left') {
    paintLeft(source, 'G', colorMap)
    paintRight(source, 'R', colorMap)
  } else if (greenPaintDirection === 'right') {
    paintRight(source, 'G', colorMap)
    paintLeft(source, 'R', colorMap)
  }
}

function paintDown(source: Tile, color: Color, colorMap: Color[][]) {
  let nextY = source.y + 1
  if (nextY >= colorMap.length) {
    return
  }
  let nextColorToReplace = colorMap[nextY][source.x] as Color
  while (!isPipe(nextColorToReplace)) {
    colorMap[nextY][source.x] = color
    nextY++
    if (nextY >= colorMap.length) {
      break
    }
    nextColorToReplace = colorMap[nextY][source.x]
  }
}
function paintUp(source: Tile, color: Color, colorMap: Color[][]) {
  let nextY = source.y - 1
  if (nextY < 0) {
    return
  }
  let nextColorToReplace = colorMap[nextY][source.x] as Color
  while (!isPipe(nextColorToReplace)) {
    colorMap[nextY][source.x] = color
    nextY--
    if (nextY < 0) {
      break
    }
    nextColorToReplace = colorMap[nextY][source.x]
  }
}
function paintLeft(source: Tile, color: Color, colorMap: Color[][]) {
  let nextX = source.x - 1
  if (nextX < 0) {
    return
  }
  let nextColorToReplace = colorMap[source.y][nextX] as Color
  while (!isPipe(nextColorToReplace)) {
    colorMap[source.y][nextX] = color
    nextX--
    if (nextX < 0) {
      break
    }
    nextColorToReplace = colorMap[source.y][nextX]
  }
}
function paintRight(source: Tile, color: Color, colorMap: Color[][]) {
  let nextX = source.x + 1
  const rowLength = colorMap[0].length
  if (nextX >= rowLength) {
    return
  }
  let nextColorToReplace = colorMap[source.y][nextX] as Color
  while (!isPipe(nextColorToReplace)) {
    colorMap[source.y][nextX] = color
    nextX++
    if (nextX >= rowLength) {
      break
    }
    nextColorToReplace = colorMap[source.y][nextX]
  }
}
function getColorMap(inputFile: string) {
  const input = read(inputFile)
  const map = parseInput(input)
  const colorMap = map.map((row) => row.map(() => null as Color))
  const S = findS(map)
  let current = getStartPipe(S, map)
  let greenPaintDirection = (
    current.direction === 'down' || current.direction === 'up' ? 'left' : 'down'
  ) as Direction

  colorMap[S.y][S.x] = 'S'

  write('color-maplog', colorMapStr(colorMap))

  while (!equalsTile(current.tile, S)) {
    paint(current.tile, greenPaintDirection, colorMap)

    append('color-maplog', EOL + EOL + colorMapStr(colorMap))
    const nextTile = getNextPipe(current.tile, current.direction, map)

    const nextGreenPaintDirection = getNextGreenPaintDirection(
      current.direction,
      nextTile,
      greenPaintDirection
    )
    if (nextGreenPaintDirection !== greenPaintDirection) {
      paint(current.tile, nextGreenPaintDirection, colorMap)
    }

    current = nextTile
    greenPaintDirection = nextGreenPaintDirection
  }

  return colorMap
}

function equalsTile(a: Tile, b: Tile) {
  return a.x === b.x && a.y === b.y
}

function getNextGreenPaintDirection(
  previousDirection: string,
  current: { tile: Tile; direction: Direction },
  greenPaintDirection: Direction
) {
  if (previousDirection === current.direction) {
    return greenPaintDirection
  }

  if (previousDirection === 'right') {
    if (current.direction === 'up') {
      if (greenPaintDirection === 'down') {
        return 'right'
      } else {
        return 'left'
      }
    }
    if (current.direction === 'down') {
      if (greenPaintDirection === 'down') {
        return 'left'
      } else {
        return 'right'
      }
    }
  }
  if (previousDirection === 'left') {
    if (current.direction === 'up') {
      if (greenPaintDirection === 'down') {
        return 'left'
      } else {
        return 'right'
      }
    }
    if (current.direction === 'down') {
      if (greenPaintDirection === 'down') {
        return 'right'
      } else {
        return 'left'
      }
    }
  }
  if (previousDirection === 'up') {
    if (current.direction === 'left') {
      if (greenPaintDirection === 'right') {
        return 'up'
      } else {
        return 'down'
      }
    }
    if (current.direction === 'right') {
      if (greenPaintDirection === 'right') {
        return 'down'
      } else {
        return 'up'
      }
    }
  }
  if (previousDirection === 'down') {
    if (current.direction === 'left') {
      if (greenPaintDirection === 'right') {
        return 'down'
      } else {
        return 'up'
      }
    }
    if (current.direction === 'right') {
      if (greenPaintDirection === 'right') {
        return 'up'
      } else {
        return 'down'
      }
    }
  }
}

function colorMapStr(colorMap: Color[][]) {
  return colorMap
    .map((row) =>
      row
        .map((color) => {
          if (color === null) {
            return ' '
          }
          if (boxDrawingMap[color]) {
            return boxDrawingMap[color]
          }
          return color
        })
        .join('')
    )
    .join(EOL)
}

test('getColorMap', function () {
  const colorMap = getColorMap('color-map-input')
  write('output-color-map', colorMapStr(colorMap))
})

test('partTwo', function () {
  const colorMap = getColorMap('input')
  const greenCount = colorMap.reduce(
    (t, row) => t + row.reduce((tt, color) => tt + (color === 'G' ? 1 : 0), 0),
    0
  )
  const redCount = colorMap.reduce(
    (t, row) => t + row.reduce((tt, color) => tt + (color === 'R' ? 1 : 0), 0),
    0
  )
  write(
    'output-two',
    colorMapStr(colorMap) +
      `${EOL}${EOL}Green: ${greenCount}${EOL}Red: ${redCount}`
  )
})
