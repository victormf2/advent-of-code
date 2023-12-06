import { readFile } from 'fs/promises'
import {
  getNumberOfTimes,
  getTimesForTraveledDistance,
  parseInput,
  runPartOne,
} from './partOne'
import path = require('path')

test('getTimesForTraveledDistance', function () {
  const { timeMax, timeMin } = getTimesForTraveledDistance(9, 7)
  expect(timeMax).toEqual(5)
  expect(timeMin).toEqual(2)
})

test('parseInput', async function () {
  const input = await readFile(path.join(__dirname, 'input'), {
    encoding: 'utf-8',
  })
  const result = parseInput(input)
  expect(result).toEqual<typeof result>([
    { recordDistance: 277, totalTime: 44 },
    { recordDistance: 1136, totalTime: 89 },
    { recordDistance: 1890, totalTime: 96 },
    { recordDistance: 1768, totalTime: 91 },
  ])
})

test('getNumberOfTimes', function () {
  const result1 = getNumberOfTimes(7, 9)
  const result2 = getNumberOfTimes(15, 40)
  expect(result1).toEqual(4)
  expect(result2).toEqual(8)
})

test('partOne', async function () {
  const input = await readFile(path.join(__dirname, 'partone-example'), {
    encoding: 'utf-8',
  })
  const result = runPartOne(input)
  expect(result).toEqual(288)
})
