import { EOL } from 'os'
import { append, read, write } from '../helpers/file'

function generate(numbers: number[]) {
  if (numbers.every((n) => n === 0)) {
    return [numbers]
  }
  const differences = [] as number[]
  for (let i = 1; i < numbers.length; i++) {
    const difference = numbers[i] - numbers[i - 1]
    differences.push(difference)
  }
  return [numbers, ...generate(differences)]
}

function extrapolate(generatedNumbers: number[][]) {
  const reversed = generatedNumbers.slice().reverse()
  const extrapolated: number[] = []
  for (let i = 1; i < reversed.length; i++) {
    const lastOne = reversed[i][reversed[i].length - 1]
    const lastTwo = reversed[i - 1][reversed[i - 1].length - 1]
    extrapolated.push(lastOne + lastTwo)
    reversed[i].push(lastOne + lastTwo)
  }
  return extrapolated
}

test('generate something', function () {
  const line =
    '2 -2 -2 7 44 166 512 1375 3320 7387 15464 31029 60732 117883 230123 455904 918822 1876972 3859134 7925415 16154444'
  const numbers = line.split(' ').map(Number)
  const generated = generate(numbers)
  const extrapolated = extrapolate(generated)

  append('output', extrapolated.join('\n'))
})

function partOne(inputFile: string) {
  const input = read(inputFile)
  const result = input
    .split(EOL)
    .map((line) => {
      const numbers = line.split(' ').map(Number)
      const generated = generate(numbers)
      const extrapolated = extrapolate(generated)
      return extrapolated.pop()
    })
    .reduce((t, n) => t + n, 0)
  return result
}

test('example line', function () {
  const line = '10 13 16 21 30 45'
  const numbers = line.split(' ').map(Number)
  const generated = generate(numbers)
  const extrapolated = extrapolate(generated)
  expect(extrapolated[extrapolated.length - 1]).toBe(68)
})

test('example', function () {
  const result = partOne('example-input')
  expect(result).toBe(114)
})
test('runPartOne', function () {
  const result = partOne('input')
  write('a', result)
})

function extrapolateLeft(generatedNumbers: number[][]) {
  const reversed = generatedNumbers.slice().reverse()
  const extrapolated: number[] = []
  for (let i = 1; i < reversed.length; i++) {
    const firstUp = reversed[i][0]
    const firstBottom = reversed[i - 1][0]
    extrapolated.push(firstUp - firstBottom)
    reversed[i].unshift(firstUp - firstBottom)
  }
  return extrapolated
}

function partTwo(inputFile: string) {
  const input = read(inputFile)
  const result = input
    .split(EOL)
    .map((line) => {
      const numbers = line.split(' ').map(Number)
      const generated = generate(numbers)
      const extrapolated = extrapolateLeft(generated)
      return extrapolated.pop()
    })
    .reduce((t, n) => t + n, 0)
  return result
}
test('runPartTwo', function () {
  const result = partTwo('input')
  write('b', result)
})
