import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Card from '../common/Card'

const MODES = {
  focus:  { label: '🍅 Focus',       minutes: 25 },
  short:  { label: '☕ Short Break', minutes: 5  },
  long:   { label: '🌿 Long Break',  minutes: 15 },
}

type Mode = keyof typeof MODES

export default function Pomodoro() {
  const [mode, setMode] = useState<Mode>('focus')
  const [seconds, setSeconds] = useState(MODES.focus.minutes * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setSeconds(MODES[mode].minutes * 60)
    setRunning(false)
  }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { setRunning(false); return 0 }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const reset = () => { setRunning(false); setSeconds(MODES[mode].minutes * 60) }
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const progress = 1 - seconds / (MODES[mode].minutes * 60)
  const circumference = 2 * Math.PI * 54

  return (
    <Card>
      <h3 className="text-white font-semibold mb-4">Pomodoro Timer</h3>
      {/* Mode tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(MODES) as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 text-xs rounded-lg transition ${
              mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>
      {/* Timer circle */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#374151" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke="#6366f1" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-mono font-bold">{mm}:{ss}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRunning(r => !r)}
            className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition"
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={reset}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 transition"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </Card>
  )
}