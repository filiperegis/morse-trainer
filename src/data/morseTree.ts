export type LedType = 'circle' | 'rect-h' | 'rect-v' | 'none'

export interface MorseNode {
  letter: string
  code: string
  x: number
  y: number
  ledType: LedType
  dot?: MorseNode
  dash?: MorseNode
}

export interface TraceData {
  id: string
  points: [number, number][]
  /** The letter the trace leads TO (child node) */
  childLetter: string
}

interface NodeDef {
  letter: string
  code: string
  x: number
  y: number
  ledType: LedType
  dotChild?: string
  dashChild?: string
}

// 7-column × 7-row grid
// Column x: col1=35  col2=90  col3=148  [antenna@200]  col4=252  col5=308  col6=358  col7=390
// Row    y: row1=90  row2=155  row3=220  row4=285  row5=350  row6=415  row7=480
const NODE_DEFS: NodeDef[] = [
  // ROOT (antenna terminal — no LED)
  { letter: 'ROOT', code: '', x: 200, y: 55, ledType: 'none', dotChild: 'E', dashChild: 'T' },

  // Column 1  (x=35)
  { letter: 'O', code: '---',  x: 35,  y: 90,  ledType: 'rect-h' },
  { letter: 'Q', code: '--.-', x: 35,  y: 155, ledType: 'rect-h' },
  { letter: 'Y', code: '-.--', x: 35,  y: 285, ledType: 'rect-h' },

  // Column 2  (x=90)
  { letter: 'M', code: '--',   x: 90,  y: 90,  ledType: 'rect-h', dotChild: 'G', dashChild: 'O' },
  { letter: 'G', code: '--.',  x: 90,  y: 155, ledType: 'circle',  dotChild: 'Z', dashChild: 'Q' },
  { letter: 'Z',   code: '--..',  x: 90,  y: 220, ledType: 'circle',  dashChild: 'SPC' },
  { letter: 'SPC', code: '--..-', x: 35,  y: 220, ledType: 'rect-h' },
  { letter: 'K', code: '-.-',  x: 90,  y: 285, ledType: 'rect-h', dotChild: 'C', dashChild: 'Y' },
  { letter: 'C', code: '-.-.',  x: 90,  y: 350, ledType: 'circle' },
  { letter: 'X', code: '-..-', x: 90,  y: 415, ledType: 'rect-h' },

  // Column 3  (x=148)
  { letter: 'T', code: '-',    x: 148, y: 90,  ledType: 'rect-h', dotChild: 'N', dashChild: 'M' },
  { letter: 'N', code: '-.',   x: 148, y: 285, ledType: 'circle',  dotChild: 'D', dashChild: 'K' },
  { letter: 'D', code: '-..',  x: 148, y: 415, ledType: 'circle',  dotChild: 'B', dashChild: 'X' },
  { letter: 'B', code: '-...', x: 148, y: 480, ledType: 'circle' },

  // Column 4  (x=252)
  { letter: 'E', code: '.',    x: 252, y: 90,  ledType: 'circle',  dotChild: 'I', dashChild: 'A' },
  { letter: 'A', code: '.-',   x: 252, y: 285, ledType: 'rect-h',  dotChild: 'R', dashChild: 'W' },
  { letter: 'W', code: '.--',  x: 252, y: 415, ledType: 'rect-h',  dotChild: 'P', dashChild: 'J' },
  { letter: 'J', code: '.---', x: 252, y: 480, ledType: 'rect-h' },

  // Column 5  (x=308)
  { letter: 'I', code: '..',   x: 308, y: 90,  ledType: 'circle',  dotChild: 'S', dashChild: 'U' },
  { letter: 'U', code: '..-',  x: 308, y: 155, ledType: 'rect-h',  dotChild: 'F' },
  { letter: 'F', code: '..-.',  x: 308, y: 220, ledType: 'circle' },
  { letter: 'R', code: '.-.',  x: 308, y: 285, ledType: 'circle',  dotChild: 'L' },
  { letter: 'P', code: '.--.',  x: 308, y: 415, ledType: 'circle' },

  // Column 6  (x=358)
  { letter: 'S', code: '...',  x: 358, y: 90,  ledType: 'circle',  dotChild: 'H', dashChild: 'V' },
  { letter: 'V', code: '...-', x: 358, y: 155, ledType: 'rect-h' },
  { letter: 'L', code: '.-..',  x: 358, y: 285, ledType: 'circle' },

  // Column 7  (x=382 — pulled in to stay within board border)
  { letter: 'H', code: '....', x: 382, y: 90,  ledType: 'circle' },
]

// Build node map
const nodeMap = new Map<string, MorseNode>()
for (const def of NODE_DEFS) {
  nodeMap.set(def.letter, {
    letter: def.letter,
    code: def.code,
    x: def.x,
    y: def.y,
    ledType: def.ledType,
  })
}

// Wire up parent→child references
for (const def of NODE_DEFS) {
  const node = nodeMap.get(def.letter)!
  if (def.dotChild) node.dot = nodeMap.get(def.dotChild)
  if (def.dashChild) node.dash = nodeMap.get(def.dashChild)
}

export const MORSE_ROOT: MorseNode = nodeMap.get('ROOT')!

/** All 26 letter nodes (excludes ROOT) */
export const ALL_NODES: MorseNode[] = NODE_DEFS.filter(d => d.letter !== 'ROOT').map(
  d => nodeMap.get(d.letter)!
)

export const TRACES: TraceData[] = [
  // ROOT → vertical trunk down to row1, then branch left/right
  { id: 'ROOT-T', points: [[200,55],[200,90],[148,90]], childLetter: 'T' },
  { id: 'ROOT-E', points: [[200,55],[200,90],[252,90]], childLetter: 'E' },

  // T (col3 row1)
  { id: 'T-M', points: [[148,90],[90,90]],   childLetter: 'M' },   // dash → left
  { id: 'T-N', points: [[148,90],[148,285]], childLetter: 'N' },   // dot  → down

  // M (col2 row1)
  { id: 'M-O', points: [[90,90],[35,90]],    childLetter: 'O' },   // dash → left
  { id: 'M-G', points: [[90,90],[90,155]],   childLetter: 'G' },   // dot  → down

  // G (col2 row2)
  { id: 'G-Z', points: [[90,155],[90,220]],  childLetter: 'Z' },   // dot  → down
  { id: 'G-Q', points: [[90,155],[35,155]],  childLetter: 'Q' },   // dash → left

  // Z (col2 row3)
  { id: 'Z-SPC', points: [[90,220],[35,220]], childLetter: 'SPC' }, // dash → left

  // N (col3 row4)
  { id: 'N-D', points: [[148,285],[148,415]], childLetter: 'D' },  // dot  → down
  { id: 'N-K', points: [[148,285],[90,285]],  childLetter: 'K' },  // dash → left

  // K (col2 row4)
  { id: 'K-C', points: [[90,285],[90,350]],  childLetter: 'C' },   // dot  → down
  { id: 'K-Y', points: [[90,285],[35,285]],  childLetter: 'Y' },   // dash → left

  // D (col3 row6)
  { id: 'D-B', points: [[148,415],[148,480]], childLetter: 'B' },  // dot  → down
  { id: 'D-X', points: [[148,415],[90,415]],  childLetter: 'X' },  // dash → left

  // E (col4 row1)
  { id: 'E-I', points: [[252,90],[308,90]],  childLetter: 'I' },   // dot  → right
  { id: 'E-A', points: [[252,90],[252,285]], childLetter: 'A' },   // dash → down

  // I (col5 row1)
  { id: 'I-S', points: [[308,90],[358,90]],  childLetter: 'S' },   // dot  → right
  { id: 'I-U', points: [[308,90],[308,155]], childLetter: 'U' },   // dash → down

  // S (col6 row1)
  { id: 'S-H', points: [[358,90],[382,90]],  childLetter: 'H' },   // dot  → right
  { id: 'S-V', points: [[358,90],[358,155]], childLetter: 'V' },   // dash → down

  // U (col5 row2)
  { id: 'U-F', points: [[308,155],[308,220]], childLetter: 'F' },  // dot  → down

  // A (col4 row4)
  { id: 'A-R', points: [[252,285],[308,285]], childLetter: 'R' },  // dot  → right
  { id: 'A-W', points: [[252,285],[252,415]], childLetter: 'W' },  // dash → down

  // R (col5 row4)
  { id: 'R-L', points: [[308,285],[358,285]], childLetter: 'L' },  // dot  → right

  // W (col4 row6)
  { id: 'W-P', points: [[252,415],[308,415]], childLetter: 'P' },  // dot  → right
  { id: 'W-J', points: [[252,415],[252,480]], childLetter: 'J' },  // dash → down
]

/** Get the letter node for a given Morse code string */
export function getNodeByCode(code: string): MorseNode | undefined {
  return ALL_NODES.find(n => n.code === code)
}

/** Get all letter nodes along the path for a given partial code */
export function getActivePath(code: string): string[] {
  if (!code) return []
  const path: string[] = []
  let current: MorseNode | undefined = MORSE_ROOT
  for (const sym of code) {
    if (!current) break
    current = sym === '.' ? current.dot : current.dash
    if (current) path.push(current.letter)
  }
  return path
}

/** Get the set of trace IDs that are active for a given partial code */
export function getActiveTraces(code: string): Set<string> {
  const active = new Set<string>()
  if (!code) return active
  let current: MorseNode | undefined = MORSE_ROOT
  let parentLetter = 'ROOT'
  for (const sym of code) {
    if (!current) break
    const child: MorseNode | undefined = sym === '.' ? current.dot : current.dash
    if (!child) break
    active.add(`${parentLetter}-${child.letter}`)
    parentLetter = child.letter
    current = child
  }
  return active
}
