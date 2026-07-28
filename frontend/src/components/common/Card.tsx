import { ReactNode } from 'react'

export default function Card({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  )
}