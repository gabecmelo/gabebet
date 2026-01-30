import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  rollDice,
  calculateWinProbability,
  calculateMultiplier,
  isWinningBet,
  validateBet,
  placeDiceBetWithRoll,
  DEFAULT_DICE_CONFIG,
  type DiceBetType,
} from '../../app/logic/algorithms/dice'

describe('Dice Algorithm', () => {
  describe('rollDice', () => {
    it('should return a number between 1 and 100', () => {
      for (let i = 0; i < 100; i++) {
        const roll = rollDice()
        expect(roll).toBeGreaterThanOrEqual(1)
        expect(roll).toBeLessThanOrEqual(100)
      }
    })

    it('should return an integer', () => {
      for (let i = 0; i < 50; i++) {
        const roll = rollDice()
        expect(Number.isInteger(roll)).toBe(true)
      }
    })
  })

  describe('calculateWinProbability', () => {
    it('should calculate correct probability for "over" bet', () => {
      // Target 50, betting over means 51-100 wins (50% chance)
      const probability = calculateWinProbability(50, 'over')
      expect(probability).toBe(0.5)
    })

    it('should calculate correct probability for "under" bet', () => {
      // Target 50, betting under means 1-49 wins (49% chance)
      const probability = calculateWinProbability(50, 'under')
      expect(probability).toBe(0.49)
    })

    it('should calculate edge case for low target "over"', () => {
      // Target 10, betting over means 11-100 wins (90% chance)
      const probability = calculateWinProbability(10, 'over')
      expect(probability).toBe(0.9)
    })

    it('should calculate edge case for high target "under"', () => {
      // Target 90, betting under means 1-89 wins (89% chance)
      const probability = calculateWinProbability(90, 'under')
      expect(probability).toBe(0.89)
    })

    it('should throw error for target below minimum', () => {
      expect(() => calculateWinProbability(0, 'over')).toThrow()
    })

    it('should throw error for target above maximum', () => {
      expect(() => calculateWinProbability(101, 'over')).toThrow()
    })
  })

  describe('calculateMultiplier', () => {
    it('should calculate correct multiplier for 50% win chance', () => {
      // 50% chance with 1% house edge = 1.98x
      const multiplier = calculateMultiplier(50, 'over')
      expect(multiplier).toBe(1.98)
    })

    it('should return higher multiplier for lower probability', () => {
      // High target "over" = low probability = high multiplier
      const highRisk = calculateMultiplier(90, 'over')
      const lowRisk = calculateMultiplier(10, 'over')
      expect(highRisk).toBeGreaterThan(lowRisk)
    })

    it('should apply house edge correctly', () => {
      // Without house edge, 50% would give 2x
      // With 1% edge, should be ~1.98x
      const multiplier = calculateMultiplier(50, 'over')
      expect(multiplier).toBeLessThan(2)
    })
  })

  describe('isWinningBet', () => {
    it('should win "over" bet when roll is greater than target', () => {
      expect(isWinningBet(75, 50, 'over')).toBe(true)
    })

    it('should lose "over" bet when roll equals target', () => {
      expect(isWinningBet(50, 50, 'over')).toBe(false)
    })

    it('should lose "over" bet when roll is less than target', () => {
      expect(isWinningBet(25, 50, 'over')).toBe(false)
    })

    it('should win "under" bet when roll is less than target', () => {
      expect(isWinningBet(25, 50, 'under')).toBe(true)
    })

    it('should lose "under" bet when roll equals target', () => {
      expect(isWinningBet(50, 50, 'under')).toBe(false)
    })

    it('should lose "under" bet when roll is greater than target', () => {
      expect(isWinningBet(75, 50, 'under')).toBe(false)
    })
  })

  describe('validateBet', () => {
    it('should validate a correct bet', () => {
      const result = validateBet(100, 50)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject bet below minimum', () => {
      const result = validateBet(0.5, 50)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('mínima')
    })

    it('should reject bet above maximum', () => {
      const result = validateBet(50000, 50)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('máxima')
    })

    it('should reject invalid target', () => {
      const result = validateBet(100, 150)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Alvo')
    })
  })

  describe('placeDiceBetWithRoll', () => {
    it('should return a winning result with correct payout', () => {
      const result = placeDiceBetWithRoll(100, 50, 'over', 75)
      
      expect(result.won).toBe(true)
      expect(result.roll).toBe(75)
      expect(result.target).toBe(50)
      expect(result.betType).toBe('over')
      expect(result.betAmount).toBe(100)
      expect(result.multiplier).toBe(1.98)
      expect(result.payout).toBe(198)
    })

    it('should return a losing result with zero payout', () => {
      const result = placeDiceBetWithRoll(100, 50, 'over', 25)
      
      expect(result.won).toBe(false)
      expect(result.payout).toBe(0)
    })

    it('should throw error for invalid bet amount', () => {
      expect(() => placeDiceBetWithRoll(0, 50, 'over', 75)).toThrow()
    })

    it('should calculate correct payout for under bet', () => {
      const result = placeDiceBetWithRoll(50, 50, 'under', 25)
      
      expect(result.won).toBe(true)
      expect(result.multiplier).toBeCloseTo(2.02, 1)
    })
  })
})
