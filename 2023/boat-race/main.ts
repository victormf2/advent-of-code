import { readFile } from 'fs/promises'
import { runPartTwo } from './partTwo'
import path = require('path')
;(async () => {
  const input = await readFile(path.join(__dirname, 'input'), {
    encoding: 'utf-8',
  })
  const result = runPartTwo(input)
  console.log(result)
})()
