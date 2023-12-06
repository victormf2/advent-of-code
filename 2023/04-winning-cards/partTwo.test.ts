import { readFileSync } from 'fs'
import { parseInput, runPartTwo } from './partTwo'
import path = require('path')

const input = readFileSync(path.join(__dirname, 'example-input'), {
  encoding: 'utf-8',
})

test('parseInput', function () {
  const result = parseInput(input)
  expect(result).toEqual<typeof result>([
    { matchingNumbers: 4, copies: 1 },
    { matchingNumbers: 2, copies: 1 },
    { matchingNumbers: 2, copies: 1 },
    { matchingNumbers: 1, copies: 1 },
    { matchingNumbers: 0, copies: 1 },
    { matchingNumbers: 0, copies: 1 },
  ])
})

test('runPartTwo', function () {
  const result = runPartTwo(input)
  expect(result).toEqual(30)
})
