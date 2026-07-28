import Card from '../common/Card'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DATA  = [45, 90, 30, 120, 75, 0, 60]
const MAX   = Math.max(...DATA)

export default function StudyProgress() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Weekly Study Time</h3>
        <span className="text-xs text-gray-500">minutes/day</span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {DATA.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-md bg-indigo-600 opacity-80 hover:opacity-100 transition"
              style={{ height: `${MAX ? (val / MAX) * 80 : 0}px`, minHeight: val > 0 ? '4px' : '0' }}
            />
            <span className="text-gray-500 text-xs">{DAYS[i]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 flex gap-4">
        <div>
          <p className="text-gray-400 text-xs">This week</p>
          <p className="text-white font-bold">420 min</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Daily avg</p>
          <p className="text-white font-bold">60 min</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Best day</p>
          <p className="text-white font-bold">Thu · 2h</p>
        </div>
      </div>
    </Card>
  )
}