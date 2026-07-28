import { Bell, Search } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ title }: { title: string }) {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-white font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-gray-300 text-sm pl-9 pr-4 py-1.5 rounded-xl border border-gray-700 focus:outline-none focus:border-indigo-500 w-48"
          />
        </div>
        <button className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 transition">
          <Bell size={16} />
        </button>
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  )
}