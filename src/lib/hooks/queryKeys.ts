export const queryKeys = {
  markets: ['markets'] as const,
  market: (id: number) => ['markets', id] as const,
  orderbook: (id: number) => ['orderbook', id] as const,
  trades: (id: number) => ['trades', id] as const,
  myMarketResult: (id: number) => ['my-market-result', id] as const,
  orders: ['orders'] as const,
  positions: ['positions'] as const,
  me: ['me'] as const,
}
