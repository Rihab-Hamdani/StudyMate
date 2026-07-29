import { Upload, FileText, Trash2, Calendar, BookOpen } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { documentService } from '../services/document'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import Loader from '../components/common/Loader'

interface Doc {
  id: number
  original_name: string
  file_size: number
  page_count: number
  created_at: string
}

export default function Documents() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchDocs() }, [])

  const fetchDocs = async () => {
    try {
      const res = await documentService.list()
      // API returns { documents: [...], total: n }
      const data = res.data
      if (Array.isArray(data)) {
        setDocs(data)
      } else if (data.documents && Array.isArray(data.documents)) {
        setDocs(data.documents)
      } else {
        setDocs([])
      }
    } catch (err) {
      console.error('Failed to fetch documents', err)
      setDocs([])
    }
    setLoading(false)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await documentService.upload(file)
      await fetchDocs()
    } catch (err) {
      console.error('Upload error:', err)
      alert('Upload failed. Make sure backend is running.')
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await documentService.delete(id)
      setDocs(d => d.filter(x => x.id !== id))
    } catch {
      alert('Delete failed.')
    }
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) return <Loader text="Loading documents..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">My Documents</h2>
          <p className="text-gray-400 text-sm">
            {docs.length} PDF{docs.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {docs.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No documents yet"
          description="Upload your first PDF to start studying with AI"
          action={
            <Button onClick={() => inputRef.current?.click()}>
              <Upload size={14} /> Upload PDF
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {docs.map(doc => (
            <div
              key={doc.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition"
            >
              <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {doc.original_name}
                </p>
                <div className="flex gap-3 mt-1">
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <BookOpen size={10} />
                    {doc.page_count ?? '?'} pages
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatSize(doc.file_size)}
                  </span>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(doc.id, doc.original_name)}
                className="p-2 text-gray-500 hover:text-red-400 transition rounded-lg hover:bg-red-900/20"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}