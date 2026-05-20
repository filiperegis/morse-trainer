interface TransmitButtonProps {
  isPressed: boolean
  cx: number
  cy: number
  r: number
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
}

export function TransmitButton({
  isPressed,
  cx,
  cy,
  r,
  onTouchStart,
  onTouchEnd,
  onMouseDown,
  onMouseUp,
}: TransmitButtonProps) {
  const scale = isPressed ? 0.95 : 1
  return (
    <g
      transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      pointerEvents="all"
      style={{ cursor: 'pointer' }}
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="#c8941a" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Main button */}
      <circle cx={cx} cy={cy} r={r} fill="url(#btnGradient)" stroke="#c8941a" strokeWidth="2" />
      {/* Inner ring decoration */}
      <circle
        cx={cx}
        cy={cy}
        r={r - 8}
        fill="none"
        stroke={isPressed ? '#ffd700' : '#c8941a'}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      {/* Center dot */}
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={isPressed ? '#ffd700' : '#c8941a'}
        filter={isPressed ? 'url(#orangeGlow)' : undefined}
      />
      {/* Label */}
      <text
        x={cx}
        y={cy + r + 14}
        textAnchor="middle"
        fontSize="10"
        fontFamily="'Courier New', monospace"
        fill="#c8941a"
        letterSpacing="2"
        pointerEvents="none"
      >
        TRANSMIT
      </text>
    </g>
  )
}
