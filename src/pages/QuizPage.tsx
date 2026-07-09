import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AnswerStatisticsPopup } from '../components/AnswerStatisticsPopup'
import { LeaderboardPanel } from '../components/LeaderboardPanel'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useQuiz } from '../hooks/useQuiz'
import { useQuizKeyboard } from '../hooks/useQuizKeyboard'
import { useSoundEffects } from '../hooks/useSoundEffects'

const TIMER_MAX = 30;

function timerState(t: number) {
  if (t > 15) return { color: "#22c55e" };
  if (t > 7)  return { color: "#f59e0b" };
  return             { color: "#ef4444" };
}

export function QuizPage() {
  const navigate = useNavigate()
  const {
    user,
    phase,
    currentQuestionIndex,
    questions,
    score,
    leaderboard,
    submitAnswer,
    advanceFromLeaderboard,
    advanceFromStatistics,
    getCurrentQuestion,
    getAnswerStatistics,
  } = useQuiz()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX)
  const [shake, setShake] = useState(false)
  const { playCorrect, playWrong } = useSoundEffects()

  const question = getCurrentQuestion()
  const totalQuestions = questions.length

  const goToWheel = useCallback(() => {
    navigate('/wheel')
  }, [navigate])

  useEffect(() => {
    if (phase === 'wheel') {
      goToWheel()
    }
  }, [phase, goToWheel])

  useEffect(() => {
    if (phase !== 'question') return
    setSelectedAnswer(null)
    setRevealed(false)
    setTimeLeft(TIMER_MAX)
    setShake(false)
  }, [phase, currentQuestionIndex])

  useEffect(() => {
    if (phase !== 'leaderboard') return

    const timer = window.setTimeout(() => {
      advanceFromLeaderboard()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [phase, currentQuestionIndex, advanceFromLeaderboard])

  useEffect(() => {
    if (phase !== 'statistics') return

    const timer = window.setTimeout(() => {
      advanceFromStatistics()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [phase, currentQuestionIndex, advanceFromStatistics])

  const handleSelectAnswer = useCallback(
    (index: number) => {
      if (revealed || selectedAnswer !== null || !question) return

      setSelectedAnswer(index)
      setRevealed(true)
      if (index === question.correctAnswer) {
        playCorrect()
      } else {
        playWrong()
      }

      window.setTimeout(() => {
        submitAnswer(index)
      }, 2000)
    },
    [playCorrect, playWrong, question, revealed, selectedAnswer, submitAnswer],
  )

  useQuizKeyboard(question?.options.length ?? 0, phase !== 'question' || revealed, handleSelectAnswer)

  const handleTimerExpire = useCallback(() => {
    if (!question || revealed || selectedAnswer !== null) return

    const fallbackAnswer = question.options.findIndex(
      (_, index) => index !== question.correctAnswer,
    )
    handleSelectAnswer(fallbackAnswer >= 0 ? fallbackAnswer : 0)
  }, [handleSelectAnswer, question, revealed, selectedAnswer])

  useEffect(() => {
    if (phase !== 'question' || revealed || !question) return
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShake(true)
          setTimeout(() => setShake(false), 600)
          handleTimerExpire()
          return TIMER_MAX
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase, revealed, currentQuestionIndex, question, handleTimerExpire])

  if (!user) {
    return (
      <div className="min-h-screen bg-[#040004] text-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  const { color } = timerState(timeLeft)
  const pct = (timeLeft / TIMER_MAX) * 100

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Oswald:wght@400;600;700&display=swap');
        .quiz-root { min-height:100vh; width:100%; background:#040004; font-family:'Oswald',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden; }
        .quiz-bg   { position:fixed; inset:0; background:radial-gradient(ellipse 90% 70% at 65% 45%, #1c0010 0%, #0a0008 50%, #020002 100%); z-index:0; }
        .opt { display:flex; align-items:center; gap:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:13px; padding:13px 18px; color:rgba(255,255,255,0.85); font-family:'Oswald',sans-serif; font-size:clamp(0.85rem,2vw,0.98rem); text-align:left; cursor:pointer; width:100%; transition:background .2s,border-color .2s; }
        .opt:hover:not(:disabled) { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); }
        .opt:disabled { cursor:default; }
        .opt.correct { background:rgba(34,197,94,0.14); border-color:rgba(34,197,94,0.6); color:#fff; }
        .opt.wrong   { background:rgba(239,68,68,0.14);  border-color:rgba(239,68,68,0.55); color:#fff; }
        .opt.correct .badge { background:rgba(34,197,94,0.3); }
        .opt.wrong   .badge { background:rgba(239,68,68,0.3); }
        .badge { min-width:28px; height:28px; border-radius:50%; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; font-size:0.78rem; color:rgba(255,255,255,0.5); flex-shrink:0; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        .shake { animation:shake .5s ease; }
        @media(max-width:600px){ .spider-sticker{width:240px!important;height:320px!important;right:-50px!important;} }
      `}</style>

      <div className="quiz-root">
        <div className="quiz-bg" />

        {/* Web SVG background */}
        <svg style={{ position:"fixed", inset:0, width:"100%", height:"100%", opacity:0.08, zIndex:0, pointerEvents:"none" }}>
          {["0% 0%","25% 0%","50% 0%","75% 0%","100% 0%","100% 25%","100% 50%","100% 75%","100% 100%","50% 100%","0% 100%","0% 50%"].map((pt, i) => {
            const [x2, y2] = pt.split(" ");
            return <line key={i} x1="50%" y1="50%" x2={x2} y2={y2} stroke="#e00" strokeWidth="1" />;
          })}
          {[12,25,38,52,68].map(r => (
            <ellipse key={r} cx="50%" cy="50%" rx={`${r}%`} ry={`${r}%`} fill="none" stroke="#e00" strokeWidth="1" />
          ))}
        </svg>

        {/* Spider-Man sticker */}
        <div className="spider-sticker" style={{
          position:"fixed", right:-80, bottom:-30, width:500, height:620, zIndex:1,
          borderRadius:"50% 50% 38% 38%", overflow:"hidden",
          transform:"perspective(900px) rotateY(-10deg) rotateX(5deg)",
          filter:"drop-shadow(-14px -14px 50px rgba(220,0,60,0.6)) drop-shadow(0 0 100px rgba(140,0,40,0.35))",
        }}>
          <img
            src="https://images.unsplash.com/photo-1635805737707-575885ab0820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80"
            alt="Spider-Man"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }}
          />
          {/* Gloss */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.05) 40%,transparent 65%)", zIndex:2, pointerEvents:"none" }} />
          {/* Edge glow */}
          <div style={{ position:"absolute", inset:0, border:"2px solid rgba(255,60,60,0.35)", borderRadius:"inherit", boxShadow:"inset 0 0 40px rgba(255,0,50,0.12)", zIndex:3, pointerEvents:"none" }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-3xl px-4 py-8 flex flex-col items-center">
          {/* Title */}
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(0.6rem,1.5vw,0.8rem)", letterSpacing:"0.5em", color:"rgba(255,100,100,0.65)", textTransform:"uppercase", marginBottom:6, textAlign:"center" }}>
            ✦ Enter the Web ✦
          </div>
          <h1 style={{
            fontFamily:"'Cinzel',serif", fontSize:"clamp(2.5rem,8vw,5.5rem)", fontWeight:900,
            lineHeight:1, textAlign:"center", letterSpacing:"0.04em", margin:0, marginBottom:4,
            background:"linear-gradient(135deg,#ff1818 0%,#ffffff 45%,#ff7070 72%,#aa0000 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            filter:"drop-shadow(0 0 28px rgba(255,20,20,0.65))",
          }}>
            Spider World
          </h1>
          <div style={{ fontSize:"clamp(0.65rem,1.5vw,0.85rem)", letterSpacing:"0.4em", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:28 }}>
            Quiz Challenge
          </div>

          <AnimatePresence mode="wait">
            {phase === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center py-4"
              >
                <div style={{
                  width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,50,50,0.2)",
                  borderRadius:22, padding:"32px 32px 28px", backdropFilter:"blur(22px)",
                  boxShadow:"0 8px 60px rgba(200,0,50,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                  <LeaderboardPanel players={leaderboard} currentUsername={user} />
                  <p className="mt-6 text-center text-sm uppercase tracking-widest text-white/40" aria-live="polite">
                    Loading statistics...
                  </p>
                </div>
              </motion.div>
            )}

            {phase === 'statistics' && (
              <motion.div
                key="statistics-bg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center py-4 relative"
              >
                <div style={{
                  width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,50,50,0.2)",
                  borderRadius:22, padding:"32px 32px 28px", backdropFilter:"blur(22px)",
                  boxShadow:"0 8px 60px rgba(200,0,50,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                  <LeaderboardPanel players={leaderboard} currentUsername={user} />
                </div>
                <AnswerStatisticsPopup
                  statistics={getAnswerStatistics()}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={totalQuestions}
                  correctAnswerIndex={question?.correctAnswer}
                />
              </motion.div>
            )}

            {phase === 'question' && question && (
              <motion.div
                key={`question-${question.id}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {/* Main Card */}
                <div style={{
                  width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,50,50,0.2)",
                  borderRadius:22, padding:"32px 32px 28px", backdropFilter:"blur(22px)",
                  boxShadow:"0 8px 60px rgba(200,0,50,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}>
                  {/* Top bar */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem", letterSpacing:"0.1em" }}>Q {currentQuestionIndex+1} / {totalQuestions}</div>
                    
                    {/* Timer Countdown */}
                    <div className={shake ? "shake" : ""} style={{
                      display:"flex", alignItems:"center", gap:8, background:"rgba(0,0,0,0.4)",
                      border:`1px solid ${color}55`, borderRadius:50, padding:"6px 16px",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke={color} strokeWidth="1.5"/>
                        <path d="M7 4v3.5l2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span style={{ color, fontWeight:700, fontSize:"1.1rem", fontVariantNumeric:"tabular-nums", minWidth:26, textAlign:"center" }}>{timeLeft}s</span>
                    </div>

                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem" }}>Score: <span style={{ color:"#fff", fontWeight:700 }}>{score} pts</span></div>
                  </div>

                  {/* Timer progress bar */}
                  <div style={{ height:4, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginBottom:24 }}>
                    <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background:`linear-gradient(90deg,${color},${color}aa)`, boxShadow:`0 0 10px ${color}`, transition:"width 1s linear, background 0.4s, box-shadow 0.4s" }} />
                  </div>

                  {/* Question Title */}
                  <div style={{ fontSize:"clamp(1.1rem,2.5vw,1.38rem)", fontWeight:600, color:"#fff", lineHeight:1.55, marginBottom:22, minHeight:58 }}>
                    {question.question}
                  </div>

                  {/* Options */}
                  <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                    {question.options.map((option, index) => {
                      const isCorrect = index === question.correctAnswer
                      const isSelected = selectedAnswer === index
                      const showResult = revealed

                      let cls = "opt"
                      if (showResult && isCorrect) cls += " correct"
                      else if (showResult && isSelected) cls += " wrong"

                      return (
                        <button
                          key={option}
                          className={cls}
                          disabled={revealed}
                          onClick={() => handleSelectAnswer(index)}
                        >
                          <span className="badge">
                            {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {/* Score helper overlay status */}
                  {revealed && (
                    <motion.p
                      className="mt-6 text-center text-sm uppercase tracking-widest text-[#ff6464] font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      aria-live="polite"
                    >
                      {selectedAnswer === question.correctAnswer
                        ? 'Correct! Standings updating...'
                        : 'Incorrect! Standings updating...'}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
