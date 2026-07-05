import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { WheelPrize } from '../types'
import { WHEEL_PRIZES, getRandomSpinParams } from '../utils/quizHelpers'
import { useSoundEffects } from '../hooks/useSoundEffects'

interface SpinningWheelProps {
  onComplete: (prize: WheelPrize) => void
}

const SEGMENT_ANGLE = 360 / WHEEL_PRIZES.length

const SEGMENT_COLORS = [
  '#E10600',
  '#1a1a1a',
  '#00dbe9',
  '#E10600',
  '#2a2a2a',
  '#E10600',
  '#1a1a1a',
  '#3b0b0b',
]

const CONFETTI = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 13) % 84)}%`,
  delay: (index % 7) * 0.08,
  color: index % 3 === 0 ? '#E10600' : index % 3 === 1 ? '#00dbe9' : '#facc15',
}))

export function SpinningWheel({ onComplete }: SpinningWheelProps) {
  const [spinParams, setSpinParams] = useState(getRandomSpinParams)
  const [isSpinning, setIsSpinning] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)
  const [winningPrize, setWinningPrize] = useState<WheelPrize | null>(null)
  const { playSpin, playWin } = useSoundEffects()

  const { turns, targetIndex } = spinParams
  const finalRotation =
    turns * 360 + (360 - targetIndex * SEGMENT_ANGLE - SEGMENT_ANGLE / 2)

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const handleSpin = () => {
    if (isSpinning || hasFinished) return

    const nextSpin = getRandomSpinParams()
    setSpinParams(nextSpin)
    setIsSpinning(true)
    setWinningPrize(null)
    playSpin()

    window.setTimeout(() => {
      const prize = WHEEL_PRIZES[nextSpin.targetIndex]
      setWinningPrize(prize)
      setHasFinished(true)
      setIsSpinning(false)
      playWin()
      onCompleteRef.current(prize)
    }, 5000)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <div
          className="absolute -top-4 left-1/2 z-10 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="h-0 w-0 border-x-[12px] border-t-[20px] border-x-transparent border-t-f1-cyan drop-shadow-[0_0_8px_rgba(0,219,233,0.8)]" />
        </div>

        {hasFinished && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full" aria-hidden="true">
            {CONFETTI.map((piece) => (
              <motion.span
                key={piece.id}
                className="absolute top-1 h-2 w-1 rounded-full"
                style={{ left: piece.left, backgroundColor: piece.color }}
                initial={{ y: -20, opacity: 0, rotate: 0 }}
                animate={{ y: 340, opacity: [0, 1, 0], rotate: 540 }}
                transition={{ duration: 1.6, delay: piece.delay, repeat: 1 }}
              />
            ))}
          </div>
        )}

        <motion.div
          className="relative h-72 w-72 rounded-full border-4 border-white/20 neon-glow sm:h-80 sm:w-80"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: isSpinning || hasFinished ? finalRotation : 0 }}
          transition={{ duration: 5, ease: [0.17, 0.67, 0.12, 0.99] }}
          aria-label="Prize spinning wheel"
          role="img"
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {WHEEL_PRIZES.map((prize, index) => {
              const startAngle = index * SEGMENT_ANGLE - 90
              const endAngle = startAngle + SEGMENT_ANGLE
              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180
              const x1 = 100 + 100 * Math.cos(startRad)
              const y1 = 100 + 100 * Math.sin(startRad)
              const x2 = 100 + 100 * Math.cos(endRad)
              const y2 = 100 + 100 * Math.sin(endRad)
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0
              const midAngle = startAngle + SEGMENT_ANGLE / 2
              const midRad = (midAngle * Math.PI) / 180
              const textX = 100 + 65 * Math.cos(midRad)
              const textY = 100 + 65 * Math.sin(midRad)

              return (
                <g key={prize}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={SEGMENT_COLORS[index]}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                  >
                    {prize}
                  </text>
                </g>
              )
            })}
            <circle cx="100" cy="100" r="12" fill="#0B0B0B" stroke="#E10600" strokeWidth="3" />
          </svg>
          <button
            type="button"
            onClick={handleSpin}
            disabled={isSpinning || hasFinished}
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/20 bg-[#090909]/95 font-display text-xs font-bold uppercase italic text-white shadow-[0_0_24px_rgba(225,6,0,0.42)] transition hover:border-f1-cyan hover:text-f1-cyan focus:outline-none focus:ring-2 focus:ring-f1-cyan/70 disabled:cursor-default disabled:opacity-90"
            aria-label="Spin prize wheel"
          >
            <Sparkles className="mb-1 h-5 w-5" aria-hidden="true" />
            {hasFinished ? 'Won' : isSpinning ? 'Spin' : 'Launch'}
          </button>
        </motion.div>
      </div>

      {hasFinished && winningPrize && (
        <motion.div
          className="glass-panel neon-glow-cyan px-8 py-4 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <p className="text-sm uppercase tracking-widest text-white/60">You won</p>
          <p className="font-display text-3xl font-bold italic text-f1-cyan">{winningPrize}</p>
        </motion.div>
      )}

      {!hasFinished && (
        <p className="text-sm uppercase tracking-widest text-white/50" aria-live="polite">
          {isSpinning ? 'Spinning...' : 'Tap launch to release the reward'}
        </p>
      )}
    </div>
  )
}
