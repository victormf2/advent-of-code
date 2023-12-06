import * as os from 'os'
const EOL = os.EOL

export function runPartTwo(input: string) {
  const parsed = parseMaps(input)
  const rangeMapGroups = [
    parsed.seedToSoilMap,
    parsed.soilToFerilizerMap,
    parsed.fertilizerToWaterMap,
    parsed.waterToLightMap,
    parsed.lightToTemperatureMap,
    parsed.temperatureToHumidityMap,
    parsed.humidityToLocationMap,
  ].map(toSortedRangeMaps)
  let lowestLocation = Number.MAX_SAFE_INTEGER
  for (const seedRange of getSeedRanges(input)) {
    const seedRangeLocation = findLowestLocationForSeedRange(
      seedRange,
      rangeMapGroups
    )
    if (seedRangeLocation < lowestLocation) {
      lowestLocation = seedRangeLocation
    }
  }
  return lowestLocation
  function parseMaps(input: string): ParsedInput {
    var next = getNextInputStart(input.indexOf(EOL))
    var { data: seedToSoilMap, next } = parseMap(input, next)
    var { data: soilToFerilizerMap, next } = parseMap(input, next)
    var { data: fertilizerToWaterMap, next } = parseMap(input, next)
    var { data: waterToLightMap, next } = parseMap(input, next)
    var { data: lightToTemperatureMap, next } = parseMap(input, next)
    var { data: temperatureToHumidityMap, next } = parseMap(input, next)
    var { data: humidityToLocationMap, next } = parseMap(input, next)
    return {
      fertilizerToWaterMap,
      humidityToLocationMap,
      lightToTemperatureMap,
      seedToSoilMap,
      soilToFerilizerMap,
      temperatureToHumidityMap,
      waterToLightMap,
    }
  }
  function getNextInputStart(end: number) {
    return end + EOL.length + EOL.length
  }
  function parseMap(input: string, inputStart: number) {
    const dataStart = input.indexOf(':', inputStart) + 1
    let dataEnd = input.indexOf(EOL + EOL, dataStart)
    if (dataEnd < 0) {
      dataEnd = input.length
    }
    const dataText = input.substring(dataStart, dataEnd).trim()
    const dataLines = dataText.split(EOL)
    const data = dataLines.map((line) => {
      const [destination, source, length] = line.split(' ').map(Number)
      return {
        destination,
        source,
        length,
      }
    })
    return { data, next: getNextInputStart(dataEnd) }
  }
}

export type ParsedInput = {
  seedToSoilMap: SourceDestinationMapRaw[]
  soilToFerilizerMap: SourceDestinationMapRaw[]
  fertilizerToWaterMap: SourceDestinationMapRaw[]
  waterToLightMap: SourceDestinationMapRaw[]
  lightToTemperatureMap: SourceDestinationMapRaw[]
  temperatureToHumidityMap: SourceDestinationMapRaw[]
  humidityToLocationMap: SourceDestinationMapRaw[]
}
export type SourceDestinationMapRaw = {
  source: number
  destination: number
  length: number
}
export type RangeMap = {
  start: number
  end: number
  offset: number
}

export type Range = {
  start: number
  end: number
}
export function toSortedRangeMaps(
  sourceDestinationMaps: SourceDestinationMapRaw[]
): RangeMap[] {
  const rangeMaps = sourceDestinationMaps.map((map) => {
    const rangeMap: RangeMap = {
      start: map.source,
      end: map.source + map.length,
      offset: map.destination - map.source,
    }
    return rangeMap
  })

  return rangeMaps.sort((a, b) => a.start - b.start)
}
export function findDestinationRanges(source: Range, rangeMaps: RangeMap[]) {
  let start = source.start
  const destinationRanges: Range[] = []
  for (const rangeMap of rangeMaps) {
    if (start < rangeMap.start) {
      destinationRanges.push({
        start: start,
        end: Math.min(rangeMap.start, source.end),
      })
      start = rangeMap.start
    }
    if (source.end <= rangeMap.start) {
      return destinationRanges
    }

    if (start < rangeMap.end) {
      const sourceStart = start
      const sourceEnd = Math.min(source.end, rangeMap.end)
      destinationRanges.push({
        start: sourceStart + rangeMap.offset,
        end: sourceEnd + rangeMap.offset,
      })
      start = rangeMap.end
    }

    if (start >= source.end) {
      return destinationRanges
    }
  }
  destinationRanges.push({
    start,
    end: source.end,
  })
  return destinationRanges
}

export function getSeedRanges(input: string): Range[] {
  const start = input.indexOf(':') + 1
  const end = input.indexOf(EOL, start)

  const seedText = input.substring(start, end).trim()
  const numbers = seedText.split(' ').map(Number)
  const seedRanges: Range[] = []
  for (let rangeIndex = 0; rangeIndex < numbers.length; rangeIndex += 2) {
    const start = numbers[rangeIndex]
    const length = numbers[rangeIndex + 1]
    seedRanges.push({
      start,
      end: start + length,
    })
  }
  return seedRanges
}

export function findLowestLocationForSeedRange(
  seedRange: Range,
  rangeMapGroups: RangeMap[][]
) {
  let destinationRanges = [seedRange]
  for (const rangeMaps of rangeMapGroups) {
    destinationRanges = destinationRanges.flatMap((range) =>
      findDestinationRanges(range, rangeMaps)
    )
  }

  let lowestLocation = destinationRanges[0].start
  for (const range of destinationRanges) {
    if (range.start < lowestLocation) {
      lowestLocation = range.start
    }
  }
  return lowestLocation
}
