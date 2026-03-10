import apiClient from './client'
import { UserPosition } from '@/lib/types/api'

export async function getMyPositions(): Promise<UserPosition[]> {
  const response = await apiClient.get<UserPosition[]>('/positions/me')
  return response.data
}
