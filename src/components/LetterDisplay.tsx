interface LetterDisplayProps {
  sequence: string
  confirmedLetter: string
  isConfirmed: boolean
  x: number
  y: number
  width: number
}

export function LetterDisplay({ sequence, confirmedLetter, isConfirmed, x, y, width }: LetterDisplayProps) {
  const height = 90
  const cx = x
  const top = y

  const isEmpty = !sequence && !confirmedLetter

  return (
    <g visibility={isEmpty ? 'hidden' : 'visible'}>
      {/* Background rect */}
      <rect
        x={cx - width / 2}
        y={top}
        width={width}
        height={height}
        fill="#0d0d0d"
        stroke={isConfirmed ? '#ffd700' : '#c8941a'}
        strokeWidth={isConfirmed ? 2 : 1}
        strokeOpacity="0.8"
        filter={isConfirmed ? 'url(#confirmedFlash)' : undefined}
      />
      {/* Morse sequence */}
      <text
        x={cx}
        y={top + 22}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fontFamily="'Courier New', monospace"
        fill={isConfirmed ? '#ffd700' : '#c8941a'}
        letterSpacing="3"
      >
        {sequence || (isConfirmed ? confirmedLetter !== '?' ? '✓' : '?' : '')}
      </text>
      {/* Big letter */}
      {isConfirmed && (
        <text
          x={cx}
          y={top + 62}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="48"
          fontFamily="'Courier New', monospace"
          fontWeight="bold"
          fill="#ffd700"
          filter="url(#confirmedFlash)"
        >
          {confirmedLetter === '?' ? '?' : confirmedLetter}
        </text>
      )}
    </g>
  )
}
