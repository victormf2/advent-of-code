import { EOL } from 'os'
import { read, write } from '../helpers/file'

type NumberLocation = {
  index: number
  length: number
  value: number
}
function parseInput(input: string) {
  const lines = input.split(EOL)
  const lineLength = lines[0].length

  const joined = lines.join('')

  const digits = '0123456789'
  const numbers: NumberLocation[] = []
  const symbolIndices = new Set<number>()

  let charIndex = 0
  while (charIndex < joined.length) {
    let currentChar = joined[charIndex]
    if (currentChar === '.') {
      charIndex++
      continue
    }
    let numberStr = ''
    let numberIndex = charIndex
    while (digits.includes(currentChar)) {
      numberStr += currentChar
      charIndex++
      currentChar = joined[charIndex]
    }
    if (numberStr.length > 0) {
      numbers.push({
        index: numberIndex,
        length: numberStr.length,
        value: Number(numberStr),
      })
      continue
    }
    symbolIndices.add(charIndex)
    charIndex++
  }

  return {
    lineLength,
    numbers,
    symbolIndices,
  }
}

test('my test', function () {
  const result = parseInput(`.40..#931.${EOL}..@...12..`)
  expect(result).toEqual<typeof result>({
    lineLength: 10,
    symbolIndices: new Set([5, 12]),
    numbers: [
      {
        index: 1,
        length: 2,
        value: 40,
      },
      {
        index: 6,
        length: 3,
        value: 931,
      },
      {
        index: 16,
        length: 2,
        value: 12,
      },
    ],
  })
})

function getPartNumbers(input: string) {
  const { lineLength, numbers, symbolIndices } = parseInput(input)

  function fromSides({ index, length }: NumberLocation) {
    return symbolIndices.has(index + length) || symbolIndices.has(index - 1)
  }

  function fromTop({ index, length }: NumberLocation) {
    for (let i = 0; i < length + 2; i++) {
      if (symbolIndices.has(lineLength + length + index - i)) {
        return true
      }
    }
    return false
  }

  function fromBottom({ index, length }: NumberLocation) {
    for (let i = 0; i < length + 2; i++) {
      if (symbolIndices.has(index - lineLength + length - i)) {
        return true
      }
    }
    return false
  }

  const partNumbers = numbers.filter((number) => {
    return fromTop(number) || fromSides(number) || fromBottom(number)
  })

  return partNumbers
}

function partOne(input: string) {
  const partNumbers = getPartNumbers(input)
  return partNumbers.reduce((t, p) => t + p.value, 0)
}

test('part one from tops', function () {
  const inputs = [
    `481......${EOL}...#.....`,

    `.481.....${EOL}...#.....`,

    `..481....${EOL}...#.....`,

    `...481...${EOL}...#.....`,

    `....481..${EOL}...#.....`,
  ]

  const results = inputs.map((input) => partOne(input))
  expect(results).toEqual([481, 481, 481, 481, 481])
})

test('part one from bottoms', function () {
  const inputs = [
    `...#.....${EOL}481......`,

    `...#.....${EOL}.481.....`,

    `...#.....${EOL}..481....`,

    `...#.....${EOL}...481...`,

    `...#.....${EOL}....481..`,
  ]

  const results = inputs.map((input) => partOne(input))
  expect(results).toEqual([481, 481, 481, 481, 481])
})
test('part one from sides', function () {
  const inputs = [`481#.....${EOL}...#.....`, `...#481..${EOL}...#.....`]

  const results = inputs.map((input) => partOne(input))
  expect(results).toEqual([481, 481])
})

test('example parseInput', function () {
  const parsed = parseInput(read('example-input'))
  expect(parsed.symbolIndices).toBe(null)
})

test('example input partNumbers', function () {
  const input = read('example-input')
  const partNumbers = getPartNumbers(input)
  expect(partNumbers.map((p) => p.value)).toEqual([
    467, 35, 633, 617, 592, 755, 664, 598,
  ])
})

test('partOne', function () {
  const input = read('input')
  const result = partOne(input)
  write('output', result)
})

function parseInputWithGears(input: string) {
  const lines = input.split(EOL)
  const lineLength = lines[0].length

  const joined = lines.join('')

  const digits = '0123456789'
  const numbers: NumberLocation[] = []
  const gearIndices = new Set<number>()

  let charIndex = 0
  while (charIndex < joined.length) {
    let currentChar = joined[charIndex]
    let numberStr = ''
    let numberIndex = charIndex
    while (digits.includes(currentChar)) {
      numberStr += currentChar
      charIndex++
      currentChar = joined[charIndex]
    }
    if (numberStr.length > 0) {
      numbers.push({
        index: numberIndex,
        length: numberStr.length,
        value: Number(numberStr),
      })
      continue
    }
    if (currentChar === '*') {
      gearIndices.add(charIndex)
    }
    charIndex++
  }

  return {
    lineLength,
    numbers,
    gearIndices,
  }
}

test('example parseInputWithGears', function () {
  const input = read('example-input')
  const parsed = parseInputWithGears(input)
  expect(parsed.gearIndices.size).toBe(3)
})

function getGearsWithNumbers(input: string) {
  const { lineLength, numbers, gearIndices } = parseInputWithGears(input)

  function getMatchingGearIndices({ index, length }: NumberLocation) {
    const indicesToMatch = [index + length, index - 1]
    for (let i = 0; i < length + 2; i++) {
      indicesToMatch.push(lineLength + length + index - i)
    }
    for (let i = 0; i < length + 2; i++) {
      indicesToMatch.push(index - lineLength + length - i)
    }

    return indicesToMatch.filter((matchingIndex) =>
      gearIndices.has(matchingIndex)
    )
  }

  const gearsWithNumbers: Record<number, NumberLocation[]> = {}
  for (const number of numbers) {
    const matchingIndices = getMatchingGearIndices(number)
    for (const gearIndex of matchingIndices) {
      gearsWithNumbers[gearIndex] ??= []
      gearsWithNumbers[gearIndex].push(number)
    }
  }

  return gearsWithNumbers
}

test('example getGearsWithNumbers', function () {
  const input = read('example-input')
  const resul = getGearsWithNumbers(input)
  expect(resul).toEqual<typeof resul>({
    13: [
      { index: 0, length: 3, value: 467 },
      { index: 22, length: 2, value: 35 },
    ],
    43: [{ index: 40, length: 3, value: 617 }],
    85: [
      { index: 76, length: 3, value: 755 },
      { index: 95, length: 3, value: 598 },
    ],
  })
})

function partTwo(input: string) {
  const gearsWithNumbers = getGearsWithNumbers(input)
  let gearRatioSum = 0
  for (const numbers of Object.values(gearsWithNumbers)) {
    if (numbers.length !== 2) {
      continue
    }

    const gearRatio = numbers[0].value * numbers[1].value
    gearRatioSum += gearRatio
  }
  return gearRatioSum
}

test('partTwo example', function () {
  const input = read('example-input')
  const result = partTwo(input)
  expect(result).toBe(467835)
})

test('partTwo', function () {
  const input = read('input')
  const result = partTwo(input)
  write('output-two', result)
})
