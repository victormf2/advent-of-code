import {
  read,
  readActualInput,
  readExampleInput,
  writeOutput,
} from '../helpers/file'
import { parseInput, run } from './runPartOne'

test('run', function () {
  const input = readActualInput()
  const output = run(input)
  writeOutput(output.toString())
})

test('parseInput', function () {
  const input = readExampleInput()
  const result = parseInput(input)
  expect(result).toEqual<typeof result>({
    instructions: ['R', 'L'],
    commands: {
      AAA: { L: 'BBB', R: 'CCC' },
      BBB: { L: 'DDD', R: 'EEE' },
      CCC: { L: 'ZZZ', R: 'GGG' },
      DDD: { L: 'DDD', R: 'DDD' },
      EEE: { L: 'EEE', R: 'EEE' },
      GGG: { L: 'GGG', R: 'GGG' },
      ZZZ: { L: 'ZZZ', R: 'ZZZ' },
    },
  })
})

test('run example', function () {
  const input = readExampleInput()
  const output = run(input)
  expect(output).toBe(2)
})

test('run example2', function () {
  const input = read('example-input-2')
  const output = run(input)
  expect(output).toBe(6)
})
