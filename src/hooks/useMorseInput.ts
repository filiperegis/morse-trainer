import { useRef, useCallback } from 'react'

export const DOT_THRESHOLD = 250 // ms — press shorter than this = dot, longer = dash

interface MorseInputHandlers {
  onButtonDown: (e: React.TouchEvent | React.MouseEvent) => void
  onButtonUp: (e: React.TouchEvent | React.MouseEvent) => void
}

interface UseMorseInputOptions {
  onDot: () => void
  onDash: () => void
  onPressStart: () => void
  onPressEnd: () => void
  unlock: () => void
}

export function useMorseInput({
  onDot,
  onDash,
  onPressStart,
  onPressEnd,
  unlock,
}: UseMorseInputOptions): MorseInputHandlers {
  const pressStartRef = useRef<number | null>(null)
  const isMouseDown = useRef(false)

  const handleDown = useCallback(() => {
    // unlock() MUST be called synchronously here (iOS AudioContext requirement)
    unlock()
    pressStartRef.current = Date.now()
    onPressStart()
  }, [unlock, onPressStart])

  const handleUp = useCallback(() => {
    if (pressStartRef.current === null) return
    const duration = Date.now() - pressStartRef.current
    pressStartRef.current = null
    onPressEnd()
    if (duration < DOT_THRESHOLD) {
      onDot()
    } else {
      onDash()
    }
  }, [onDot, onDash, onPressEnd])

  const onButtonDown = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      // Prevent mouse events from firing after touch events on iOS
      if (e.type === 'mousedown') {
        if (isMouseDown.current) return
        isMouseDown.current = true
      }
      if (e.type === 'touchstart') {
        isMouseDown.current = false
        e.preventDefault()
      }
      handleDown()
    },
    [handleDown]
  )

  const onButtonUp = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (e.type === 'mouseup') {
        isMouseDown.current = false
      }
      if (e.type === 'touchend') {
        e.preventDefault()
      }
      handleUp()
    },
    [handleUp]
  )

  return { onButtonDown, onButtonUp }
}
