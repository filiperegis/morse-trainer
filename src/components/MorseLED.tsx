import { MorseNode } from '../data/morseTree'

interface MorseLEDProps {
  node: MorseNode
  active: boolean
  confirmed: boolean
}

const CIRCLE_R = 9
const RECT_H_W = 22
const RECT_H_H = 10
const RECT_V_W = 10
const RECT_V_H = 22

type LabelPos = 'above' | 'below' | 'left' | 'right'

const LABEL_POS: Partial<Record<string, LabelPos>> = {
  // right of LED
  G: 'right', N: 'right', D: 'right',
  // above LED
  O: 'above', M: 'above', T: 'above', E: 'above',
  I: 'above', S: 'above', H: 'above', K: 'above',
  // left of LED
  U: 'left', A: 'left', W: 'left',
  // all others default to 'below'
}

export function MorseLED({ node, active, confirmed }: MorseLEDProps) {
  const { x, y, ledType, letter } = node
  if (ledType === 'none') return null

  const isActive = active || confirmed
  const filterId = confirmed
    ? 'confirmedFlash'
    : ledType === 'circle'
    ? 'greenGlow'
    : 'orangeGlow'

  const fill = confirmed
    ? (ledType === 'circle' ? '#00ff44' : '#ff8c00')
    : active
    ? (ledType === 'circle' ? '#00ff44' : '#ff8c00')
    : (ledType === 'circle' ? '#0d2b0d' : '#2b1a00')

  const stroke = isActive ? '#ffd700' : '#c8941a'
  const filter = isActive ? `url(#${filterId})` : undefined

  // Per-letter label position
  const halfW = ledType === 'circle' ? CIRCLE_R : ledType === 'rect-h' ? RECT_H_W / 2 : RECT_V_W / 2
  const halfH = ledType === 'circle' ? CIRCLE_R : ledType === 'rect-h' ? RECT_H_H / 2 : RECT_V_H / 2
  const pos: LabelPos = LABEL_POS[letter] ?? 'below'

  let labelX = x, labelY = y
  let textAnchor: 'start' | 'middle' | 'end' = 'middle'
  let dominantBaseline: 'auto' | 'hanging' | 'middle' = 'hanging'

  if (pos === 'above') {
    labelY = y - halfH - 5
    dominantBaseline = 'auto'
  } else if (pos === 'below') {
    labelY = y + halfH + 5
    dominantBaseline = 'hanging'
  } else if (pos === 'left') {
    labelX = x - halfW - 4
    textAnchor = 'end'
    dominantBaseline = 'middle'
  } else {
    labelX = x + halfW + 4
    textAnchor = 'start'
    dominantBaseline = 'middle'
  }

  return (
    <g>
      {ledType === 'circle' && (
        <circle
          cx={x}
          cy={y}
          r={CIRCLE_R}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
          filter={filter}
        />
      )}
      {ledType === 'rect-h' && (
        <rect
          x={x - RECT_H_W / 2}
          y={y - RECT_H_H / 2}
          width={RECT_H_W}
          height={RECT_H_H}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
          filter={filter}
        />
      )}
      {ledType === 'rect-v' && (
        <rect
          x={x - RECT_V_W / 2}
          y={y - RECT_V_H / 2}
          width={RECT_V_W}
          height={RECT_V_H}
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
          filter={filter}
        />
      )}
      <text
        x={labelX}
        y={labelY}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fontSize="9"
        fontFamily="'Courier New', monospace"
        fill={isActive ? '#ffd700' : '#c8941a'}
        pointerEvents="none"
      >
        {letter}
      </text>
    </g>
  )
}
