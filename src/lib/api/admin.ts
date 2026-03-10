import apiClient from './client'
import { ResolveMarketRequest } from '@/lib/types/api'

export async function resolveMarket(id: number, data: ResolveMarketRequest): Promise<void> {
  await apiClient.post(`/admin/markets/${id}/resolve`, data)
}
