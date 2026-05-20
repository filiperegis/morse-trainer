import { TraceData } from '../data/morseTree'

interface MorseTracesProps {
    traces: TraceData[]
    activeTraceIds: Set<string>
}

export function MorseTraces({ traces, activeTraceIds }: MorseTracesProps) {
    return (
        <g>
            {/* Base layer: all traces in stable order — React only updates attributes, never moves nodes */}
            {traces.map(trace => {
                const pointsStr = trace.points.map(([px, py]) => `${px},${py}`).join(' ')
                return (
                    <polyline
                        key={trace.id}
                        points={pointsStr}
                        fill="none"
                        stroke="#c8941a"
                        strokeWidth={2}
                        strokeOpacity={0.4}
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                    />
                )
            })}
            {/* Active layer: active traces painted on top, no sorting needed */}
            {traces.filter(t => activeTraceIds.has(t.id)).map(trace => {
                const pointsStr = trace.points.map(([px, py]) => `${px},${py}`).join(' ')
                return (
                    <polyline
                        key={`active-${trace.id}`}
                        points={pointsStr}
                        fill="none"
                        stroke="#ffd700"
                        strokeWidth={3}
                        strokeOpacity={1}
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        filter="url(#traceGlow)"
                    />
                )
            })}
        </g>
    )
}
