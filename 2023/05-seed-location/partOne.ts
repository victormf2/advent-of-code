import * as os from 'os'

const EOL = os.EOL

export function runPartOne(input: string) {
  const parsed = parseInput(input)
  const mapGroups = [
    parsed.seedToSoilMap,
    parsed.soilToFerilizerMap,
    parsed.fertilizerToWaterMap,
    parsed.waterToLightMap,
    parsed.lightToTemperatureMap,
    parsed.temperatureToHumidityMap,
    parsed.humidityToLocationMap,
  ]
  const seedLocations = parsed.seeds.map((seed) =>
    findLocation(seed, mapGroups)
  )
  const lowestLocation = Math.min(...seedLocations)
  console.log(lowestLocation)

  type ParsedInput = {
    seeds: number[]
    seedToSoilMap: SourceDestinationMap[]
    soilToFerilizerMap: SourceDestinationMap[]
    fertilizerToWaterMap: SourceDestinationMap[]
    waterToLightMap: SourceDestinationMap[]
    lightToTemperatureMap: SourceDestinationMap[]
    temperatureToHumidityMap: SourceDestinationMap[]
    humidityToLocationMap: SourceDestinationMap[]
  }
  type SourceDestinationMap = {
    source: number
    destination: number
    length: number
  }
  function parseInput(input: string): ParsedInput {
    var { seeds, next } = parseSeeds(input)
    var { data: seedToSoilMap, next } = parseMap(input, next)
    var { data: soilToFerilizerMap, next } = parseMap(input, next)
    var { data: fertilizerToWaterMap, next } = parseMap(input, next)
    var { data: waterToLightMap, next } = parseMap(input, next)
    var { data: lightToTemperatureMap, next } = parseMap(input, next)
    var { data: temperatureToHumidityMap, next } = parseMap(input, next)
    var { data: humidityToLocationMap, next } = parseMap(input, next)

    return {
      seeds,
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
  function parseSeeds(input: string) {
    const start = input.indexOf(':') + 1
    const end = input.indexOf(EOL, start)

    const seedText = input.substring(start, end).trim()
    const seeds = seedText.split(' ').map(Number)

    return { seeds, next: getNextInputStart(end) }
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

  function mapNumber(n: number, maps: SourceDestinationMap[]) {
    for (const map of maps) {
      if (n >= map.source && n < map.source + map.length) {
        const offset = n - map.source
        return map.destination + offset
      }
    }
    return n
  }

  function findLocation(seed: number, mapGroups: SourceDestinationMap[][]) {
    let location = seed
    for (const maps of mapGroups) {
      location = mapNumber(location, maps)
    }
    return location
  }
}
