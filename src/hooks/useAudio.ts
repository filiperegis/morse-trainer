import { useRef, useCallback } from 'react'

type AudioState = {
  ctx: AudioContext | null
  gainNode: GainNode | null
  oscillator: OscillatorNode | null
  unlocked: boolean
}

export function useAudio() {
  const state = useRef<AudioState>({
    ctx: null,
    gainNode: null,
    oscillator: null,
    unlocked: false,
  })

  const ensureContext = useCallback(() => {
    if (!state.current.ctx) {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0
      gainNode.connect(ctx.destination)
      state.current.ctx = ctx
      state.current.gainNode = gainNode

      // iOS interrupted state recovery
      ctx.addEventListener('statechange', () => {
        if (ctx.state === 'interrupted') {
          ctx.resume().catch(() => undefined)
        }
      })
    }
    return state.current.ctx
  }, [])

  /**
   * Must be called SYNCHRONOUSLY inside a touchstart handler.
   * Creates AudioContext on first call (browser requires user gesture).
   */
  const unlock = useCallback(() => {
    const ctx = ensureContext()
    if (ctx.state === 'suspended') {
      // Fire-and-forget resume — we need it synchronous for iOS
      ctx.resume().catch(() => undefined)
    }
    state.current.unlocked = true
  }, [ensureContext])

  const startTone = useCallback(() => {
    const ctx = ensureContext()
    const { gainNode } = state.current

    // Stop any previous oscillator
    if (state.current.oscillator) {
      try { state.current.oscillator.stop() } catch { /* already stopped */ }
      state.current.oscillator.disconnect()
      state.current.oscillator = null
    }

    if (!gainNode) return

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 700
    osc.connect(gainNode)
    osc.start()
    state.current.oscillator = osc

    const now = ctx.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.005)
  }, [ensureContext])

  const stopTone = useCallback(() => {
    const { ctx, gainNode, oscillator } = state.current
    if (!ctx || !gainNode || !oscillator) return

    const now = ctx.currentTime
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(gainNode.gain.value, now)
    gainNode.gain.linearRampToValueAtTime(0, now + 0.01)

    const osc = oscillator
    state.current.oscillator = null
    setTimeout(() => {
      try { osc.stop() } catch { /* already stopped */ }
      osc.disconnect()
    }, 20)
  }, [])

  return { unlock, startTone, stopTone }
}
