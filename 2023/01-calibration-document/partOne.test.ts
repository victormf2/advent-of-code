import { readFileSync } from 'fs'
import { getFirstAndLastDigit, runPartOne } from './partOne'
import path = require('path')

const input = readFileSync(path.join(__dirname, 'example-input'), {
  encoding: 'utf-8',
})

test('getFirstAndLastDigit', function () {
  const result = getFirstAndLastDigit(' hkl8lk7asssssd0lllll')
  expect(result).toEqual(80)
})

test('runPartOne', function () {
  const result = runPartOne(input)
  expect(result).toEqual(142)
})
