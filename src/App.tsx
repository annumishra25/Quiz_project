import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { QuizProvider } from './context/QuizContext'
import { SettingsProvider } from './context/SettingsContext'
import { LoadingScreen } from './components/LoadingScreen'
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { LobbyPage } from './pages/LobbyPage'
import { QuizPage } from './pages/QuizPage'
import { WheelPage } from './pages/WheelPage'
import { ResultsPage } from './pages/ResultsPage'

export default function App() {
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 850)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <SettingsProvider>
      <QuizProvider>
        <AnimatePresence mode="wait">
          {isBooting ? (
            <LoadingScreen key="loading" />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route element={<GuestRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/lobby" element={<LobbyPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/wheel" element={<WheelPage />} />
                  <Route path="/results" element={<ResultsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          )}
        </AnimatePresence>
      </QuizProvider>
    </SettingsProvider>
  )
}
