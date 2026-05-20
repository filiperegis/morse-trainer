import { useState, useRef, useCallback } from 'react'
import { getNodeByCode } from '../data/morseTree'

export const LETTER_TIMEOUT = 1200
export const CONFIRMED_DISPLAY_DURATION = 800

interface MorseState {
  sequence: string
  confirmedLetter: string
  isConfirmed: boolean
}

export function useMorse() {
  const [state, setState] = useState<MorseState>({
    sequence: '',
    confirmedLetter: '',
    isConfirmed: false,
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const addSymbol = useCallback((symbol: '.' | '-') => {
    clearTimer()

    // Cancel any pending confirm-clear timer so it cannot wipe the new sequence
    if (confirmTimerRef.current !== null) {
      clearTimeout(confirmTimerRef.current)
      confirmTimerRef.current = null
    }

    setState(prev => ({
      // Start fresh after a confirmed letter; otherwise append
      sequence: (prev.isConfirmed ? '' : prev.sequence) + symbol,
      confirmedLetter: '',
      isConfirmed: false,
    }))

    // Start letter-timeout
    timerRef.current = setTimeout(() => {
      setState(prev => {
        const node = getNodeByCode(prev.sequence)
        const letter = node?.letter ?? '?'

        // Clear confirm display after duration
        confirmTimerRef.current = setTimeout(() => {
          setState(s => ({ ...s, confirmedLetter: '', sequence: '', isConfirmed: false }))
        }, CONFIRMED_DISPLAY_DURATION)

        return { sequence: prev.sequence, confirmedLetter: letter, isConfirmed: true }
      })
    }, LETTER_TIMEOUT)
  }, [clearTimer])

  const reset = useCallback(() => {
    clearTimer()
    if (confirmTimerRef.current !== null) {
      clearTimeout(confirmTimerRef.current)
      confirmTimerRef.current = null
    }
    setState({ sequence: '', confirmedLetter: '', isConfirmed: false })
  }, [clearTimer])

  return {
    sequence: state.sequence,
    confirmedLetter: state.confirmedLetter,
    isConfirmed: state.isConfirmed,
    addSymbol,
    reset,
  }
}
