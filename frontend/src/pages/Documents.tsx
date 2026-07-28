import { Upload, FileText, Trash2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { documentService } from '../services/document'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'

export default function Documents() {
  const [docs, setDocs] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await documentService.upload(file)
      const res = await documentService.list()
      setDocs(res.data.documents)
    } catch { alert('Upload failed') }
    setUploading(false)
  }

  const handleDelete = async (name: string) => {
    await documentService.delete(name)
    setDocs(d => d.filter(x => x !== name))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">My Documents</h2>
          <p className="text-gray-400 text-sm">{docs.length} PDF{docs.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload PDF'}
        </Button>
        <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
      </div>

      {docs.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No documents yet"
          description="Upload your first PDF to start studying with AI"
          action={<Button onClick={() => inputRef.current?.click()}><Upload size={14}/> Upload PDF</Button>}
        />
      ) : (
        <div className="grid gap-3">
          {docs.map(name => (
            <div key={name} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center">
                <FileText size={18} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{name}</p>
                <p className="text-gray-500 text-xs">PDF Document</p>
              </div>
              <button onClick={() => handleDelete(name)} className="p-2 text-gray-500 hover:text-red-400 transition">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}