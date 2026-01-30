/**
 * Bet and Game Types
 */

export interface Bet {
  id: string
  gameType: 'dice' | 'crash' | 'slots'
  amount: number
  multiplier: number
  payout: number
  won: boolean
  createdAt: string
  details: Record<string, unknown>
}

export interface BetHistoryState {
  bets: Bet[]
  isLoading: boolean
  totalBets: number
  totalWon: number
  totalLost: number
}

export interface GameConfig {
  minBet: number
  maxBet: number
  houseEdge: number
}
