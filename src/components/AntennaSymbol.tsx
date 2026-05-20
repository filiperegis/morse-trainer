interface AntennaSymbolProps {
  cx: number
  cy: number
}

export function AntennaSymbol({ cx, cy }: AntennaSymbolProps) {
  // Inverted triangle pointing down + vertical stem + horizontal bars
  const stemTop = cy - 20
  const stemBottom = cy
  const triHalfW = 14
  const triH = 16
  const triTop = stemTop

  return (
    <g stroke="#c8941a" strokeWidth="2" fill="none" strokeLinecap="square">
      {/* Vertical stem */}
      <line x1={cx} y1={stemBottom} x2={cx} y2={stemTop} />
      {/* Inverted triangle (apex down, base up) */}
      <polyline
        points={`${cx - triHalfW},${triTop} ${cx + triHalfW},${triTop} ${cx},${triTop + triH} ${cx - triHalfW},${triTop}`}
      />
      {/* Horizontal bars (signal waves) at top */}
      <line x1={cx - 8} y1={triTop - 5} x2={cx + 8} y2={triTop - 5} />
      <line x1={cx - 12} y1={triTop - 10} x2={cx + 12} y2={triTop - 10} />
    </g>
  )
}
