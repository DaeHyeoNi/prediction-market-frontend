export const queryKeys = {
  markets: ['markets'] as const,
  market: (id: number) => ['markets', id] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['orders', id] as const,
  positions: ['positions'] as const,
  me: ['me'] as const,
}
