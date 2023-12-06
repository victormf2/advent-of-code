import { readFileSync } from 'fs'
import { runPartTwo } from './partTwo'
import path = require('path')

const input = readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
const result = runPartTwo(input)
console.log(result)
