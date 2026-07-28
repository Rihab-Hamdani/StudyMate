import EmptyState from '../components/common/EmptyState'
import { HelpCircle } from 'lucide-react'
import Button from '../components/common/Button'

export default function Quiz() {
  return (
    <div className="space-y-6">
      <h2 className="text-white text-xl font-bold">Quiz Generator</h2>
      <EmptyState
        icon={<HelpCircle />}
        title="Quiz Generator — Coming in Sprint 7"
        description="AI will generate multiple choice, true/false, and short answer questions from your PDFs"
        action={<Button variant="secondary" disabled>Coming Soon</Button>}
      />
    </div>
  )
}