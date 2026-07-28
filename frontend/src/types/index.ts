export type Theme = 'light' | 'dark'

export interface Document {
  id: string
  filename: string
  uploadedAt: string
  pages: number
  size: string
}

export interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

export interface StatsData {
  documentsCount: number
  chatsCount: number
  quizzesCount: number
  flashcardsCount: number
  studyStreak: number
  todayMinutes: number
}