import { EOL } from 'os'
import { append } from '../helpers/file'

export function run(input: string) {
  const { commands, instructions } = parseInput(input)
  const next = instructionsGenerator(instructions)
  let currentLocations = Object.keys(commands).filter((command) =>
    command.endsWith('A')
  )
  let steps = 0
  let lastSeila = 0
  while (currentLocations.some((l) => !l.endsWith('Z'))) {
    if (currentLocations[0].endsWith('Z')) {
      append(
        'zeds',
        `${currentLocations.join(', ')} | ${steps - lastSeila} (${steps})\n`
      )
      lastSeila = steps
    }
    const nextInstruction = next()
    currentLocations = currentLocations.map((l) => commands[l][nextInstruction])
    steps++
  }
  return steps
}

type ParsedInput = ReturnType<typeof parseInput>
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

export function getReverseMap(input: ParsedInput) {
  const map = {}
  for (const [location, { L, R }] of Object.entries(input.commands)) {
  }
}

function add(map: any, location: string) {
  map[location]
}

export function calculateAllSteps(input: string) {
  const { commands, instructions } = parseInput(input)
  const next = instructionsGenerator(instructions)
  const startLocations = Object.keys(commands).filter((command) =>
    command.endsWith('A')
  )
  const endLocations = Object.keys(commands).filter((command) =>
    command.endsWith('Z')
  )

  const stepsMapping = {}
  for (const startLocation of startLocations) {
    const endLocationsToMatch = endLocations.slice()
    let currentLocation = startLocation
    let steps = 0
    while (endLocationsToMatch.length > 0) {
      const nextInstruction = next()
      currentLocation = commands[currentLocation][nextInstruction]

      const ix = endLocationsToMatch.indexOf(currentLocation)
      if (ix >= 0) {
        endLocationsToMatch.splice(ix, 1)
      }

      steps++
    }
    stepsMapping[startLocation] = steps
  }

  return stepsMapping
}

export function getPeriod(startLocation: string, input: ParsedInput) {
  let stoppedAt = startLocation
  let period = 0
  do {
    stoppedAt = readInstructionsUntilEnd(stoppedAt, input)
    period++
  } while (stoppedAt != startLocation)

  return period
}

export function readInstructionsUntilEnd(
  startLocation: string,
  { commands, instructions }: ParsedInput
) {
  let endLocation = startLocation
  for (const instruction of instructions) {
    endLocation = commands[endLocation][instruction]
  }
  return endLocation
}
