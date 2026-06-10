/**
 * Utility functions for Habit Tracker
 * Pure functions extracted for testability
 */

/**
 * Get today's date as YYYY-MM-DD string
 * @param {Date} [date] - Optional date (defaults to now)
 * @returns {string} Formatted date string
 */
const today = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * Get yesterday's date as YYYY-MM-DD string
 * @param {Date} [date] - Optional reference date (defaults to now)
 * @returns {string} Formatted date string
 */
const yesterday = (date = new Date()) => {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return today(d)
}

/**
 * Format date for display (e.g., "Mon, Jun 10")
 * @param {Date} date - Date to format
 * @returns {string} Formatted display string
 */
const formatDate = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
}

/**
 * Calculate streak from completions array
 * @param {string[]} completions - Array of YYYY-MM-DD strings
 * @param {string} todayStr - Today's date string
 * @param {string} yesterdayStr - Yesterday's date string
 * @returns {number} Current streak count
 */
const calcStreak = (completions, todayStr, yesterdayStr) => {
  if (!completions || completions.length === 0) return 0

  // Must be completed today or yesterday to have a streak
  if (!completions.includes(todayStr) && !completions.includes(yesterdayStr)) return 0

  let streak = 0
  let checkDate = new Date(todayStr + 'T12:00:00')

  // Start from today if completed, else yesterday
  if (!completions.includes(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (true) {
    const dateStr = today(checkDate)
    if (completions.includes(dateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

/**
 * Calculate streak for a habit object
 * @param {object} habit - Habit with completions array
 * @param {string} todayStr - Today's date string
 * @param {string} yesterdayStr - Yesterday's date string
 * @returns {number} Current streak count
 */
const calcHabitStreak = (habit, todayStr, yesterdayStr) => {
  if (!habit || !habit.completions) return 0
  return calcStreak(habit.completions, todayStr, yesterdayStr)
}

/**
 * Check if a habit is completed today
 * @param {object} habit - Habit object with completions array
 * @param {string} todayStr - Today's date string
 * @returns {boolean} Whether habit is completed today
 */
const isCompletedToday = (habit, todayStr) => {
  if (!habit || !habit.completions) return false
  return habit.completions.includes(todayStr)
}

/**
 * Toggle habit completion for a specific date
 * @param {object} habit - Habit object
 * @param {string} dateStr - Date string to toggle
 * @returns {object} Updated habit object
 */
const toggleCompletion = (habit, dateStr) => {
  if (!habit) return null

  const updated = { ...habit, completions: [...(habit.completions || [])] }
  const idx = updated.completions.indexOf(dateStr)

  if (idx >= 0) {
    updated.completions.splice(idx, 1)
  } else {
    updated.completions.push(dateStr)
  }

  return updated
}

/**
 * Clean old completions (older than specified days)
 * @param {object} habit - Habit object
 * @param {number} daysToKeep - Number of days to keep (default: 90)
 * @param {Date} [now] - Current date (for testing)
 * @returns {object} Updated habit with cleaned completions
 */
const cleanOldCompletions = (habit, daysToKeep = 90, now = new Date()) => {
  if (!habit || !habit.completions) return habit

  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - daysToKeep)
  const cutoffStr = today(cutoff)

  return {
    ...habit,
    completions: habit.completions.filter(d => d >= cutoffStr)
  }
}

/**
 * Validate habit name
 * @param {string} name - Habit name to validate
 * @returns {{ valid: boolean, error?: string }} Validation result
 */
const validateHabitName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' }
  }

  const trimmed = name.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: 'Name cannot be empty' }
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Name too long (max 50 chars)' }
  }

  return { valid: true }
}

/**
 * Create a new habit object
 * @param {string} name - Habit name
 * @param {string} icon - Emoji icon
 * @param {string} color - Color hex string
 * @param {string} [dateStr] - Creation date (defaults to today)
 * @returns {object} New habit object
 */
const createHabit = (name, icon, color, dateStr) => {
  const creationDate = dateStr || today()
  return {
    id: Date.now().toString(),
    name: name.trim(),
    icon: icon || '⭐',
    color: color || '#6366f1',
    completions: [],
    streak: 0,
    createdAt: creationDate
  }
}

/**
 * Calculate stats from habits array
 * @param {object[]} habits - Array of habit objects
 * @param {string} todayStr - Today's date string
 * @returns {object} Stats object
 */
const calcStats = (habits, todayStr) => {
  if (!habits || habits.length === 0) {
    return {
      completedToday: 0,
      totalHabits: 0,
      bestStreak: 0,
      totalCompletions: 0,
      overallRate: 0
    }
  }

  const completedToday = habits.filter(h => isCompletedToday(h, todayStr)).length
  const totalHabits = habits.length

  // Best streak
  let bestStreak = 0
  habits.forEach(h => {
    const streak = h.streak || 0
    if (streak > bestStreak) bestStreak = streak
  })

  // Total completions
  let totalCompletions = 0
  habits.forEach(h => {
    if (h.completions) totalCompletions += h.completions.length
  })

  // Overall rate (completions / possible completions)
  const daysSinceOldest = calcDaysSinceOldest(habits)
  const possibleCompletions = habits.length * Math.max(daysSinceOldest, 1)
  const overallRate = possibleCompletions > 0
    ? Math.round((totalCompletions / possibleCompletions) * 100)
    : 0

  return {
    completedToday,
    totalHabits,
    bestStreak,
    totalCompletions,
    overallRate
  }
}

/**
 * Calculate days since oldest completion across all habits
 * @param {object[]} habits - Array of habit objects
 * @returns {number} Number of days
 */
const calcDaysSinceOldest = (habits) => {
  let oldest = new Date()

  habits.forEach(h => {
    if (h.completions && h.completions.length > 0) {
      const d = new Date(h.completions[0] + 'T12:00:00')
      if (d < oldest) oldest = d
    }
  })

  const diff = Math.ceil((new Date() - oldest) / (1000 * 60 * 60 * 24))
  return Math.max(diff, 1)
}

/**
 * Get sorted habits by streak (descending)
 * @param {object[]} habits - Array of habit objects
 * @param {number} limit - Max number to return
 * @returns {object[]} Sorted habits
 */
const getSortedByStreak = (habits, limit = 5) => {
  if (!habits) return []
  return [...habits]
    .sort((a, b) => (b.streak || 0) - (a.streak || 0))
    .slice(0, limit)
}

module.exports = {
  today,
  yesterday,
  formatDate,
  calcStreak,
  calcHabitStreak,
  isCompletedToday,
  toggleCompletion,
  cleanOldCompletions,
  validateHabitName,
  createHabit,
  calcStats,
  calcDaysSinceOldest,
  getSortedByStreak
}
