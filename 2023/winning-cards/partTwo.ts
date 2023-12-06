import { EOL } from 'os'

export function runPartTwo(input: string) {
  const cards = parseInput(input)
  let sum = 0
  for (let i = 0; i < cards.length; i++) {
    const currentCard = cards[i]
    sum += currentCard.copies

    const f = i + currentCard.matchingNumbers

    for (let m = i + 1; m <= f && m < cards.length; m++) {
      const copyCard = cards[m]
      copyCard.copies += currentCard.copies
    }
  }
  return sum
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

  const winningNumbers = parseNumbers(winningNumbersData)
  const myNumbers = parseNumbers(myNumbersData)

  const matchingNumbers = myNumbers.filter((n) =>
    winningNumbers.includes(n)
  ).length

  return {
    matchingNumbers,
    copies: 1,
  }
}
function parseNumbers(data: string) {
  return data.trim().split(/\s+/).map(Number)
}
