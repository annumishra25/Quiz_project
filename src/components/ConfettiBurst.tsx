import { motion } from 'framer-motion'

const pieces = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  left: `${6 + ((index * 17) % 88)}%`,
  delay: (index % 9) * 0.07,
  color: index % 3 === 0 ? '#E10600' : index % 3 === 1 ? '#00DBE9' : '#FACC15',
  width: index % 2 === 0 ? 6 : 4,
}))

export function ConfettiBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-[-24px] rounded-full"
          style={{
            left: piece.left,
            width: piece.width,
            height: piece.width * 2,
            backgroundColor: piece.color,
          }}
          initial={{ y: -24, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 720 }}
          transition={{ duration: 2.4, delay: piece.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
