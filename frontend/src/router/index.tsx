import { Routes, Route } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Dashboard from '../pages/Dashboard'
import Documents from '../pages/Documents'
import Chat from '../pages/Chat'
import Summary from '../pages/Summary'
import Quiz from '../pages/Quiz'
import Flashcards from '../pages/Flashcards'
import Focus from '../pages/Focus'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route path="/"            element={<Dashboard />} />
        <Route path="/documents"   element={<Documents />} />
        <Route path="/chat"        element={<Chat />} />
        <Route path="/summary"     element={<Summary />} />
        <Route path="/quiz"        element={<Quiz />} />
        <Route path="/flashcards"  element={<Flashcards />} />
        <Route path="/focus"       element={<Focus />} />
        <Route path="/settings"    element={<Settings />} />
      </Route>
    </Routes>
  )
}