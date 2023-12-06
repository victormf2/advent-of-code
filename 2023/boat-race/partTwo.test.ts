import { readFile } from 'fs/promises'
import { parseInput, runPartTwo } from './partTwo'
import path = require('path')

test('parseInput', async function () {
  const input = await readFile(path.join(__dirname, 'partone-example'), {
    encoding: 'utf-8',
  })
  const result = parseInput(input)
  expect(result).toEqual<typeof result>([
    { recordDistance: 940200, totalTime: 71530 },
  ])
})

test('runPartTwo', async function () {
  const input = await readFile(path.join(__dirname, 'partone-example'), {
    encoding: 'utf-8',
  })

  const result = runPartTwo(input)
  expect(result).toEqual(71503)
})
