import { Timer } from 'lucide-react'
import Pomodoro from '../components/dashboard/Pomodoro'

export default function Focus() {
  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-bold">Focus Mode</h2>
      <div className="max-w-sm mx-auto"><Pomodoro /></div>
    </div>
  )
}