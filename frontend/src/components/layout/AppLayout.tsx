import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageTitles: Record<string, string> = {
  '/':            'Dashboard',
  '/documents':   'My Documents',
  '/chat':        'AI Chat',
  '/summary':     'AI Summary',
  '/quiz':        'Quiz',
  '/flashcards':  'Flashcards',
  '/focus':       'Focus Mode',
  '/settings':    'Settings',
}

export default function AppLayout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'StudyMate AI'

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}