import { useCallback, useRef } from 'react'
import { useSettings } from './useSettings'

/** Placeholder sound hooks - wire to audio assets when available. */
export function useSoundEffects() {
  const { soundEnabled } = useSettings()
  const enabledRef = useRef(true)
  enabledRef.current = soundEnabled

  const play = useCallback((src: string) => {
    if (!enabledRef.current) return
    void src
    // Placeholder: new Audio(src).play()
  }, [])

  const playCorrect = useCallback(() => play('/sounds/correct.mp3'), [play])
  const playWrong = useCallback(() => play('/sounds/wrong.mp3'), [play])
  const playTick = useCallback(() => play('/sounds/tick.mp3'), [play])
  const playSpin = useCallback(() => play('/sounds/spin.mp3'), [play])
  const playWin = useCallback(() => play('/sounds/win.mp3'), [play])

  return { playCorrect, playWrong, playTick, playSpin, playWin }
}
