/**
 * d = t * (T - t)
 * d = -t^2 + t*T
 * t^2 -T*t + d = 0
 *
 * t = (T +- sqrt(T^2 - 4 * 1 * d)) / 2
 */

import { EOL } from 'os'

export function getTimesForTraveledDistance(
  distance: number,
  totalTime: number
) {
  const delta = Math.sqrt(totalTime * totalTime - 4 * distance)
  const timeMax = nextLowerInteger((totalTime + delta) / 2)
  const timeMin = nextGreaterInteger((totalTime - delta) / 2)
  return { timeMax, timeMin }
}

export function nextGreaterInteger(n: number) {
  const int = Math.ceil(n)
  if (int === n) {
    return int + 1
  }
  return int
}

export function nextLowerInteger(n: number) {
  const int = Math.floor(n)
  if (int === n) {
    return int - 1
  }
  return int
}

export function runPartTwo(input: string) {
  const table = parseInput(input)
  const numbers = table.map(({ totalTime, recordDistance }) => {
    return getNumberOfTimes(totalTime, recordDistance)
  })

  return numbers.reduce((total, current) => current * total, 1)
}

export function parseInput(input: string) {
  const [timeLine, distanceLine] = input.split(EOL)

  const [_, ...timesStr] = timeLine.split(/\s+/)
  const [__, ...distancesStr] = distanceLine.split(/\s+/)

  const totalTime = Number(timesStr.join(''))
  const recordDistance = Number(distancesStr.join(''))

  return [{ totalTime, recordDistance }]
}

export function getNumberOfTimes(totalTime: number, recordDistance: number) {
  const { timeMax, timeMin } = getTimesForTraveledDistance(
    recordDistance,
    totalTime
  )

  return timeMax - timeMin + 1
}
