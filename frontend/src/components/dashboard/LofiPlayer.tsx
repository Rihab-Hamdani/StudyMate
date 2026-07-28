import { useState } from 'react'
import { Play, Pause, SkipForward, Music2 } from 'lucide-react'
import Card from '../common/Card'

const TRACKS = [
  { title: 'Chill Study Beats',  artist: 'Lo-fi Radio', emoji: '🎵' },
  { title: 'Rainy Day Focus',    artist: 'Ambient Flow', emoji: '🌧️' },
  { title: 'Coffee Shop Vibes',  artist: 'Jazz Chill',  emoji: '☕' },
  { title: 'Deep Focus Mode',    artist: 'Brain Waves', emoji: '🧠' },
]

export default function LofiPlayer() {
  const [playing, setPlaying] = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)

  const next = () => setTrackIdx(i => (i + 1) % TRACKS.length)
  const track = TRACKS[trackIdx]

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Music2 size={16} className="text-indigo-400" />
        <h3 className="text-white font-semibold">Lo-fi Player</h3>
        <span className="ml-auto text-xs text-gray-500">Mock</span>
      </div>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-indigo-900 flex items-center justify-center text-2xl
          ${playing ? 'animate-pulse' : ''}`}>
          {track.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{track.title}</p>
          <p className="text-gray-500 text-xs">{track.artist}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 transition"
          >
            <SkipForward size={14} />
          </button>
        </div>
      </div>
      {/* Progress bar (visual only) */}
      <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full bg-indigo-500 rounded-full ${playing ? 'animate-[grow_30s_linear_infinite]' : ''}`}
          style={{ width: playing ? '60%' : '30%', transition: 'width 0.5s' }} />
      </div>
    </Card>
  )
}