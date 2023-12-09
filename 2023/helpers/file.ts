import { appendFileSync, readFileSync, writeFileSync } from 'fs'
import path = require('path')

const args = process.argv.slice(2)

export function readExampleInput() {
  return read('example-input')
}

export function readActualInput() {
  return read('input')
}

export function read(inputFile: string) {
  const currentFile = args[0]
  const inputFileFullPath = path.join(currentFile, '..', inputFile)
  const actualInput = readFileSync(inputFileFullPath, { encoding: 'utf-8' })
  return actualInput
}

export function writeOutput(output: string) {
  write('output', output)
}

export function write(outputFile: string, output: unknown) {
  const currentFile = args[0]
  const outputFileFullPath = path.join(currentFile, '..', outputFile)
  writeFileSync(
    outputFileFullPath,
    typeof output === 'string' ? output : JSON.stringify(output)
  )
}

export function append(outputFile: string, output: string) {
  const currentFile = args[0]
  const outputFileFullPath = path.join(currentFile, '..', outputFile)
  appendFileSync(outputFileFullPath, output)
}
