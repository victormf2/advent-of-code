import { readFile } from 'fs/promises'
import {
  Range,
  RangeMap,
  findDestinationRanges,
  findLowestLocationForSeedRange,
  getSeedRanges,
  runPartTwo,
  toSortedRangeMaps,
} from './partTwo'
import path = require('path')

describe('findDestinationRanges', function () {
  const ranges: RangeMap[] = [
    {
      start: 10,
      end: 20,
      offset: -5,
    },
    {
      start: 20,
      end: 30,
      offset: 12,
    },
    {
      start: 35,
      end: 45,
      offset: -5,
    },
  ]
  test('out of ranges before', function () {
    const result = findDestinationRanges({ start: 0, end: 10 }, ranges)

    expect(result).toEqual<Range[]>([
      {
        start: 0,
        end: 10,
      },
    ])
  })
  test('out of ranges after', function () {
    const result = findDestinationRanges({ start: 45, end: 50 }, ranges)

    expect(result).toEqual<Range[]>([
      {
        start: 45,
        end: 50,
      },
    ])
  })
  test('matching range exactly', function () {
    const result = findDestinationRanges({ start: 20, end: 30 }, ranges)

    expect(result).toEqual<Range[]>([
      {
        start: 32,
        end: 42,
      },
    ])
  })
  test('between ranges', function () {
    const result = findDestinationRanges({ start: 15, end: 25 }, ranges)
    expect(result).toEqual<Range[]>([
      { start: 10, end: 15 }, // source { start: 15, end: 20 }
      { start: 32, end: 37 }, // source { start: 20, end: 25 }
    ])
  })
  test('catch all', function () {
    const result = findDestinationRanges({ start: 5, end: 50 }, ranges)
    expect(result).toEqual<Range[]>([
      { start: 5, end: 10 }, // source { start: 5, end: 10 }
      { start: 5, end: 15 }, // source { start: 10, end: 20 }
      { start: 32, end: 42 }, // source { start: 20, end: 30 }
      { start: 30, end: 35 }, // source { start: 30, end: 35 }
      { start: 30, end: 40 }, // source { start: 35, end: 45 }
      { start: 45, end: 50 }, // source { start: 45, end: 50 }
    ])
  })
})

describe('toSortedRangeMaps', function () {
  test('test', function () {
    const result = toSortedRangeMaps([
      { destination: 10, source: 45, length: 100 },
      { destination: 40, source: 10, length: 12 },
      { destination: 0, source: 90, length: 45 },
    ])

    expect(result).toEqual<RangeMap[]>([
      { start: 10, end: 22, offset: 30 },
      { start: 45, end: 145, offset: -35 },
      { start: 90, end: 135, offset: -90 },
    ])
  })
})

test('getSeedRanges', function () {
  const input = 'seeds: 30 10 55 40 32 12\r\n'

  const result = getSeedRanges(input)
  expect(result).toEqual<Range[]>([
    { start: 30, end: 40 },
    { start: 55, end: 95 },
    { start: 32, end: 44 },
  ])
})

test('findLowestLocationForSeedRange', function () {
  const result = findLowestLocationForSeedRange(
    {
      start: 10,
      end: 50,
    },
    [
      [
        { start: 0, end: 25, offset: 25 },
        { start: 25, end: 50, offset: -10 },
        /**
         * [10, 25] => [35, 50]
         * [25, 50] => [15, 40]
         */
      ],
      [
        { start: 20, end: 40, offset: -10 },
        /**
         * [35, 40] => [25, 30]
         * [40, 50] => [40, 50]
         * [15, 20] => [15, 20]
         * [20, 40] => [10, 30]
         */
      ],
    ]
  )

  expect(result).toEqual<typeof result>(10)
})

test('runPartTwo', async function () {
  const input = await readFile(
    path.join(__dirname, 'input-example-part2-format'),
    { encoding: 'utf-8' }
  )
  const result = runPartTwo(input)
  expect(result).toEqual<typeof result>(35)
})
