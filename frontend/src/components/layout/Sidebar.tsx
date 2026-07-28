import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, MessageSquare, Sparkles,
  HelpCircle, Brain, Timer, Settings, BookOpen, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/documents',  icon: FileText,         label: 'Documents' },
  { to: '/chat',       icon: MessageSquare,    label: 'AI Chat' },
  { to: '/summary',    icon: Sparkles,         label: 'Summary' },
  { to: '/quiz',       icon: HelpCircle,       label: 'Quiz' },
  { to: '/flashcards', icon: Brain,            label: 'Flashcards' },
  { to: '/focus',      icon: Timer,            label: 'Focus Mode' },
  { to: '/settings',   icon: Settings,         label: 'Settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`
      ${collapsed ? 'w-16' : 'w-60'} 
      bg-gray-900 border-r border-gray-700 flex flex-col
      transition-all duration-300 ease-in-out shrink-0
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <BookOpen size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm">StudyMate AI</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
              transition-all duration-150 group
              ${isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="m-3 p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 flex items-center justify-center transition"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}