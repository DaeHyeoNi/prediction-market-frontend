import apiClient from './client'
import { Market, CreateMarketRequest, SettleMarketRequest } from '@/lib/types/api'

export async function createMarket(data: CreateMarketRequest): Promise<Market> {
  const response = await apiClient.post<Market>('/admin/markets', data)
  return response.data
}

export async function closeMarket(id: number): Promise<Market> {
  const response = await apiClient.post<Market>(`/admin/markets/${id}/close`)
  return response.data
}

export async function settleMarket(id: number, data: SettleMarketRequest): Promise<Market> {
  const response = await apiClient.post<Market>(`/admin/markets/${id}/settle`, data)
  return response.data
}
