import EmptyState from '../components/common/EmptyState'
import { Brain } from 'lucide-react'

export default function Flashcards() {
  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-bold">Flashcards</h2>
      <EmptyState icon={<Brain />} title="Flashcards — Coming in Sprint 8" description="Auto-generated front/back cards from your study material" />
    </div>
  )
}