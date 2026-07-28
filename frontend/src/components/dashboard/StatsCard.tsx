import { ReactNode } from 'react'
import Card from '../common/Card'

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
  sub?: string
  color: string
}

export default function StatsCard({ icon, label, value, sub, color }: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </Card>
  )
}