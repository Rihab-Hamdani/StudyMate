import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import Loader from '../components/common/Loader'

// 1. Local Types (no missing imports)
type Msg = { role: 'user' | 'ai'; content: string }
type ApiMessage = { role: 'user' | 'assistant'; content: string }

const API_URL = 'http://localhost:8000/api/v1'

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', content: 'Hello! Upload a PDF and ask me anything about it 📚' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')

    // Append new user message to local UI state
    const updatedMessages: Msg[] = [...messages, { role: 'user', content: userText }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Map UI messages ('ai' -> 'assistant') for FastAPI / Groq format
      const historyPayload: ApiMessage[] = updatedMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      }))

      // Native fetch request to avoid Axios / module import issues
      const res = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          document_ids: []
        }),
      })

      if (!res.ok) throw new Error('Failed to fetch reply')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Error connecting to backend.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-lg px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-gray-800 text-gray-200 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot size={14} className="text-white"/>
            </div>
            <div className="bg-gray-800 px-4 py-3 rounded-2xl">
              <Loader text="Thinking..." />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4 flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask anything about your document..."
          className="flex-1 bg-gray-800 text-gray-200 text-sm px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}