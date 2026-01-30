/**
 * Dice Game Algorithm
 * 
 * A simple dice betting game where players bet on whether
 * the result will be over or under a target number.
 * 
 * NOTE: This is a client-side simulation for UI/UX demonstration.
 * Real algorithms will be implemented on the backend.
 */

export type DiceBetType = 'over' | 'under'

export interface DiceBetResult {
  roll: number
  target: number
  betType: DiceBetType
  betAmount: number
  won: boolean
  payout: number
  multiplier: number
}

export interface DiceGameConfig {
  minTarget: number
  maxTarget: number
  minBet: number
  maxBet: number
  houseEdge: number // Percentage (e.g., 0.01 = 1%)
}

export const DEFAULT_DICE_CONFIG: DiceGameConfig = {
  minTarget: 1,
  maxTarget: 100,
  minBet: 1,
  maxBet: 10000,
  houseEdge: 0.01,
}

/**
 * Generates a random dice roll between 1 and 100
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 100) + 1
}

/**
 * Calculates the win probability based on target and bet type
 */
export function calculateWinProbability(
  target: number,
  betType: DiceBetType,
  config: DiceGameConfig = DEFAULT_DICE_CONFIG
): number {
  if (target < config.minTarget || target > config.maxTarget) {
    throw new Error(`Target must be between ${config.minTarget} and ${config.maxTarget}`)
  }

  if (betType === 'over') {
    return (config.maxTarget - target) / config.maxTarget
  } else {
    return (target - 1) / config.maxTarget
  }
}

/**
 * Calculates the payout multiplier based on win probability and house edge
 */
export function calculateMultiplier(
  target: number,
  betType: DiceBetType,
  config: DiceGameConfig = DEFAULT_DICE_CONFIG
): number {
  const probability = calculateWinProbability(target, betType, config)
  
  if (probability <= 0) {
    return 0
  }

  const fairMultiplier = 1 / probability
  const multiplier = fairMultiplier * (1 - config.houseEdge)
  
  return Math.round(multiplier * 100) / 100
}

/**
 * Determines if a bet is a win based on roll result
 */
export function isWinningBet(
  roll: number,
  target: number,
  betType: DiceBetType
): boolean {
  if (betType === 'over') {
    return roll > target
  } else {
    return roll < target
  }
}

/**
 * Validates a bet before placing it
 */
export function validateBet(
  betAmount: number,
  target: number,
  config: DiceGameConfig = DEFAULT_DICE_CONFIG
): { valid: boolean; error?: string } {
  if (betAmount < config.minBet) {
    return { valid: false, error: `Aposta mínima: R$ ${config.minBet}` }
  }

  if (betAmount > config.maxBet) {
    return { valid: false, error: `Aposta máxima: R$ ${config.maxBet}` }
  }

  if (target < config.minTarget || target > config.maxTarget) {
    return { 
      valid: false, 
      error: `Alvo deve estar entre ${config.minTarget} e ${config.maxTarget}` 
    }
  }

  return { valid: true }
}

/**
 * Places a dice bet and returns the result
 */
export function placeDiceBet(
  betAmount: number,
  target: number,
  betType: DiceBetType,
  config: DiceGameConfig = DEFAULT_DICE_CONFIG
): DiceBetResult {
  const validation = validateBet(betAmount, target, config)
  
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const roll = rollDice()
  const won = isWinningBet(roll, target, betType)
  const multiplier = calculateMultiplier(target, betType, config)
  const payout = won ? betAmount * multiplier : 0

  return {
    roll,
    target,
    betType,
    betAmount,
    won,
    payout: Math.round(payout * 100) / 100,
    multiplier,
  }
}

/**
 * Places a dice bet with a predetermined roll (for testing)
 */
export function placeDiceBetWithRoll(
  betAmount: number,
  target: number,
  betType: DiceBetType,
  predeterminedRoll: number,
  config: DiceGameConfig = DEFAULT_DICE_CONFIG
): DiceBetResult {
  const validation = validateBet(betAmount, target, config)
  
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const roll = predeterminedRoll
  const won = isWinningBet(roll, target, betType)
  const multiplier = calculateMultiplier(target, betType, config)
  const payout = won ? betAmount * multiplier : 0

  return {
    roll,
    target,
    betType,
    betAmount,
    won,
    payout: Math.round(payout * 100) / 100,
    multiplier,
  }
}
