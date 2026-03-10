export type MarketStatus = 'Open' | 'Closed' | 'Resolved'
export type Position = 'YES' | 'NO'
export type OrderType = 'Bid' | 'Ask'
export type OrderStatus = 'Pending' | 'Open' | 'Partial' | 'Filled' | 'Cancelled'
export type MarketResult = 'YES' | 'NO' | null

export interface Market {
  id: number
  title: string
  description: string | null
  status: MarketStatus
  result: MarketResult
  closes_at: string
  created_by: number
  created_at: string
  resolved_at: string | null
}

export interface OrderbookEntry {
  price: number
  quantity: number
}

export interface OrderbookSide {
  bids: OrderbookEntry[]
  asks: OrderbookEntry[]
}

export interface Orderbook {
  YES: OrderbookSide
  NO: OrderbookSide
}

export interface Order {
  id: number
  user_id: number
  market_id: number
  position: Position
  order_type: OrderType
  price: number
  quantity: number
  remaining_quantity: number
  status: OrderStatus
  locked_points: number
  created_at: string
  updated_at: string
}

export interface UserPosition {
  id: number
  user_id: number
  market_id: number
  position: Position
  quantity: number
  avg_price: number
}

export interface User {
  id: number
  username: string
  total_points: number
  available_points: number
}

export interface PlaceOrderRequest {
  market_id: number
  position: Position
  order_type: OrderType
  price: number
  quantity: number
}

export interface CreateMarketRequest {
  title: string
  closes_at: string
  description?: string
}

export interface ResolveMarketRequest {
  result: Position
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterRequest {
  username: string
  password: string
}
