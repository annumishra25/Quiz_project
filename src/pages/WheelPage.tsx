import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SpinningWheel } from '../components/SpinningWheel'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { PageLayout } from '../components/PageLayout'
import { useQuiz } from '../hooks/useQuiz'
import type { WheelPrize } from '../types'

export function WheelPage() {
  const { user, setReward, finishWheel } = useQuiz()
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  const handleComplete = useCallback(
    (prize: WheelPrize) => {
      if (hasNavigated.current) return

      setReward(prize)
      finishWheel()
      hasNavigated.current = true
      window.setTimeout(() => {
        navigate('/results')
      }, 1800)
    },
    [setReward, finishWheel, navigate],
  )

  if (!user) {
    return (
      <PageLayout title="Bonus Wheel">
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Bonus Wheel">
      <div className="flex flex-1 flex-col items-center justify-center py-8">
        <p className="mb-8 text-center text-sm uppercase tracking-widest text-white/50">
          Race complete - spin for your bonus reward
        </p>
        <SpinningWheel onComplete={handleComplete} />
      </div>
    </PageLayout>
  )
}
