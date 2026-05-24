import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(error.response.data ?? error)
    }
    return Promise.reject(error)
  },
)

async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config)
  return response.data
}

async function get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ method: 'GET', url, ...config })
}

async function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ method: 'POST', url, data, ...config })
}

async function put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ method: 'PUT', url, data, ...config })
}

async function del<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ method: 'DELETE', url, ...config })
}

const networkManager = {
  get,
  post,
  put,
  delete: del,
  request,
}

export default networkManager
