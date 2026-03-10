import apiClient from './client'
import { Market, MarketDetail } from '@/lib/types/api'

export async function getMarkets(): Promise<Market[]> {
  const response = await apiClient.get<Market[]>('/markets')
  return response.data
}

export async function getMarket(id: number): Promise<MarketDetail> {
  const response = await apiClient.get<MarketDetail>(`/markets/${id}`)
  return response.data
}
