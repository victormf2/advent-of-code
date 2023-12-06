import { readFileSync } from 'fs'
import { getPoints, parseInput, runPartOne } from './partOne'
import path = require('path')

const input = readFileSync(path.join(__dirname, 'example-input'), {
  encoding: 'utf-8',
})

test('parseInput', function () {
  const result = parseInput(input)
  expect(result).toEqual<typeof result>([
    {
      winningNumbers: [41, 48, 83, 86, 17],
      myNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
    },
    {
      winningNumbers: [13, 32, 20, 16, 61],
      myNumbers: [61, 30, 68, 82, 17, 32, 24, 19],
    },
    {
      winningNumbers: [1, 21, 53, 59, 44],
      myNumbers: [69, 82, 63, 72, 16, 21, 14, 1],
    },
    {
      winningNumbers: [41, 92, 73, 84, 69],
      myNumbers: [59, 84, 76, 51, 58, 5, 54, 83],
    },
    {
      winningNumbers: [87, 83, 26, 28, 32],
      myNumbers: [88, 30, 70, 12, 93, 22, 82, 36],
    },
    {
      winningNumbers: [31, 18, 13, 56, 72],
      myNumbers: [74, 77, 10, 23, 35, 67, 36, 11],
    },
  ])
})

test('getPoints', function () {
  const result = getPoints({
    winningNumbers: [41, 48, 83, 86, 17],
    myNumbers: [83, 86, 6, 31, 17, 9, 48, 53],
  })
  expect(result).toEqual(8)
})

test('runPartOne', function () {
  const result = runPartOne(input)
  expect(result).toEqual(13)
})
