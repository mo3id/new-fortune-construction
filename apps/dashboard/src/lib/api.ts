import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create({ baseURL: `${BASE_URL}/api` })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fc_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const uploadImage = async (file: File): Promise<string> => {
  const fd = new FormData()
  fd.append('image', file)
  const { data } = await api.post('/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return `${BASE_URL}${data.url}`
}

export const uploadVideo = async (file: File): Promise<string> => {
  const fd = new FormData()
  fd.append('video', file)
  const { data } = await api.post('/upload/video', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return `${BASE_URL}${data.url}`
}

export const uploadMedia = async (file: File): Promise<string> => {
  const isVideo = /\.(mp4|webm|mov|avi)$/i.test(file.name)
  return isVideo ? uploadVideo(file) : uploadImage(file)
}
