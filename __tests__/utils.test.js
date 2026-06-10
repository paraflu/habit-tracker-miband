const {
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
} = require('../src/common/utils')

// Helper: create date string from offset from today
const dateStr = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Helper: create habit object
const makeHabit = (overrides = {}) => ({
  id: '1',
  name: 'Test Habit',
  icon: '⭐',
  color: '#6366f1',
  completions: [],
  streak: 0,
  createdAt: dateStr(-30),
  ...overrides
})

describe('Date Functions', () => {
  describe('today()', () => {
    test('returns YYYY-MM-DD format', () => {
      const result = today()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    test('returns correct date for given Date object', () => {
      const d = new Date(2026, 5, 10) // June 10, 2026
      expect(today(d)).toBe('2026-06-10')
    })

    test('handles single digit months and days', () => {
      const d = new Date(2026, 0, 5) // January 5, 2026
      expect(today(d)).toBe('2026-01-05')
    })
  })

  describe('yesterday()', () => {
    test('returns previous day', () => {
      const result = yesterday()
      const expected = dateStr(-1)
      expect(result).toBe(expected)
    })

    test('returns correct date for given Date object', () => {
      const d = new Date(2026, 5, 10) // June 10, 2026
      expect(yesterday(d)).toBe('2026-06-09')
    })

    test('handles month boundary', () => {
      const d = new Date(2026, 0, 1) // January 1
      expect(yesterday(d)).toBe('2025-12-31')
    })
  })

  describe('formatDate()', () => {
    test('formats date correctly', () => {
      const d = new Date(2026, 5, 10) // June 10, 2026
      expect(formatDate(d)).toBe('Wed, Jun 10')
    })

    test('formats first day of month', () => {
      const d = new Date(2026, 0, 1) // January 1
      expect(formatDate(d)).toBe('Thu, Jan 1')
    })

    test('formats last day of month', () => {
      const d = new Date(2026, 11, 31) // December 31
      expect(formatDate(d)).toBe('Thu, Dec 31')
    })
  })
})

describe('Streak Calculation', () => {
  describe('calcStreak()', () => {
    test('returns 0 for empty completions', () => {
      expect(calcStreak([], dateStr(0), dateStr(-1))).toBe(0)
    })

    test('returns 0 for null completions', () => {
      expect(calcStreak(null, dateStr(0), dateStr(-1))).toBe(0)
    })

    test('returns 0 if not completed today or yesterday', () => {
      const completions = [dateStr(-5), dateStr(-6)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(0)
    })

    test('returns 1 if completed today only', () => {
      const completions = [dateStr(0)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(1)
    })

    test('returns 1 if completed yesterday only', () => {
      const completions = [dateStr(-1)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(1)
    })

    test('returns 2 for consecutive days (today + yesterday)', () => {
      const completions = [dateStr(0), dateStr(-1)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(2)
    })

    test('returns 5 for 5 consecutive days ending today', () => {
      const completions = [
        dateStr(0), dateStr(-1), dateStr(-2), dateStr(-3), dateStr(-4)
      ]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(5)
    })

    test('returns 3 for streak starting from yesterday', () => {
      // Completed yesterday, day before, 3 days ago, but NOT today
      const completions = [dateStr(-1), dateStr(-2), dateStr(-3)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(3)
    })

    test('breaks streak on gap day', () => {
      // Completed today, 2 days ago, 3 days ago (gap at yesterday)
      const completions = [dateStr(0), dateStr(-2), dateStr(-3)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(1)
    })

    test('handles non-sequential completions', () => {
      const completions = [dateStr(0), dateStr(-3), dateStr(-5)]
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(1)
    })

    test('handles long streak (30 days)', () => {
      const completions = Array.from({ length: 30 }, (_, i) => dateStr(-i))
      expect(calcStreak(completions, dateStr(0), dateStr(-1))).toBe(30)
    })
  })

  describe('calcHabitStreak()', () => {
    test('returns 0 for null habit', () => {
      expect(calcHabitStreak(null, dateStr(0), dateStr(-1))).toBe(0)
    })

    test('returns 0 for habit without completions', () => {
      const habit = makeHabit({ completions: undefined })
      expect(calcHabitStreak(habit, dateStr(0), dateStr(-1))).toBe(0)
    })

    test('returns streak for valid habit', () => {
      const habit = makeHabit({
        completions: [dateStr(0), dateStr(-1), dateStr(-2)]
      })
      expect(calcHabitStreak(habit, dateStr(0), dateStr(-1))).toBe(3)
    })
  })
})

describe('Habit Operations', () => {
  describe('isCompletedToday()', () => {
    test('returns false for null habit', () => {
      expect(isCompletedToday(null, dateStr(0))).toBe(false)
    })

    test('returns false when not completed today', () => {
      const habit = makeHabit({ completions: [dateStr(-1)] })
      expect(isCompletedToday(habit, dateStr(0))).toBe(false)
    })

    test('returns true when completed today', () => {
      const habit = makeHabit({ completions: [dateStr(0)] })
      expect(isCompletedToday(habit, dateStr(0))).toBe(true)
    })
  })

  describe('toggleCompletion()', () => {
    test('returns null for null habit', () => {
      expect(toggleCompletion(null, dateStr(0))).toBe(null)
    })

    test('adds date when not completed', () => {
      const habit = makeHabit({ completions: [] })
      const updated = toggleCompletion(habit, dateStr(0))
      expect(updated.completions).toContain(dateStr(0))
    })

    test('removes date when already completed', () => {
      const habit = makeHabit({ completions: [dateStr(0)] })
      const updated = toggleCompletion(habit, dateStr(0))
      expect(updated.completions).not.toContain(dateStr(0))
    })

    test('preserves other completions', () => {
      const habit = makeHabit({ completions: [dateStr(-1), dateStr(-2)] })
      const updated = toggleCompletion(habit, dateStr(0))
      expect(updated.completions).toContain(dateStr(-1))
      expect(updated.completions).toContain(dateStr(-2))
      expect(updated.completions).toContain(dateStr(0))
    })

    test('does not mutate original habit', () => {
      const habit = makeHabit({ completions: [] })
      toggleCompletion(habit, dateStr(0))
      expect(habit.completions).toHaveLength(0)
    })

    test('handles habit without completions array', () => {
      const habit = makeHabit({ completions: undefined })
      const updated = toggleCompletion(habit, dateStr(0))
      expect(updated.completions).toContain(dateStr(0))
    })
  })
})

describe('Data Cleanup', () => {
  describe('cleanOldCompletions()', () => {
    test('keeps recent completions', () => {
      const habit = makeHabit({
        completions: [dateStr(0), dateStr(-10), dateStr(-30)]
      })
      const cleaned = cleanOldCompletions(habit, 90)
      expect(cleaned.completions).toHaveLength(3)
    })

    test('removes old completions (>90 days)', () => {
      const habit = makeHabit({
        completions: [dateStr(0), dateStr(-50), dateStr(-100)]
      })
      const cleaned = cleanOldCompletions(habit, 90)
      expect(cleaned.completions).toHaveLength(2)
      expect(cleaned.completions).toContain(dateStr(0))
      expect(cleaned.completions).toContain(dateStr(-50))
    })

    test('respects custom daysToKeep', () => {
      const habit = makeHabit({
        completions: [dateStr(0), dateStr(-5), dateStr(-10)]
      })
      const cleaned = cleanOldCompletions(habit, 7)
      expect(cleaned.completions).toHaveLength(2)
    })

    test('returns habit unchanged if no completions', () => {
      const habit = makeHabit({ completions: [] })
      const cleaned = cleanOldCompletions(habit, 90)
      expect(cleaned.completions).toHaveLength(0)
    })

    test('returns null habit as-is', () => {
      expect(cleanOldCompletions(null, 90)).toBe(null)
    })
  })
})

describe('Validation', () => {
  describe('validateHabitName()', () => {
    test('rejects null name', () => {
      const result = validateHabitName(null)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name is required')
    })

    test('rejects undefined name', () => {
      const result = validateHabitName(undefined)
      expect(result.valid).toBe(false)
    })

    test('rejects empty string', () => {
      const result = validateHabitName('')
      expect(result.valid).toBe(false)
    })

    test('rejects whitespace-only string', () => {
      const result = validateHabitName('   ')
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name cannot be empty')
    })

    test('rejects name longer than 50 chars', () => {
      const longName = 'A'.repeat(51)
      const result = validateHabitName(longName)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Name too long (max 50 chars)')
    })

    test('accepts valid name', () => {
      const result = validateHabitName('Exercise 30min')
      expect(result.valid).toBe(true)
    })

    test('accepts name with exactly 50 chars', () => {
      const name = 'A'.repeat(50)
      const result = validateHabitName(name)
      expect(result.valid).toBe(true)
    })

    test('accepts name with special characters', () => {
      const result = validateHabitName('🏃 Run 5km @ park!')
      expect(result.valid).toBe(true)
    })
  })
})

describe('Habit Creation', () => {
  describe('createHabit()', () => {
    test('creates habit with provided values', () => {
      const habit = createHabit('Exercise', '💪', '#22c55e')
      expect(habit.name).toBe('Exercise')
      expect(habit.icon).toBe('💪')
      expect(habit.color).toBe('#22c55e')
      expect(habit.completions).toEqual([])
      expect(habit.streak).toBe(0)
    })

    test('trims whitespace from name', () => {
      const habit = createHabit('  Exercise  ', '💪', '#22c55e')
      expect(habit.name).toBe('Exercise')
    })

    test('uses default icon if not provided', () => {
      const habit = createHabit('Exercise', null, '#22c55e')
      expect(habit.icon).toBe('⭐')
    })

    test('uses default color if not provided', () => {
      const habit = createHabit('Exercise', '💪', null)
      expect(habit.color).toBe('#6366f1')
    })

    test('generates id with timestamp', () => {
      const habit = createHabit('Habit 1', '⭐', '#6366f1')
      // ID should be a numeric string (timestamp)
      expect(habit.id).toMatch(/^\d+$/)
      expect(Number(habit.id)).toBeGreaterThan(0)
    })

    test('sets creation date', () => {
      const habit = createHabit('Exercise', '💪', '#22c55e', '2026-06-10')
      expect(habit.createdAt).toBe('2026-06-10')
    })

    test('defaults creation date to today', () => {
      const habit = createHabit('Exercise', '💪', '#22c55e')
      expect(habit.createdAt).toBe(today())
    })
  })
})

describe('Statistics', () => {
  describe('calcStats()', () => {
    test('returns zero stats for empty habits', () => {
      const stats = calcStats([], dateStr(0))
      expect(stats.completedToday).toBe(0)
      expect(stats.totalHabits).toBe(0)
      expect(stats.bestStreak).toBe(0)
      expect(stats.totalCompletions).toBe(0)
      expect(stats.overallRate).toBe(0)
    })

    test('returns zero stats for null habits', () => {
      const stats = calcStats(null, dateStr(0))
      expect(stats.completedToday).toBe(0)
      expect(stats.totalHabits).toBe(0)
    })

    test('counts completed today correctly', () => {
      const habits = [
        makeHabit({ id: '1', completions: [dateStr(0)] }),
        makeHabit({ id: '2', completions: [dateStr(-1)] }),
        makeHabit({ id: '3', completions: [dateStr(0)] })
      ]
      const stats = calcStats(habits, dateStr(0))
      expect(stats.completedToday).toBe(2)
      expect(stats.totalHabits).toBe(3)
    })

    test('calculates best streak', () => {
      const habits = [
        makeHabit({ id: '1', streak: 5 }),
        makeHabit({ id: '2', streak: 10 }),
        makeHabit({ id: '3', streak: 3 })
      ]
      const stats = calcStats(habits, dateStr(0))
      expect(stats.bestStreak).toBe(10)
    })

    test('calculates total completions', () => {
      const habits = [
        makeHabit({ id: '1', completions: [dateStr(0), dateStr(-1)] }),
        makeHabit({ id: '2', completions: [dateStr(0)] })
      ]
      const stats = calcStats(habits, dateStr(0))
      expect(stats.totalCompletions).toBe(3)
    })

    test('calculates overall rate', () => {
      const habits = [
        makeHabit({
          id: '1',
          completions: [dateStr(0), dateStr(-1)],
          createdAt: dateStr(-10)
        })
      ]
      const stats = calcStats(habits, dateStr(0))
      expect(stats.overallRate).toBeGreaterThanOrEqual(0)
      expect(typeof stats.overallRate).toBe('number')
    })
  })
})

describe('Sorting and Filtering', () => {
  describe('getSortedByStreak()', () => {
    test('returns empty array for null habits', () => {
      expect(getSortedByStreak(null)).toEqual([])
    })

    test('returns habits sorted by streak descending', () => {
      const habits = [
        makeHabit({ id: '1', streak: 3 }),
        makeHabit({ id: '2', streak: 10 }),
        makeHabit({ id: '3', streak: 5 })
      ]
      const sorted = getSortedByStreak(habits)
      expect(sorted[0].streak).toBe(10)
      expect(sorted[1].streak).toBe(5)
      expect(sorted[2].streak).toBe(3)
    })

    test('respects limit parameter', () => {
      const habits = [
        makeHabit({ id: '1', streak: 3 }),
        makeHabit({ id: '2', streak: 10 }),
        makeHabit({ id: '3', streak: 5 }),
        makeHabit({ id: '4', streak: 8 })
      ]
      const sorted = getSortedByStreak(habits, 2)
      expect(sorted).toHaveLength(2)
      expect(sorted[0].streak).toBe(10)
      expect(sorted[1].streak).toBe(8)
    })

    test('does not mutate original array', () => {
      const habits = [
        makeHabit({ id: '1', streak: 3 }),
        makeHabit({ id: '2', streak: 10 })
      ]
      getSortedByStreak(habits)
      expect(habits[0].streak).toBe(3)
      expect(habits[1].streak).toBe(10)
    })

    test('handles habits with undefined streak', () => {
      const habits = [
        makeHabit({ id: '1', streak: undefined }),
        makeHabit({ id: '2', streak: 5 })
      ]
      const sorted = getSortedByStreak(habits)
      expect(sorted[0].streak).toBe(5)
      expect(sorted[1].streak).toBeUndefined()
    })
  })
})
