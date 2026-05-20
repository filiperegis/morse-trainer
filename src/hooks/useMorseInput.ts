import { useRef, useCallback } from 'react'

export const DOT_THRESHOLD = 250 // ms — press shorter than this = dot, longer = dash

interface MorseInputHandlers {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerCancel: (e: React.PointerEvent) => void
  onPointerLeave: (e: React.PointerEvent) => void
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

  // Registers a press end and emits dot or dash based on elapsed time
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

  // Stops the press without registering a symbol (OS-interrupted gesture)
  const handleAbort = useCallback(() => {
    if (pressStartRef.current === null) return
    pressStartRef.current = null
    onPressEnd()
  }, [onPressEnd])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // setPointerCapture delivers pointerup/pointercancel to this element
      // even if the pointer moves outside — prevents stuck-pressed state
      e.currentTarget.setPointerCapture(e.pointerId)
      // unlock() MUST be called synchronously here (iOS AudioContext requirement)
      unlock()
      pressStartRef.current = Date.now()
      onPressStart()
    },
    [unlock, onPressStart]
  )

  const onPointerUp = useCallback(
    (_e: React.PointerEvent) => {
      handleUp()
    },
    [handleUp]
  )

  const onPointerCancel = useCallback(
    (_e: React.PointerEvent) => {
      // OS interrupted the gesture (notification, incoming call, etc.)
      // Stop audio but don't register a symbol
      handleAbort()
    },
    [handleAbort]
  )

  const onPointerLeave = useCallback(
    (_e: React.PointerEvent) => {
      // Safety fallback: fires if pointer capture was lost and finger left the element
      handleUp()
    },
    [handleUp]
  )

  return { onPointerDown, onPointerUp, onPointerCancel, onPointerLeave }
}
