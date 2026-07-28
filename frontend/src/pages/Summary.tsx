import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { documentService } from '../services/document'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'

export default function Summary() {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await documentService.summary()
      setSummary(res.data.summary)
    } catch { setSummary('❌ Error generating summary. Make sure a PDF is uploaded.') }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">AI Summary</h2>
          <p className="text-gray-400 text-sm">Generate a structured summary from your PDF</p>
        </div>
        <Button onClick={generate} disabled={loading}>
          <Sparkles size={16} /> {loading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </div>
      {loading && <Loader text="AI is reading your document..." />}
      {summary && (
        <Card>
          <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">{summary}</pre>
        </Card>
      )}
      {!summary && !loading && (
        <Card className="text-center py-16">
          <Sparkles size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Click "Generate Summary" to analyze your uploaded PDF</p>
        </Card>
      )}
    </div>
  )
}