import type { AnswerRecord, AnswerStatistic, Player, Question, WheelPrize } from '../types'
import { generateAnswerStatistics } from '../data/players'

export const POINTS_PER_CORRECT = 100

export function calculateScore(answers: AnswerRecord[]): number {
  return answers.filter((a) => a.isCorrect).length * POINTS_PER_CORRECT
}

export function getAccuracy(answers: AnswerRecord[]): number {
  if (answers.length === 0) return 0
  const correct = answers.filter((a) => a.isCorrect).length
  return Math.round((correct / answers.length) * 100)
}

export function getWinner(leaderboard: Player[]): Player | null {
  if (leaderboard.length === 0) return null
  return leaderboard.reduce((best, p) => (p.score > best.score ? p : best), leaderboard[0])
}

export function applyRewardBonus(score: number, reward: WheelPrize | null): number {
  if (!reward) return score

  switch (reward) {
    case '10 Bonus':
      return score + 10
    case '20 Bonus':
      return score + 20
    case '50 Bonus':
      return score + 50
    case 'Double Score':
      return score * 2
    case 'Extra Life':
      return score + 50
    case 'Jackpot':
      return score + 500
    case 'Pit Stop Pass':
      return score + 75
    case 'Mystery Prize':
      return score + Math.floor(Math.random() * 100) + 25
    default:
      return score
  }
}

export function buildAnswerStatistics(
  question: Question,
  selectedIndex: number,
): AnswerStatistic[] {
  const percentages = generateAnswerStatistics(question.options.length, selectedIndex)
  const totalVotes = 20

  return question.options.map((label, index) => ({
    optionIndex: index,
    optionLabel: label,
    percentage: percentages[index],
    count: Math.round((percentages[index] / 100) * totalVotes),
  }))
}

export const WHEEL_PRIZES: WheelPrize[] = [
  '10 Bonus',
  '20 Bonus',
  '50 Bonus',
  'Double Score',
  'Extra Life',
  'Jackpot',
  'Pit Stop Pass',
  'Mystery Prize',
]

export function getRandomSpinParams(): { turns: number; targetIndex: number } {
  const targetIndex = Math.floor(Math.random() * WHEEL_PRIZES.length)
  const turns = 5 + Math.floor(Math.random() * 4)
  return { turns, targetIndex }
}
