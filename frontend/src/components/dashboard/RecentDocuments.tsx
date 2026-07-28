import { FileText, Upload } from 'lucide-react'
import Card from '../common/Card'
import { useNavigate } from 'react-router-dom'

const MOCK_DOCS = [
  { name: 'Physics Revision Ch1.pdf', date: 'Today',     pages: 5  },
  { name: 'Math Exam Prep.pdf',       date: 'Yesterday', pages: 12 },
  { name: 'Chemistry Notes.pdf',      date: '3 days ago',pages: 8  },
]

export default function RecentDocuments() {
  const navigate = useNavigate()
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Documents</h3>
        <button
          onClick={() => navigate('/documents')}
          className="text-indigo-400 text-xs hover:text-indigo-300 transition"
        >
          View all →
        </button>
      </div>
      <div className="space-y-3">
        {MOCK_DOCS.map((doc, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-750 rounded-xl hover:bg-gray-700 transition cursor-pointer group">
            <div className="w-9 h-9 bg-indigo-900 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={16} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 text-sm truncate">{doc.name}</p>
              <p className="text-gray-500 text-xs">{doc.date} · {doc.pages} pages</p>
            </div>
          </div>
        ))}
        <button
          onClick={() => navigate('/documents')}
          className="w-full py-2.5 border border-dashed border-gray-600 rounded-xl text-gray-500 text-sm hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-2"
        >
          <Upload size={14} /> Upload PDF
        </button>
      </div>
    </Card>
  )
}