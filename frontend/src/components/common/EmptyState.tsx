import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="text-5xl text-gray-600">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs">{description}</p>
      {action}
    </div>
  )
}