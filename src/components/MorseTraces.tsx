import { TraceData } from '../data/morseTree'

interface MorseTracesProps {
  traces: TraceData[]
  activeTraceIds: Set<string>
}

export function MorseTraces({ traces, activeTraceIds }: MorseTracesProps) {
  return (
    <g>
      {traces.map(trace => {
        const isActive = activeTraceIds.has(trace.id)
        const pointsStr = trace.points.map(([px, py]) => `${px},${py}`).join(' ')
        return (
          <polyline
            key={trace.id}
            points={pointsStr}
            fill="none"
            stroke={isActive ? '#ffd700' : '#c8941a'}
            strokeWidth={isActive ? 2.5 : 2}
            strokeOpacity={isActive ? 1 : 0.4}
            strokeLinecap="square"
            strokeLinejoin="miter"
            filter={isActive ? 'url(#traceGlow)' : undefined}
          />
        )
      })}
    </g>
  )
}
