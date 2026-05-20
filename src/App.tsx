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

  const { onPointerDown, onPointerUp, onPointerCancel, onPointerLeave } = useMorseInput({
    onDot: () => addSymbol('.'),
    onDash: () => addSymbol('-'),
    onPressStart: handlePressStart,
    onPressEnd: handlePressEnd,
    unlock,
  })

  return (
    <div className="app">
      <MorseBoard
        sequence={sequence}
        confirmedLetter={confirmedLetter}
        isConfirmed={isConfirmed}
        isPressed={isPressed}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
      />
    </div>
  )
}
