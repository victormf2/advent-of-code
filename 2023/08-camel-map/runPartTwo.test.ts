import { read, readActualInput, writeOutput } from '../helpers/file'
import { calculateAllSteps, getPeriod, parseInput, run } from './runPartTwo'

test('run', function () {
  const input = readActualInput()
  const output = run(input)
  writeOutput(output.toString())
})

test('run example 3', function () {
  const input = read('example-input-3')
  const output = run(input)
  expect(output).toBe(6)
})

test('calculateAllSteps', function () {
  const input = read('example-input-3')
  const output = calculateAllSteps(input)
  expect(output).toBe(12)
})

test('getPeriod', function () {
  const input = readActualInput()
  const period = getPeriod('RMA', parseInput(input))
  console.log(period)
})
