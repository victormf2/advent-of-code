import { EOL } from 'os'
import { append, read, write } from '../helpers/file'

function checkFullTrace(_trace: string, spring: string) {
  for (let i = 0; i < spring.length; i++) {
    if (spring[i] === '#' || spring[i] === '.') {
      if (spring[i] !== _trace[i]) {
        throw new Error('mds')
      }
    }
  }
}
function checkPartialTrace(_trace: string, springs: string) {
  for (let i = 0; i < _trace.length; i++) {
    if (springs[i] === '#' || springs[i] === '.') {
      if (springs[i] !== _trace[i]) {
        throw new Error('mds')
      }
    }
  }
}

type FindCombinationsParams = {
  trace?: string
  springs: string
  currentSpringIndex?: number
  damagedGroupLengths: number[]
  currentDamagedGroupIndex?: number
}
function findCombinations({
  springs,
  currentSpringIndex = 0,
  damagedGroupLengths,
  currentDamagedGroupIndex = 0,
  trace = '',
}: FindCombinationsParams) {
  if (currentDamagedGroupIndex >= damagedGroupLengths.length) {
    const rest = springs.substring(currentSpringIndex)
    if (rest.includes('#')) {
      checkPartialTrace(trace + rest, springs)
      // inconsistent because there are damaged springs that were not accounted for
      return 0
    }
    const paddedTrace = trace.padEnd(springs.length, '.')
    checkFullTrace(paddedTrace, springs)
    append('trace', paddedTrace + EOL)
    return 1
  }
  if (currentSpringIndex >= springs.length) {
    checkPartialTrace(trace, springs)
    return 0
  }

  const currentDamagedGroupLength =
    damagedGroupLengths[currentDamagedGroupIndex]

  let total = 0

  for (; currentSpringIndex < springs.length; currentSpringIndex++) {
    const currentSpring = springs[currentSpringIndex]
    if (currentSpring === '.') {
      trace += '.'
      continue
    }

    const springsGroup = springs.substring(
      currentSpringIndex,
      currentSpringIndex + currentDamagedGroupLength
    )

    if (springsGroup.length < currentDamagedGroupLength) {
      checkPartialTrace(trace, springs)
      return total
    }

    const nextDotIndex = springsGroup.lastIndexOf('.')
    const containsWorkingSpring = nextDotIndex >= 0
    if (containsWorkingSpring) {
      const nextDamagedIndex = springsGroup.indexOf('#')
      if (nextDamagedIndex >= 0 && nextDamagedIndex < nextDotIndex) {
        return total
      }
      // will add one more accounting for the dot on the loop increment
      currentSpringIndex += nextDotIndex

      trace += '.'.repeat(nextDotIndex + 1)
      continue
    }

    const springAfterGroup =
      springs[currentSpringIndex + currentDamagedGroupLength]
    if (springAfterGroup === '#') {
      if (currentSpring === '#') {
        // started with # but afterwards a # is found which is inconsistent
        // example ..#??#.. 3
        checkPartialTrace(trace, springs)
        return total
      }

      trace += '.'
      continue
    }

    total += findCombinations({
      trace: trace + '#'.repeat(currentDamagedGroupLength) + '.',
      springs,
      damagedGroupLengths: damagedGroupLengths,
      currentSpringIndex: currentSpringIndex + currentDamagedGroupLength + 1,
      currentDamagedGroupIndex: currentDamagedGroupIndex + 1,
    })

    if (currentSpring === '#') {
      checkPartialTrace(trace, springs)
      return total
    }

    trace += '.'
  }

  checkPartialTrace(trace, springs)
  return total
}

describe('findCombinations', function () {
  test('example 1', function () {
    const result = findCombinations({
      springs: '???.###',
      damagedGroupLengths: [1, 1, 3],
    })
    expect(result).toBe(1)
  })
  test('example 2', function () {
    const result = findCombinations({
      springs: '.??..??...?##.',
      damagedGroupLengths: [1, 1, 3],
    })
    expect(result).toBe(4)
  })
  test('example 3', function () {
    const result = findCombinations({
      springs: '?#?#?#?#?#?#?#?',
      damagedGroupLengths: [1, 3, 1, 6],
    })
    expect(result).toBe(1)
  })
  test('example 4', function () {
    const result = findCombinations({
      springs: '.??.????.????..?',
      damagedGroupLengths: [3, 4],
    })
    expect(result).toBe(2)
  })

  test('example 5', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '????#..????????## 2,1,1,5,2'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(2)
  })
  test('example 6', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '??#????????.??.????? 1,7,1,3'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(17)
  })
  test('example 7', function () {
    const { damagedGroupLengths, springs } = parseInput('??#?????#??. 5,2')[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(5)
  })
  test('example 8', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '?????.?????????#???? 4,1,1,1,1,2'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(92)
  })
  test('example 9', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '?#?.#.??#.?#?#????? 1,1,1,9'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(1)
  })
  test('example 9', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '?.????##??.?#???. 2,3'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(2)
  })
  test('example 10', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '??.?#?.?????#?????? 2,8'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(10)
  })
  test('example 11', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '.#??..??????????#??? 3,2,6,1,2'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(1)
  })
  test('example 12', function () {
    const { damagedGroupLengths, springs } = parseInput(
      '.?.?#?#??.#??.??? 4,1,2'
    )[0]
    const result = findCombinations({
      damagedGroupLengths,
      springs,
    })
    expect(result).toBe(5)
  })
})

function parseInput(input: string) {
  return input.split(EOL).map((line) => {
    const [springs, damagedGroupsStr] = line.split(' ')
    const damagedGroupLengths = damagedGroupsStr.split(',').map(Number)

    return { springs, damagedGroupLengths }
  })
}

let currentRow = 0
function partOne(inputFile: string) {
  const input = read(inputFile)
  const rows = parseInput(input)

  let total = 0
  for (const { springs, damagedGroupLengths } of rows) {
    total += findCombinations({ springs, damagedGroupLengths })
    currentRow++
  }

  return total
}

test('partOne example', function () {
  const result = partOne('example-input')
  expect(result).toBe(21)
})

test('partOne real', function () {
  const result = partOne('input')
  write('output', result)
})
