// src/services/document.ts
import api from './api'

export interface SummaryRequest {
  doc_ids?: number[]
  summary_style?: string
}

export const documentService = {
  // ... other methods ...

  // Send JSON payload directly
  summarize: (payload: { doc_ids?: number[]; summary_style?: string }) =>
    api.post('/documents/summarize', payload),
}