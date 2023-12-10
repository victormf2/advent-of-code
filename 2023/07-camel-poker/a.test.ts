import { EOL } from 'os'
import { read, write } from '../helpers/file'

function countKinds(cards: string[]) {
  const count: Record<string, number> = {}
  for (const card of cards) {
    count[card] ??= 0
    count[card] += 1
  }
  return count
}

const handTypes = {
  fiveOfAKind: 6,
  fourOfAKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPair: 2,
  onePair: 1,
  highCard: 0,
}

function getHandType(count: Record<string, number>) {
  const entries = Object.entries(count)
  if (entries.length === 5) {
    return handTypes.highCard
  }
  if (entries.length === 4) {
    return handTypes.onePair
  }
  if (entries.length === 3) {
    const first = entries[0]
    const second = entries[1]
    const third = entries[2]
    if (first[1] === 3 || second[1] === 3 || third[1] === 3) {
      return handTypes.threeOfAKind
    }
    return handTypes.twoPair
  }
  if (entries.length === 2) {
    const first = entries[0]
    const second = entries[1]
    if (first[1] === 4 || second[1] === 4) {
      return handTypes.fourOfAKind
    }
    return handTypes.fullHouse
  }
  if (entries.length === 1) {
    return handTypes.fiveOfAKind
  }
  throw new Error(`Unexpected length: ${entries.length}`)
}

function parseHand(handStr: string, jokerRule = false) {
  const cards = handStr.split('')
  const count = countKinds(cards)
  let handType = getHandType(count)

  if (jokerRule) {
    handType = applyJokerRule(handType, count)
  }

  return {
    cards,
    count,
    handType,
  }
}

function applyJokerRule(handType: number, count: Record<string, number>) {
  const jokerCount = count.J
  if (typeof jokerCount !== 'number') {
    return handType
  }
  if (jokerCount === 1) {
    switch (handType) {
      case handTypes.fourOfAKind:
        return handTypes.fiveOfAKind
      case handTypes.threeOfAKind:
        return handTypes.fourOfAKind
      case handTypes.twoPair:
        return handTypes.fullHouse
      case handTypes.onePair:
        return handTypes.threeOfAKind
      case handTypes.highCard:
        return handTypes.onePair
      default:
        throw new Error('Should not be here')
    }
  }

  if (jokerCount === 2) {
    switch (handType) {
      case handTypes.fullHouse:
        return handTypes.fiveOfAKind
      case handTypes.twoPair:
        return handTypes.fourOfAKind
      case handTypes.onePair:
        return handTypes.threeOfAKind
      default:
        throw new Error('Should not be here')
    }
  }
  if (jokerCount === 3) {
    switch (handType) {
      case handTypes.fullHouse:
        return handTypes.fiveOfAKind
      case handTypes.threeOfAKind:
        return handTypes.fourOfAKind
      default:
        throw new Error('Should not be here')
    }
  }
  if (jokerCount === 4) {
    switch (handType) {
      case handTypes.fourOfAKind:
        return handTypes.fiveOfAKind
      default:
        throw new Error('Should not be here')
    }
  }
  if (jokerCount === 5) {
    return handTypes.fiveOfAKind
  }

  throw new Error('Should not be here')
}

describe('parseHand', function () {
  test('fiveOfAKind', function () {
    const result = parseHand('AAAAA')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'A', 'A', 'A', 'A'],
      count: {
        A: 5,
      },
      handType: handTypes.fiveOfAKind,
    })
  })
  test('fourOfAKind', function () {
    const result = parseHand('AA5AA')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'A', '5', 'A', 'A'],
      count: {
        A: 4,
        '5': 1,
      },
      handType: handTypes.fourOfAKind,
    })
  })
  test('fullHouse', function () {
    const result = parseHand('AA5A5')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'A', '5', 'A', '5'],
      count: {
        A: 3,
        '5': 2,
      },
      handType: handTypes.fullHouse,
    })
  })
  test('threeOfAKind', function () {
    const result = parseHand('AA5A4')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'A', '5', 'A', '4'],
      count: {
        A: 3,
        '5': 1,
        '4': 1,
      },
      handType: handTypes.threeOfAKind,
    })
  })
  test('twoPair', function () {
    const result = parseHand('AA554')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'A', '5', '5', '4'],
      count: {
        A: 2,
        '5': 2,
        '4': 1,
      },
      handType: handTypes.twoPair,
    })
  })
  test('onePair', function () {
    const result = parseHand('AA5J4')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'A', '5', 'J', '4'],
      count: {
        A: 2,
        '5': 1,
        '4': 1,
        J: 1,
      },
      handType: handTypes.onePair,
    })
  })
  test('highCard', function () {
    const result = parseHand('AK5J4')
    expect(result).toEqual<typeof result>({
      cards: ['A', 'K', '5', 'J', '4'],
      count: {
        A: 1,
        K: 1,
        '5': 1,
        '4': 1,
        J: 1,
      },
      handType: handTypes.highCard,
    })
  })
})

const cardsStrengthDefault = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  '9': 7,
  '8': 6,
  '7': 5,
  '6': 4,
  '5': 3,
  '4': 2,
  '3': 1,
  '2': 0,
}
type Hand = {
  cards: string[]
  count: Record<string, number>
  handType: number
}
function compareHands(
  handA: Hand,
  handB: Hand,
  cardsStrength: Record<string, number>
) {
  if (handA.handType !== handB.handType) {
    return handA.handType - handB.handType
  }

  for (let cardIndex = 0; cardIndex < 5; cardIndex++) {
    const handACard = handA.cards[cardIndex]
    const handBCard = handB.cards[cardIndex]
    if (handACard !== handBCard) {
      return cardsStrength[handACard] - cardsStrength[handBCard]
    }
  }
  return 0
}

describe('compareHands', function () {
  test('compare hand types', function () {
    const fullHouse = parseHand('KKJJJ')
    const twoPair = parseHand('TT998')
    const result = compareHands(fullHouse, twoPair, cardsStrengthDefault)

    expect(result).toBeGreaterThan(0)
  })

  test('compare cards', function () {
    const fullHouseA = parseHand('KJKJJ')
    const fullHouseB = parseHand('KKJJJ')
    const result = compareHands(fullHouseA, fullHouseB, cardsStrengthDefault)

    expect(result).toBeLessThan(0)
  })
})

function parseInput(input: string, jokerRule = false) {
  const handBids = input.split(EOL).map((line) => {
    const [cardsStr, bidStr] = line.split(' ')
    return {
      bid: Number(bidStr),
      hand: parseHand(cardsStr, jokerRule),
    }
  })
  return { handBids }
}

function partOne(inputFile: string) {
  const input = read(inputFile)
  const { handBids } = parseInput(input)

  handBids.sort((a, b) => compareHands(a.hand, b.hand, cardsStrengthDefault))

  const totalWinnings = handBids.reduce((total, handBid, index) => {
    const rank = index + 1
    return total + handBid.bid * rank
  }, 0)

  return totalWinnings
}

test('partOne example', function () {
  const result = partOne('example-input')
  expect(result).toBe(6440)
})

test('partOne real', function () {
  const result = partOne('input')
  write('output', result)
})

const cardsStrengthJoker = {
  A: 12,
  K: 11,
  Q: 10,
  T: 8,
  '9': 7,
  '8': 6,
  '7': 5,
  '6': 4,
  '5': 3,
  '4': 2,
  '3': 1,
  '2': 0,
  J: -1,
}

function partTwo(inputFile: string) {
  const input = read(inputFile)
  const { handBids } = parseInput(input, true)

  handBids.sort((a, b) => compareHands(a.hand, b.hand, cardsStrengthJoker))

  const totalWinnings = handBids.reduce((total, handBid, index) => {
    const rank = index + 1
    return total + handBid.bid * rank
  }, 0)

  return totalWinnings
}

test('partTwo example', function () {
  const result = partTwo('example-input')
  expect(result).toBe(5905)
})

test('partTwo real', function () {
  const result = partTwo('input')
  write('output-two', result)
})
