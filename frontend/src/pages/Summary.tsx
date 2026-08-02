import { useState, useEffect, useRef } from 'react'
import { Sparkles, Upload, FileText, Check, X, RefreshCw } from 'lucide-react'
import { documentService } from '../services/document'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Loader from '../components/common/Loader'

interface Doc {
  id: number
  original_name: string
  page_count: number
  file_size: number
}

type Style = 'bullet_points' | 'executive' | 'key_takeaways'

const STYLES: { value: Style; label: string; desc: string }[] = [
  { value: 'bullet_points', label: '📋 Bullet Points', desc: 'Structured key points' },
  { value: 'executive',     label: '📊 Executive',     desc: 'High-level overview'   },
  { value: 'key_takeaways', label: '🎯 Key Takeaways', desc: 'Exam-ready concepts'   },
]

export default function Summary() {
  const [docs, setDocs]               = useState<Doc[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [newFiles, setNewFiles]       = useState<File[]>([])
  const [style, setStyle]             = useState<Style>('bullet_points')
  const [summary, setSummary]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [loadingDocs, setLoadingDocs] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    documentService.list()
      .then(res => {
        const data: any = res.data
        const list = Array.isArray(data) ? data : (data?.documents ?? [])
        setDocs(list)
      })
      .catch(err => console.error('Failed to load library:', err))
      .finally(() => setLoadingDocs(false))
  }, [])

  const toggleDoc = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(f => f.name.endsWith('.pdf'))
    setNewFiles(prev => [...prev, ...files])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeNewFile = (name: string) => {
    setNewFiles(prev => prev.filter(f => f.name !== name))
  }

  const canGenerate = selectedIds.length > 0 || newFiles.length > 0

const generate = async () => {
    if (!canGenerate) return
    setLoading(true)
    setSummary('')
    try {
      // Build plain JSON payload
      const payload = {
        doc_ids: selectedIds,
        summary_style: style,
      } as any

      const res = await documentService.summarize(payload)
      setSummary(res.data.summary)
    } catch (err: any) {
      setSummary(`❌ ${err.response?.data?.detail ?? 'Error generating summary.'}`)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-white text-xl font-bold">AI Summary</h2>
        <p className="text-gray-400 text-sm mt-1">
          Select documents from your library or upload new PDFs to summarize
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">

          {/* Library */}
          <Card>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" />
              Select from Library
              {selectedIds.length > 0 && (
                <span className="ml-auto text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  {selectedIds.length} selected
                </span>
              )}
            </h3>
            {loadingDocs ? (
              <Loader text="Loading documents..." />
            ) : docs.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No documents yet. Upload PDFs in the Documents page.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {docs.map(doc => {
                  const selected = selectedIds.includes(doc.id)
                  return (
                    <button
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left ${
                        selected
                          ? 'border-indigo-500 bg-indigo-950'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        selected ? 'bg-indigo-600' : 'bg-gray-700'
                      }`}>
                        {selected
                          ? <Check size={14} className="text-white" />
                          : <FileText size={14} className="text-gray-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{doc.original_name}</p>
                        <p className="text-gray-500 text-xs">{doc.page_count ?? '?'} pages</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Upload new */}
          <Card>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Upload size={16} className="text-green-400" />
              Upload New PDF
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-600 hover:border-indigo-500 rounded-xl p-6 text-center transition group"
            >
              <Upload size={24} className="text-gray-500 group-hover:text-indigo-400 mx-auto mb-2 transition" />
              <p className="text-gray-400 text-sm">Click to upload PDF</p>
              <p className="text-gray-600 text-xs mt-1">or drag and drop</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileAdd}
            />
            {newFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {newFiles.map(f => (
                  <div key={f.name} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
                    <FileText size={14} className="text-green-400 shrink-0" />
                    <span className="text-white text-sm flex-1 truncate">{f.name}</span>
                    <button
                      onClick={() => removeNewFile(f.name)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right — style + button */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-white font-semibold mb-3">Summary Style</h3>
            <div className="space-y-2">
              {STYLES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`w-full p-3 rounded-xl border text-left transition ${
                    style === s.value
                      ? 'border-indigo-500 bg-indigo-950'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <p className="text-white text-sm font-medium">{s.label}</p>
                  <p className="text-gray-500 text-xs">{s.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          <Button
            onClick={generate}
            disabled={!canGenerate || loading}
            className="w-full justify-center py-3"
          >
            {loading
              ? <><RefreshCw size={16} className="animate-spin" /> Generating...</>
              : <><Sparkles size={16} /> Generate Summary</>
            }
          </Button>

          {!canGenerate && (
            <p className="text-gray-500 text-xs text-center">
              Select at least one document or upload a PDF
            </p>
          )}
        </div>
      </div>

      {loading && (
        <Card>
          <Loader text="AI is reading your documents..." />
        </Card>
      )}

      {summary && !loading && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Generated Summary
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="text-xs text-gray-400 hover:text-white transition px-3 py-1 bg-gray-700 rounded-lg"
            >
              Copy
            </button>
          </div>
          <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans leading-relaxed">
            {summary}
          </pre>
        </Card>
      )}
    </div>
  )
}