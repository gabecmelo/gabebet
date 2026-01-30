/**
 * Bet History Store - Manages betting history
 * 
 * Stores all bets placed by the user in localStorage.
 * NOTE: This is a client-side simulation.
 */

import { defineStore } from 'pinia'
import type { Bet, BetHistoryState } from '~/types/game'

const HISTORY_KEY = 'gabebet_bet_history'
const MAX_HISTORY_SIZE = 100

/**
 * Gets bet history from localStorage
 */
function getStoredHistory(userId: string): Bet[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(`${HISTORY_KEY}_${userId}`)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Saves bet history to localStorage
 */
function saveHistory(userId: string, bets: Bet[]): void {
  if (typeof window === 'undefined') return
  
  // Keep only last MAX_HISTORY_SIZE bets
  const trimmedBets = bets.slice(0, MAX_HISTORY_SIZE)
  localStorage.setItem(`${HISTORY_KEY}_${userId}`, JSON.stringify(trimmedBets))
}

export const useBetHistoryStore = defineStore('betHistory', {
  state: (): BetHistoryState => ({
    bets: [],
    isLoading: false,
    totalBets: 0,
    totalWon: 0,
    totalLost: 0,
  }),

  getters: {
    recentBets: (state): Bet[] => state.bets.slice(0, 10),
    
    winRate: (state): number => {
      if (state.totalBets === 0) return 0
      return (state.totalWon / state.totalBets) * 100
    },

    netProfit: (state): number => {
      return state.bets.reduce((acc, bet) => {
        return acc + (bet.won ? bet.payout - bet.amount : -bet.amount)
      }, 0)
    },

    betsByGame: (state) => (gameType: string): Bet[] => {
      return state.bets.filter(bet => bet.gameType === gameType)
    },
  },

  actions: {
    /**
     * Loads bet history for a user
     */
    loadHistory(userId: string) {
      this.isLoading = true
      
      try {
        this.bets = getStoredHistory(userId)
        this.calculateStats()
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Adds a new bet to history
     */
    addBet(userId: string, bet: Omit<Bet, 'id' | 'createdAt'>) {
      const newBet: Bet = {
        ...bet,
        id: `bet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
      }

      this.bets.unshift(newBet)
      saveHistory(userId, this.bets)
      this.calculateStats()

      return newBet
    },

    /**
     * Calculates total stats
     */
    calculateStats() {
      this.totalBets = this.bets.length
      this.totalWon = this.bets.filter(bet => bet.won).length
      this.totalLost = this.bets.filter(bet => !bet.won).length
    },

    /**
     * Clears bet history
     */
    clearHistory(userId: string) {
      this.bets = []
      this.totalBets = 0
      this.totalWon = 0
      this.totalLost = 0
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`${HISTORY_KEY}_${userId}`)
      }
    },
  },
})
