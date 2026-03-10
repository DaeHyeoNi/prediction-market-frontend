import apiClient from './client'
import { Order, PlaceOrderRequest } from '@/lib/types/api'

export async function placeOrder(data: PlaceOrderRequest): Promise<Order> {
  const response = await apiClient.post<Order>('/orders', data)
  return response.data
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>('/orders')
  return response.data
}

export async function cancelOrder(id: number): Promise<void> {
  await apiClient.delete(`/orders/${id}`)
}
