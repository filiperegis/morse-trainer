import { useState, useCallback } from 'react'
import { MorseBoard } from './components/MorseBoard'
import { useMorse } from './hooks/useMorse'
import { useAudio } from './hooks/useAudio'
import { useMorseInput } from './hooks/useMorseInput'

export default function App() {
  const { sequence, confirmedLetter, isConfirmed, addSymbol } = useMorse()
  const { unlock, startTone, stopTone } = useAudio()
  const [isPressed, setIsPressed] = useState(false)

  const handlePressStart = useCallback(() => {
    setIsPressed(true)
    startTone()
  }, [startTone])

  const handlePressEnd = useCallback(() => {
    setIsPressed(false)
    stopTone()
  }, [stopTone])

  const { onButtonDown, onButtonUp } = useMorseInput({
    onDot: () => addSymbol('.'),
    onDash: () => addSymbol('-'),
    onPressStart: handlePressStart,
    onPressEnd: handlePressEnd,
    unlock,
  })

  return (
    <div
      style={{
        width: '100dvw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        overflow: 'hidden',
      }}
    >
      <MorseBoard
        sequence={sequence}
        confirmedLetter={confirmedLetter}
        isConfirmed={isConfirmed}
        isPressed={isPressed}
        onTouchStart={e => onButtonDown(e)}
        onTouchEnd={e => onButtonUp(e)}
        onMouseDown={e => onButtonDown(e)}
        onMouseUp={e => onButtonUp(e)}
      />
    </div>
  )
}
