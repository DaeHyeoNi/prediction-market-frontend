export type MarketStatus = 'Open' | 'Closed' | 'Resolved'
export type Position = 'YES' | 'NO'
export type OrderType = 'BID' | 'ASK'
export type OrderStatus = 'Pending' | 'Filled' | 'Cancelled' | 'PartiallyFilled'
export type OrderResult = 'YES' | 'NO' | null

export interface Market {
  id: number
  title: string
  status: MarketStatus
  result: OrderResult
  closes_at: string
  created_by: string
}

export interface OrderbookEntry {
  price: number
  quantity: number
}

export interface OrderbookSide {
  bids: OrderbookEntry[]
  asks: OrderbookEntry[]
}

export interface MarketDetail extends Market {
  orderbook: {
    YES: OrderbookSide
    NO: OrderbookSide
  }
}

export interface Order {
  id: number
  market_id: number
  position: Position
  order_type: OrderType
  price: number
  quantity: number
  filled_quantity: number
  status: OrderStatus
  created_at: string
}

export interface UserPosition {
  market_id: number
  market_title: string
  position: Position
  quantity: number
  average_price: number
}

export interface User {
  id: number
  username: string
  email: string
  balance: number
}

export interface PlaceOrderRequest {
  market_id: number
  position: Position
  order_type: OrderType
  price: number
  quantity: number
}

export interface PlaceOrderResponse {
  order_id: number
  message: string
}

export interface CreateMarketRequest {
  title: string
  closes_at: string
}

export interface SettleMarketRequest {
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
  email: string
  password: string
}
