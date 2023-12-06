import { EOL } from 'os'

export function runPartOne(input: string) {
  const lines = input.split(EOL)
  return lines.reduce((total, line) => total + getFirstAndLastDigit(line), 0)
}

export function getFirstAndLastDigit(line: string) {
  const digitsOnly = line.replace(/[^0-9]/g, '')
  return Number(digitsOnly[0] + digitsOnly[digitsOnly.length - 1])
}
