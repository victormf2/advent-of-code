import { EOL } from 'os'

export function runPartTwo(input: string) {
  const lines = input.split(EOL)
  return lines.reduce((total, line) => {
    const newLocal = getFirstAndLastDigit(line)
    return total + newLocal
  }, 0)
}

export function getFirstAndLastDigit(line: string) {
  const first = findNextDigit(line, 0)
  let last = first
  for (let next = 1; next < line.length; next++) {
    const found = findNextDigit(line, next)
    if (found == null) {
      break
    }
    last = found
  }
  // while (last.next < line.length) {
  //   if (found == null) {
  //     break
  //   }
  //   last = found
  // }

  return Number(`${first.value}${last.value}`)
}

function findNextDigit(line: string, index: number) {
  for (let i = index; i < line.length; i++) {
    const found = match(line, i, searchTree)
    if (found != null) {
      return found
    }
  }
}

export const searchTree = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  o: {
    n: {
      e: 1,
    },
  },
  t: {
    w: {
      o: 2,
    },
    h: {
      r: {
        e: {
          e: 3,
        },
      },
    },
  },
  f: {
    o: {
      u: {
        r: 4,
      },
    },
    i: {
      v: {
        e: 5,
      },
    },
  },
  s: {
    i: {
      x: 6,
    },
    e: {
      v: {
        e: {
          n: 7,
        },
      },
    },
  },
  e: {
    i: {
      g: {
        h: {
          t: 8,
        },
      },
    },
  },
  n: {
    i: {
      n: {
        e: 9,
      },
    },
  },
}

export function match(line: string, index: number, searchTree: any) {
  const currentChar = line[index]
  const found = searchTree[currentChar]
  if (typeof found === 'number') {
    return { next: index + 1, value: found }
  }
  if (typeof found === 'object') {
    return match(line, index + 1, found)
  }
  return null
}
