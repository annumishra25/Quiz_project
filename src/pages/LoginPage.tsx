import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import { PageLayout } from '../components/PageLayout'
import { CHARACTERS, type Character } from '../data/characters'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0])
  const [inputFocused, setInputFocused] = useState(false)
  const [error, setError] = useState('')
  const { login } = useQuiz()
  const navigate = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = username.trim()

    if (trimmed.length < 3) {
      setError('Explorer name must be at least 3 characters.')
      return
    }

    setError('')
    // Store both emoji and color in the user avatar string
    login(trimmed, `${selectedChar.emoji}|${selectedChar.color}`)
    navigate('/lobby')
  }

  return (
    <PageLayout isUnderwater={true}>
      <div
        className="flex flex-1 flex-col items-center justify-center py-4 relative z-10"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Logo Header */}
        <header
          className="text-center mb-6"
          style={{ animation: 'float-ui 4.5s ease-in-out infinite' }}
        >
          <div className="flex items-center justify-center gap-3 mb-1 select-none">
            <span className="text-4xl">🐠</span>
            <h1
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: 'clamp(1.9rem, 5vw, 2.7rem)',
                color: '#00e5ff',
                animation: 'logo-glow 3s ease-in-out infinite',
                letterSpacing: '0.04em',
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              AquaVerse
            </h1>
            <span className="text-4xl">🐠</span>
          </div>
          <p
            className="font-bold"
            style={{
              color: 'rgba(100, 220, 255, 0.6)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
            }}
          >
            UNDERWATER ADVENTURE LOBBY
          </p>
        </header>

        {/* Glass Card */}
        <main
          className="w-full max-w-xl rounded-3xl p-6 sm:p-8"
          style={{
            background: 'rgba(4, 18, 46, 0.62)',
            backdropFilter: 'blur(32px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
            border: '1px solid rgba(0, 185, 255, 0.22)',
            boxShadow: '0 8px 70px rgba(0, 70, 200, 0.38), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,100,210,0.1)',
            animation: 'float-card 6s ease-in-out infinite',
          }}
        >
          {/* Welcome Info */}
          <div className="text-center mb-6">
            <h2
              className="text-white"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: 'clamp(1.2rem, 4vw, 1.75rem)',
                textShadow: '0 0 22px rgba(0,215,255,0.45)',
                marginBottom: '0.4rem',
                lineHeight: 1.2,
                fontWeight: 700,
              }}
            >
              Dive Into the Adventure! 🌊
            </h2>
            <p className="font-semibold text-sm" style={{ color: 'rgba(135,210,255,0.72)' }}>
              Pick your sea companion and set sail for glory
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Explorer name input */}
            <div className="mb-5">
              <Label>YOUR EXPLORER NAME</Label>
              <div className="relative mt-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (error) setError('')
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Enter your name…"
                  maxLength={20}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '16px',
                    background: inputFocused
                      ? 'rgba(0, 85, 165, 0.48)'
                      : 'rgba(0, 40, 95, 0.42)',
                    border: `1.5px solid ${inputFocused ? 'rgba(0, 215, 255, 0.65)' : 'rgba(0, 145, 205, 0.28)'}`,
                    boxShadow: inputFocused
                      ? '0 0 28px rgba(0,215,255,0.22), inset 0 1px 0 rgba(255,255,255,0.06)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                    color: 'white',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    transition: 'all 0.25s ease',
                    display: 'block',
                  }}
                />
                {inputFocused && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 120%, rgba(0,215,255,0.08) 0%, transparent 68%)',
                    }}
                  />
                )}
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400 font-semibold" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Character selection grid */}
            <div className="mb-5">
              <Label>CHOOSE YOUR SEA COMPANION</Label>
              <div
                className="mt-3"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))',
                  gap: '10px',
                }}
              >
                {CHARACTERS.map((char) => (
                  <CharCard
                    key={char.id}
                    char={char}
                    isSelected={selectedChar.id === char.id}
                    onSelect={() => setSelectedChar(char)}
                  />
                ))}
              </div>
            </div>

            {/* Live profile preview */}
            <ProfilePreview username={username} char={selectedChar} />

            {/* Submit Button */}
            <div className="relative mt-5">
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '18px',
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: '1.15rem',
                  letterSpacing: '0.06em',
                  color: 'white',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #0078ff 50%, #003ec0 100%)',
                  border: '1px solid rgba(0, 205, 255, 0.42)',
                  animation: 'pulse-btn 2.8s ease-in-out infinite',
                  transition: 'transform 0.15s ease, filter 0.15s ease',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.015)'
                  e.currentTarget.style.filter = 'brightness(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.filter = ''
                }}
              >
                🌊 Dive In! 🌊
              </button>
            </div>
          </form>
        </main>
      </div>
    </PageLayout>
  )
}

// ─── Label Helper ─────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-extrabold"
      style={{
        color: 'rgba(0, 215, 255, 0.72)',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {children}
    </p>
  )
}

// ─── Character Card ───────────────────────────────────────────
function CharCard({
  char,
  isSelected,
  onSelect,
}: {
  char: Character
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={
        {
          '--gc': char.color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          padding: '10px 6px 8px',
          borderRadius: '16px',
          background: isSelected ? 'rgba(0, 18, 48, 0.88)' : 'rgba(0, 14, 40, 0.56)',
          border: `2px solid ${isSelected ? char.color : 'rgba(0, 155, 225, 0.18)'}`,
          boxShadow: isSelected
            ? `0 0 20px ${char.color}55, 0 0 50px ${char.color}1a, 0 4px 18px rgba(0,0,0,0.38)`
            : '0 2px 10px rgba(0,0,0,0.28)',
          transform: isSelected ? 'translateY(-3px) scale(1.07)' : 'scale(1)',
          transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
          outline: 'none',
          animation: isSelected ? 'glow-selected 2.2s ease-in-out infinite' : 'none',
          cursor: 'pointer',
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.04)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 14px ${char.color}33, 0 4px 16px rgba(0,0,0,0.32)`;
          (e.currentTarget as HTMLButtonElement).style.border = `2px solid ${char.color}55`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px rgba(0,0,0,0.28)';
          (e.currentTarget as HTMLButtonElement).style.border = '2px solid rgba(0,155,225,0.18)';
        }
      }}
    >
      {/* Emoji Circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          background: isSelected
            ? `radial-gradient(circle, ${char.color}38, ${char.color}10)`
            : 'rgba(255,255,255,0.07)',
          border: `1.5px solid ${isSelected ? char.color + '66' : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.2s ease',
        }}
      >
        {char.emoji}
      </div>

      {/* Name */}
      <span
        className="font-extrabold"
        style={{
          color: isSelected ? char.color : 'rgba(168, 215, 255, 0.75)',
          fontSize: '0.59rem',
          textAlign: 'center',
          lineHeight: 1.25,
          fontFamily: "'Nunito', sans-serif",
          transition: 'color 0.2s ease',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {char.name}
      </span>

      {/* Role */}
      <span
        className="font-bold"
        style={{
          color: isSelected ? `${char.color}99` : 'rgba(100, 160, 220, 0.48)',
          fontSize: '0.51rem',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {char.role}
      </span>
    </button>
  )
}

// ─── Profile Preview ──────────────────────────────────────────
function ProfilePreview({ username, char }: { username: string; char: Character }) {
  const displayName = username.trim() || 'Explorer'

  return (
    <div
      style={{
        borderRadius: '18px',
        padding: '16px 18px',
        background: 'rgba(0, 14, 40, 0.56)',
        border: '1px solid rgba(0, 155, 225, 0.2)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <Label>LIVE PROFILE PREVIEW</Label>

      <div className="flex items-center gap-4 mt-3">
        {/* Avatar */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            flexShrink: 0,
            background: `radial-gradient(circle, ${char.color}2e, ${char.color}0c)`,
            border: `2px solid ${char.color}58`,
            boxShadow: `0 0 20px ${char.color}35`,
            transition: 'all 0.3s ease',
          }}
        >
          {char.emoji}
        </div>

        {/* Text Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="text-white font-bold"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontSize: '1.08rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '2px',
              transition: 'all 0.2s ease',
            }}
          >
            {displayName}
          </div>
          <div
            className="font-bold"
            style={{
              fontSize: '0.72rem',
              color: char.color,
              marginBottom: '6px',
              transition: 'color 0.3s ease',
            }}
          >
            {char.name} · {char.role}
          </div>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#00ff88',
                animation: 'status-pulse 2s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <span
              className="font-semibold"
              style={{
                fontSize: '0.65rem',
                color: 'rgba(140,210,255,0.58)',
              }}
            >
              Ready to dive
            </span>
          </div>
        </div>

        {/* Badge */}
        <div className="text-right shrink-0">
          <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>🌊</div>
          <div
            className="font-bold"
            style={{
              fontSize: '0.58rem',
              color: 'rgba(100,200,255,0.52)',
              letterSpacing: '0.1em',
              marginTop: '3px',
            }}
          >
            LVL 1
          </div>
        </div>
      </div>
    </div>
  )
}
