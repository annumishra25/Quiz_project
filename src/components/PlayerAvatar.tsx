import { getInitials } from '../data/players'

interface PlayerAvatarProps {
  avatar: string | null
  username: string
  sizePx?: number
  fontSize?: string
}

export function PlayerAvatar({ avatar, username, sizePx = 40, fontSize = '1rem' }: PlayerAvatarProps) {
  const parseAvatar = (avatarStr: string | null) => {
    if (!avatarStr) return { isEmoji: false, val: 'bg-f1-red', color: '' }
    if (avatarStr.includes('|')) {
      const [emoji, color] = avatarStr.split('|')
      return { isEmoji: true, val: emoji, color }
    }
    if (!avatarStr.startsWith('bg-')) {
      return { isEmoji: true, val: avatarStr, color: '#00d4ff' }
    }
    return { isEmoji: false, val: avatarStr, color: '' }
  }

  const { isEmoji, val, color } = parseAvatar(avatar)

  if (isEmoji) {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0 select-none bg-white/10"
        style={{
          width: sizePx,
          height: sizePx,
          fontSize,
          border: `1.5px solid ${color || '#00d4ff'}58`,
          boxShadow: `0 0 10px ${color || '#00d4ff'}35`,
        }}
        aria-hidden="true"
      >
        {val}
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 font-bold text-white select-none ${val}`}
      style={{
        width: sizePx,
        height: sizePx,
        fontSize,
      }}
      aria-hidden="true"
    >
      {getInitials(username)}
    </div>
  )
}
