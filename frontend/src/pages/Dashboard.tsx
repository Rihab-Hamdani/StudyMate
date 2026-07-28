import { FileText, MessageSquare, HelpCircle, Brain, Flame, Clock } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import Pomodoro from '../components/dashboard/Pomodoro'
import LofiPlayer from '../components/dashboard/LofiPlayer'
import RecentDocuments from '../components/dashboard/RecentDocuments'
import StudyProgress from '../components/dashboard/StudyProgress'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-white text-2xl font-bold">Good morning 👋</h2>
        <p className="text-gray-400 text-sm mt-1">You have 3 documents ready to study.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard icon={<FileText size={20} className="text-indigo-400"/>}  label="Documents"  value={3}   color="bg-indigo-900" />
        <StatsCard icon={<MessageSquare size={20} className="text-green-400"/>} label="Chats"   value={12}  color="bg-green-900" />
        <StatsCard icon={<HelpCircle size={20} className="text-yellow-400"/>}  label="Quizzes"  value={5}   color="bg-yellow-900" />
        <StatsCard icon={<Brain size={20} className="text-purple-400"/>}  label="Flashcards"   value={48}  color="bg-purple-900" />
        <StatsCard icon={<Flame size={20} className="text-orange-400"/>}  label="Study Streak" value="7 🔥" color="bg-orange-900" sub="days in a row" />
        <StatsCard icon={<Clock size={20} className="text-blue-400"/>}    label="Today"        value="45m" color="bg-blue-900"   sub="goal: 2h" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          <StudyProgress />
          <RecentDocuments />
        </div>
        {/* Right col */}
        <div className="space-y-6">
          <Pomodoro />
          <LofiPlayer />
        </div>
      </div>
    </div>
  )
}