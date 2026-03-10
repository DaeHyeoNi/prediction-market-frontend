import apiClient from './client'
import { Market, Orderbook } from '@/lib/types/api'

export async function getMarkets(): Promise<Market[]> {
  const response = await apiClient.get<Market[]>('/markets')
  return response.data
}

export async function getMarket(id: number): Promise<Market> {
  const response = await apiClient.get<Market>(`/markets/${id}`)
  return response.data
}

export async function getOrderbook(id: number): Promise<Orderbook> {
  const response = await apiClient.get<Orderbook>(`/markets/${id}/orderbook`)
  return response.data
}

export async function createMarket(data: { title: string; closes_at: string; description?: string }): Promise<Market> {
  const response = await apiClient.post<Market>('/markets', data)
  return response.data
}
