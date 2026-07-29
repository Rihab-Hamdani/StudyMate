import api from './api'

export const documentService = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/api/v1/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  list: () => api.get('/api/v1/documents/'),
  get: (id: number) => api.get(`/api/v1/documents/${id}`),
  delete: (id: number) => api.delete(`/api/v1/documents/${id}`),
}