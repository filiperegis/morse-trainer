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

const NODE_DEFS: NodeDef[] = [
  // ROOT (antenna terminal — no LED)
  { letter: 'ROOT', code: '', x: 200, y: 55, ledType: 'none', dotChild: 'E', dashChild: 'T' },

  // TOP ROW y=90
  { letter: 'E', code: '.', x: 260, y: 90, ledType: 'circle', dotChild: 'I', dashChild: 'A' },
  { letter: 'T', code: '-', x: 138, y: 90, ledType: 'rect-h', dotChild: 'N', dashChild: 'M' },
  { letter: 'I', code: '..', x: 315, y: 90, ledType: 'circle', dotChild: 'S', dashChild: 'U' },
  { letter: 'S', code: '...', x: 358, y: 90, ledType: 'circle', dotChild: 'H', dashChild: 'V' },
  { letter: 'H', code: '....', x: 390, y: 90, ledType: 'circle' },
  { letter: 'M', code: '--', x: 75, y: 90, ledType: 'rect-h', dotChild: 'G', dashChild: 'O' },
  { letter: 'Q', code: '--.-', x: 22, y: 90, ledType: 'rect-h' },

  // LEVEL 2
  { letter: 'A', code: '.-', x: 260, y: 148, ledType: 'rect-h', dotChild: 'R', dashChild: 'W' },
  { letter: 'N', code: '-.', x: 155, y: 148, ledType: 'circle', dotChild: 'D', dashChild: 'K' },
  { letter: 'O', code: '---', x: 38, y: 148, ledType: 'rect-h' },
  { letter: 'G', code: '--.', x: 75, y: 155, ledType: 'circle', dotChild: 'Z', dashChild: 'Q' },
  { letter: 'U', code: '..-', x: 315, y: 155, ledType: 'rect-v', dotChild: 'F' },
  { letter: 'V', code: '...-', x: 358, y: 148, ledType: 'rect-h' },

  // LEVEL 3
  { letter: 'R', code: '.-.', x: 260, y: 210, ledType: 'circle', dotChild: 'L' },
  { letter: 'W', code: '.--', x: 292, y: 210, ledType: 'rect-h', dotChild: 'P', dashChild: 'J' },
  { letter: 'D', code: '-..', x: 135, y: 210, ledType: 'circle', dotChild: 'B', dashChild: 'X' },
  { letter: 'K', code: '-.-', x: 175, y: 210, ledType: 'rect-h', dotChild: 'C', dashChild: 'Y' },
  { letter: 'Z', code: '--..', x: 52, y: 212, ledType: 'circle' },
  { letter: 'F', code: '..-.',  x: 315, y: 210, ledType: 'circle' },
  { letter: 'Y', code: '-.--', x: 198, y: 210, ledType: 'rect-h' },

  // LEVEL 4
  { letter: 'L', code: '.-..', x: 260, y: 268, ledType: 'circle' },
  { letter: 'P', code: '.--.',  x: 282, y: 268, ledType: 'circle' },
  { letter: 'J', code: '.---', x: 305, y: 268, ledType: 'rect-v' },
  { letter: 'B', code: '-...', x: 112, y: 268, ledType: 'circle' },
  { letter: 'X', code: '-..-', x: 150, y: 265, ledType: 'rect-h' },
  { letter: 'C', code: '-.-.', x: 162, y: 268, ledType: 'circle' },
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
  // ROOT connections
  { id: 'ROOT-T', points: [[200,55],[138,55],[138,90]], childLetter: 'T' },
  { id: 'ROOT-E', points: [[200,55],[260,55],[260,90]], childLetter: 'E' },
  // T branch
  { id: 'T-M', points: [[138,90],[75,90]], childLetter: 'M' },
  { id: 'T-N', points: [[138,90],[138,148],[155,148]], childLetter: 'N' },
  // M branch
  { id: 'M-O', points: [[75,90],[75,148],[38,148]], childLetter: 'O' },
  { id: 'M-G', points: [[75,90],[75,155]], childLetter: 'G' },
  // G branch
  { id: 'G-Z', points: [[75,155],[75,212],[52,212]], childLetter: 'Z' },
  { id: 'G-Q', points: [[75,155],[22,155],[22,90]], childLetter: 'Q' },
  // N branch
  { id: 'N-D', points: [[155,148],[155,210],[135,210]], childLetter: 'D' },
  { id: 'N-K', points: [[155,148],[155,210],[175,210]], childLetter: 'K' },
  // D branch
  { id: 'D-B', points: [[135,210],[135,268],[112,268]], childLetter: 'B' },
  { id: 'D-X', points: [[135,210],[135,265],[150,265]], childLetter: 'X' },
  // K branch
  { id: 'K-C', points: [[175,210],[175,268],[162,268]], childLetter: 'C' },
  { id: 'K-Y', points: [[175,210],[198,210]], childLetter: 'Y' },
  // E branch
  { id: 'E-I', points: [[260,90],[315,90]], childLetter: 'I' },
  { id: 'E-A', points: [[260,90],[260,148]], childLetter: 'A' },
  // I branch
  { id: 'I-S', points: [[315,90],[358,90]], childLetter: 'S' },
  { id: 'I-U', points: [[315,90],[315,155]], childLetter: 'U' },
  // S branch
  { id: 'S-H', points: [[358,90],[390,90]], childLetter: 'H' },
  { id: 'S-V', points: [[358,90],[358,148]], childLetter: 'V' },
  // A branch
  { id: 'A-R', points: [[260,148],[260,210]], childLetter: 'R' },
  { id: 'A-W', points: [[260,148],[292,148],[292,210]], childLetter: 'W' },
  // R branch
  { id: 'R-L', points: [[260,210],[260,268]], childLetter: 'L' },
  // W branch
  { id: 'W-P', points: [[292,210],[292,268],[282,268]], childLetter: 'P' },
  { id: 'W-J', points: [[292,210],[292,268],[305,268]], childLetter: 'J' },
  // U branch
  { id: 'U-F', points: [[315,155],[315,210]], childLetter: 'F' },
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
