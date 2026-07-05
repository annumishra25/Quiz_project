import type { Player } from '../types'

const DRIVER_NAMES = [
  'HamiltonFan42',
  'VerstappenMax',
  'Leclerc16',
  'NorrisLando',
  'Sainz55',
  'Russell63',
  'Perez11',
  'Alonso14',
  'Stroll18',
  'Gasly10',
  'Ocon31',
  'Tsunoda22',
  'Bottas77',
  'Ricciardo3',
  'Hulkenberg27',
  'Magnussen20',
  'Albon23',
  'Zhou24',
  'Sargeant2',
  'Piastri81',
]

const AVATAR_COLORS = [
  'bg-red-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-purple-600',
  'bg-cyan-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-indigo-600',
  'bg-teal-600',
]

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export function generateMockPlayers(currentUser: string, currentUserAvatar = getAvatarColor(1)): Player[] {
  const otherNames = DRIVER_NAMES.filter((n) => n.toLowerCase() !== currentUser.toLowerCase())
  const shuffled = [...otherNames].sort(() => Math.random() - 0.5).slice(0, 19)

  const players: Player[] = [
    {
      id: 'host',
      username: 'RaceControl',
      score: 0,
      avatar: getAvatarColor(0),
      isHost: true,
    },
    {
      id: 'current-user',
      username: currentUser,
      score: 0,
      avatar: currentUserAvatar,
      isCurrentUser: true,
    },
    ...shuffled.map((name, i) => ({
      id: `player-${i}`,
      username: name,
      score: Math.floor(Math.random() * 1200) + 100,
      avatar: getAvatarColor(i + 2),
    })),
  ]

  return players
}

export function updateLeaderboardScores(
  players: Player[],
  currentUser: string,
  userScore: number,
): Player[] {
  return players
    .map((p) =>
      p.isCurrentUser || p.username.toLowerCase() === currentUser.toLowerCase()
        ? { ...p, score: userScore }
        : {
            ...p,
            score: p.isHost ? 0 : p.score + Math.floor(Math.random() * 150),
          },
    )
    .sort((a, b) => b.score - a.score)
}

export function generateAnswerStatistics(
  optionCount: number,
  selectedIndex: number,
): number[] {
  const weights = Array.from({ length: optionCount }, () => Math.random() + 0.1)
  weights[selectedIndex] += 0.5
  const total = weights.reduce((sum, w) => sum + w, 0)
  const percentages = weights.map((w) => Math.round((w / total) * 100))

  const diff = 100 - percentages.reduce((sum, p) => sum + p, 0)
  percentages[selectedIndex] += diff

  return percentages
}
