import apiClient from './client'
import { Order, PlaceOrderRequest, PlaceOrderResponse } from '@/lib/types/api'

export async function placeOrder(data: PlaceOrderRequest): Promise<PlaceOrderResponse> {
  const response = await apiClient.post<PlaceOrderResponse>('/orders', data)
  return response.data
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>('/orders/me')
  return response.data
}

export async function getOrder(id: number): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${id}`)
  return response.data
}

export async function cancelOrder(id: number): Promise<void> {
  await apiClient.delete(`/orders/${id}`)
}
