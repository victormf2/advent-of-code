import { EOL } from 'os'
import { read, write } from '../helpers/file'

function parseInput(input: string) {
  return input.split(EOL).map((line, index) => {
    const gameId = index + 1

    const data = line.substring(line.indexOf(':') + 2)
    const rounds = data.split('; ').map((roundData) => {
      const takeOffs: Record<string, number> = Object.assign(
        {},
        ...roundData.split(', ').map((takeoffData) => {
          const [n, color] = takeoffData.split(' ')
          return { [color]: Number(n) }
        })
      )
      return takeOffs
    })

    return { gameId, rounds }
  })
}

test('parseInput example', function () {
  const result = parseInput(read('example-input'))
  expect(result).toEqual<typeof result>([
    {
      gameId: 1,
      rounds: [
        { blue: 3, red: 4 },
        { red: 1, green: 2, blue: 6 },
        { green: 2 },
      ],
    },
    {
      gameId: 2,
      rounds: [
        { blue: 1, green: 2 },
        { green: 3, blue: 4, red: 1 },
        { green: 1, blue: 1 },
      ],
    },
    {
      gameId: 3,
      rounds: [
        { green: 8, blue: 6, red: 20 },
        { blue: 5, red: 4, green: 13 },
        { green: 5, red: 1 },
      ],
    },
    {
      gameId: 4,
      rounds: [
        { green: 1, red: 3, blue: 6 },
        { green: 3, red: 6 },
        { green: 3, blue: 15, red: 14 },
      ],
    },
    {
      gameId: 5,
      rounds: [
        { red: 6, blue: 1, green: 3 },
        { blue: 2, red: 1, green: 2 },
      ],
    },
  ])
})

function partOne(inputFile: string) {
  const input = read(inputFile)
  const parsed = parseInput(input)

  const validGames = parsed.filter((game) => {
    const containInvalidTakeOff = game.rounds.some((takeOffs) => {
      return (
        (typeof takeOffs.green === 'number' && takeOffs.green > 13) ||
        (typeof takeOffs.red === 'number' && takeOffs.red > 12) ||
        (typeof takeOffs.blue === 'number' && takeOffs.blue > 14)
      )
    })
    return !containInvalidTakeOff
  })

  return validGames.reduce((t, { gameId }) => t + gameId, 0)
}

test('partOne example', function () {
  const result = partOne('example-input')
  expect(result).toBe(8)
})

test('partOne', function () {
  const result = partOne('input')
  write('output', result)
})

function getMinimumForEachGame(input: string) {
  const parsed = parseInput(input)

  return parsed.map(({ gameId, rounds }) => {
    let green = 0
    let blue = 0
    let red = 0
    for (const takeOffs of rounds) {
      if (typeof takeOffs.green === 'number' && takeOffs.green > green) {
        green = takeOffs.green
      }
      if (typeof takeOffs.red === 'number' && takeOffs.red > red) {
        red = takeOffs.red
      }
      if (typeof takeOffs.blue === 'number' && takeOffs.blue > blue) {
        blue = takeOffs.blue
      }
    }
    return { gameId, green, blue, red }
  })
}

function partTwo(inputFile: string) {
  const input = read(inputFile)
  const minima = getMinimumForEachGame(input)

  return minima.reduce((t, item) => t + item.blue * item.green * item.red, 0)
}

test('partTwo example', function () {
  const result = partTwo('example-input')
  expect(result).toBe(2286)
})

test('partTwo real', function () {
  const result = partTwo('input')
  write('output-two', result)
})
