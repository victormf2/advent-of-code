import { readFileSync } from 'fs'
import { getFirstAndLastDigit, match, runPartTwo, searchTree } from './partTwo'
import path = require('path')

const input = readFileSync(path.join(__dirname, 'example-input-2'), {
  encoding: 'utf-8',
})
describe('match', function () {
  test('find 1', function () {
    const result = match('_1', 1, searchTree)
    expect(result).toEqual<typeof result>({ next: 2, value: 1 })
  })
  test('find one', function () {
    const result = match('_one', 1, searchTree)
    expect(result).toEqual<typeof result>({ next: 4, value: 1 })
  })
  test('find eight', function () {
    const result = match('_eight', 1, searchTree)
    expect(result).toEqual<typeof result>({ next: 6, value: 8 })
  })
})

describe('getFirstAndLastDigit', function () {
  test('test 1', function () {
    const result = getFirstAndLastDigit('_onthree12kbone9__')
    expect(result).toEqual(39)
  })
  test('test 2', function () {
    const result = getFirstAndLastDigit('72ninelgfqnczgd92qlzqhghrstxvgnbgvp')
    expect(result).toEqual(72)
  })
  test('test 3', function () {
    const result = getFirstAndLastDigit('onine')
    expect(result).toEqual(99)
  })
  test('test 4', function () {
    const result = getFirstAndLastDigit('oneight')
    expect(result).toEqual(18)
  })
})

test('runPartTwo', function () {
  const result = runPartTwo(input)
  expect(result).toEqual(281)
})
