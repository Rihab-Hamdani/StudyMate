import api from './api'
import type { ApiDocument, SummaryPayload, SummaryResponse } from '../types/index'

export const documentService = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<ApiDocument>('/api/v1/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  list: () => api.get<ApiDocument[]>('/api/v1/documents/'),
  get: (id: number | string) => api.get<ApiDocument>(`/api/v1/documents/${id}`),
  delete: (id: number | string) => api.delete(`/api/v1/documents/${id}`),
  summarize: (payload: SummaryPayload) =>
    api.post<SummaryResponse>('/api/v1/documents/summarize', payload),
}