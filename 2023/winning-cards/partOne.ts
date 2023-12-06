import { EOL } from 'os'

export function runPartOne(input: string) {
  const cards = parseInput(input)
  return cards.reduce((total, card) => total + getPoints(card), 0)
}

export function parseInput(input: string) {
  const lines = input.split(EOL)
  return lines.map(parseLine)
}
type Card = ReturnType<typeof parseLine>
function parseLine(line: string) {
  const start = line.indexOf(':') + 1
  const data = line.substring(start)
  const [winningNumbersData, myNumbersData] = data.split('|')
  return {
    winningNumbers: parseNumbers(winningNumbersData),
    myNumbers: parseNumbers(myNumbersData),
  }
}
function parseNumbers(data: string) {
  return data.trim().split(/\s+/).map(Number)
}

export function getPoints({ winningNumbers, myNumbers }: Card) {
  const foundWinningNumbers = myNumbers.filter((n) =>
    winningNumbers.includes(n)
  ).length

  if (foundWinningNumbers === 0) {
    return 0
  }
  return 1 << (foundWinningNumbers - 1)
}
