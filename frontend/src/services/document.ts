import api from './api'

export const documentService = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  list: () => api.get('/documents/list'),
  delete: (filename: string) => api.delete(`/documents/delete/${filename}`),
  chat: (message: string) => api.post('/documents/chat', { message }),
  summary: () => api.post('/documents/summary'),
}