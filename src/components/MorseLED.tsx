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

  const labelY = y + (ledType === 'rect-v' ? RECT_V_H / 2 + 8 : ledType === 'circle' ? CIRCLE_R + 8 : RECT_H_H / 2 + 8)

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
        x={x}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="hanging"
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
