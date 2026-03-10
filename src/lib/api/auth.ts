import apiClient from './client'
import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/lib/types/api'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const formData = new URLSearchParams()
  formData.append('username', data.username)
  formData.append('password', data.password)

  const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

export async function register(data: RegisterRequest): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', data)
  return response.data
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/users/me')
  return response.data
}
