import { useEffect, useRef } from 'react'

export function useQuizKeyboard(
  optionCount: number,
  disabled: boolean,
  onSelect: (index: number) => void,
) {
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase()
      const index = key.charCodeAt(0) - 65
      if (index >= 0 && index < optionCount) {
        e.preventDefault()
        onSelectRef.current(index)
        return
      }

      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= optionCount) {
        e.preventDefault()
        onSelectRef.current(num - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [optionCount, disabled])
}

export function usePreventDoubleSubmit() {
  const submittingRef = useRef(false)

  const guard = <T extends unknown[]>(fn: (...args: T) => void) => {
    return (...args: T) => {
      if (submittingRef.current) return
      submittingRef.current = true
      fn(...args)
    }
  }

  const reset = () => {
    submittingRef.current = false
  }

  return { guard, reset, isSubmitting: () => submittingRef.current }
}
