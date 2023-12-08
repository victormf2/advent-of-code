import { EOL } from 'os'

export function run(input: string) {
  const { commands, instructions } = parseInput(input)
  const next = instructionsGenerator(instructions)
  let currentLocation = 'AAA'
  let steps = 0
  while (currentLocation !== 'ZZZ') {
    const nextInstruction = next()
    currentLocation = commands[currentLocation][nextInstruction]
    steps++
  }
  return steps
}

export function parseInput(input: string) {
  const endOfInsructions = input.indexOf(EOL)
  const instructions = input.substring(0, endOfInsructions).split('')

  const startOfCommands = endOfInsructions + (EOL + EOL).length

  const commandLines = input.substring(startOfCommands).split(EOL)
  const commands: Record<string, { L: string; R: string }> = {}
  for (const line of commandLines) {
    if (!line.trim()) {
      continue
    }
    const [location, LRInput] = line.split(' = ')
    const [L, R] = LRInput.substring(1, LRInput.length - 1).split(', ')
    commands[location] = { L, R }
  }

  return { instructions, commands }
}

export function instructionsGenerator(instructions: string[]) {
  let i = 0

  return function next() {
    if (i === instructions.length) {
      i = 0
    }
    const p = i
    i++
    return instructions[p]
  }
}
