// src/types/index.ts

export type Theme = 'light' | 'dark'

export interface Document {
  id: string | number
  filename?: string
  original_name?: string
  uploadedAt?: string
  created_at?: string
  page_count?: number
  file_size?: number
}

// Alias for Document to satisfy any backend API references
export type ApiDocument = Document

// UPDATE THIS: Match the actual payload sent to FastAPI
export interface SummaryPayload {
  doc_ids?: number[]
  summary_style?: 'bullet_points' | 'executive' | 'key_takeaways' | string
}

export interface SummaryResponse {
  summary: string
  style?: string
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