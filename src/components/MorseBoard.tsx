import { ALL_NODES, TRACES, getActivePath, getActiveTraces } from '../data/morseTree'
import { AntennaSymbol } from './AntennaSymbol'
import { MorseLED } from './MorseLED'
import { MorseTraces } from './MorseTraces'
import { TransmitButton } from './TransmitButton'
import { LetterDisplay } from './LetterDisplay'

interface MorseBoardProps {
  sequence: string
  confirmedLetter: string
  isConfirmed: boolean
  isPressed: boolean
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerCancel: (e: React.PointerEvent) => void
  onPointerLeave: (e: React.PointerEvent) => void
}

const VIEW_W = 400
const VIEW_H = 725
const BOARD_H = 555
const BTN_CY = 633
const BTN_R = 38

export function MorseBoard({
  sequence,
  confirmedLetter,
  isConfirmed,
  isPressed,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
}: MorseBoardProps) {
  const activePath = new Set(getActivePath(sequence))
  const activeTraceIds = getActiveTraces(sequence)

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
    >
      <defs>
        {/* Green LED glow */}
        <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood floodColor="#00ff44" result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="coloredSrc" />
          <feGaussianBlur in="coloredSrc" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Orange LED glow */}
        <filter id="orangeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feFlood floodColor="#ff8c00" result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="coloredSrc" />
          <feGaussianBlur in="coloredSrc" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Active trace glow */}
        {/* filterUnits="userSpaceOnUse" + absolute coords so the filter region never
            collapses for zero-width or zero-height elements (straight 2-point lines) */}
        <filter id="traceGlow" filterUnits="userSpaceOnUse" x="-10" y="-10" width="420" height="720">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Confirmed letter flash */}
        <filter id="confirmedFlash" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="saturate" values="3" />
        </filter>
        {/* Button radial gradient */}
        <radialGradient id="btnGradient" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </radialGradient>
      </defs>

      {/* PCB Board background */}
      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#0a0a0a" />
      <rect x="4" y="4" width={VIEW_W - 8} height={BOARD_H - 4} rx="0" fill="#111111" />

      {/* PCB border */}
      <rect
        x="4" y="4"
        width={VIEW_W - 8}
        height={BOARD_H - 4}
        fill="none"
        stroke="#c8941a"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Corner mounting holes */}
      {[[16,16],[VIEW_W-16,16],[16,BOARD_H-12],[VIEW_W-16,BOARD_H-12]].map(([hx,hy], i) => (
        <circle key={i} cx={hx} cy={hy} r="4" fill="#0a0a0a" stroke="#c8941a" strokeWidth="1" strokeOpacity="0.5" />
      ))}

      {/* Header */}
      <text
        x={VIEW_W / 2}
        y="20"
        textAnchor="middle"
        dominantBaseline="hanging"
        fontSize="11"
        fontFamily="'Courier New', monospace"
        fill="#c8941a"
        letterSpacing="3"
      >
        MORSE CODE TRAINER
      </text>

      {/* Inner content shifted down 25px to give the title a clear box */}
      <g transform="translate(0, 25)">
        <AntennaSymbol cx={200} cy={55} />
      </g>

      {/* Wireless symbol at bottom of board */}
      <g stroke="#c8941a" strokeWidth="1.5" fill="none" strokeOpacity="0.6">
        <circle cx={VIEW_W / 2} cy={BOARD_H - 20} r="6" />
        <path d={`M ${VIEW_W/2 - 12},${BOARD_H - 28} A 14 14 0 0 1 ${VIEW_W/2 + 12},${BOARD_H - 28}`} />
        <path d={`M ${VIEW_W/2 - 20},${BOARD_H - 34} A 22 22 0 0 1 ${VIEW_W/2 + 20},${BOARD_H - 34}`} />
      </g>

      {/* Traces + LEDs shifted down 25px (same transform group as antenna) */}
      <g transform="translate(0, 25)">
        <MorseTraces traces={TRACES} activeTraceIds={activeTraceIds} />
        {ALL_NODES.map(node => (
          <MorseLED
            key={node.letter}
            node={node}
            active={activePath.has(node.letter)}
            confirmed={isConfirmed && confirmedLetter === node.letter}
          />
        ))}
      </g>

      {/* Divider between board and controls */}
      <line
        x1="4" y1={BOARD_H}
        x2={VIEW_W - 4} y2={BOARD_H}
        stroke="#c8941a"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Display area */}
      <LetterDisplay
        sequence={sequence}
        confirmedLetter={confirmedLetter}
        isConfirmed={isConfirmed}
        x={VIEW_W / 2}
        y={BOARD_H / 3}
        width={80}
      />

      {/* Transmit button */}
      <TransmitButton
        isPressed={isPressed}
        cx={VIEW_W / 2}
        cy={BTN_CY}
        r={BTN_R}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
      />
    </svg>
  )
}
