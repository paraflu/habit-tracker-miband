/**
 * Edge Cases and Integration Tests
 * Tests for boundary conditions and real-world scenarios
 */

const {
  today,
  yesterday,
  calcStreak,
  calcHabitStreak,
  isCompletedToday,
  toggleCompletion,
  cleanOldCompletions,
  validateHabitName,
  createHabit,
  calcStats,
  getSortedByStreak
} = require('../src/common/utils')

// Helper: create date string from offset
const dateStr = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Helper: create habit
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

describe('Edge Cases', () => {
  describe('Date Edge Cases', () => {
    test('handles leap year', () => {
      const leapDay = new Date(2028, 1, 29) // Feb 29, 2028
      const result = today(leapDay)
      expect(result).toBe('2028-02-29')
    })

    test('handles year boundary', () => {
      const newYear = new Date(2026, 0, 1) // Jan 1
      const result = yesterday(newYear)
      expect(result).toBe('2025-12-31')
    })

    test('handles month with 31 days', () => {
      const jan31 = new Date(2026, 0, 31)
      const result = yesterday(jan31)
      expect(result).toBe('2026-01-30')
    })
  })

  describe('Streak Edge Cases', () => {
    test('streak breaks on today but continues from yesterday', () => {
      // Completed yesterday and 2 days ago, but NOT today
      const completions = [dateStr(-1), dateStr(-2)]
      const streak = calcStreak(completions, dateStr(0), dateStr(-1))
      expect(streak).toBe(2)
    })

    test('streak resets if yesterday missed', () => {
      // Completed today and 2 days ago, but NOT yesterday
      const completions = [dateStr(0), dateStr(-2)]
      const streak = calcStreak(completions, dateStr(0), dateStr(-1))
      expect(streak).toBe(1) // Only today counts
    })

    test('single completion 100 days ago has no streak', () => {
      const completions = [dateStr(-100)]
      const streak = calcStreak(completions, dateStr(0), dateStr(-1))
      expect(streak).toBe(0)
    })

    test('multiple completions on same day counts as 1', () => {
      // Duplicate entries for same day
      const completions = [dateStr(0), dateStr(0), dateStr(-1)]
      const streak = calcStreak(completions, dateStr(0), dateStr(-1))
      expect(streak).toBe(2) // Today + yesterday
    })

    test('future dates do not affect streak', () => {
      // Should not have future dates, but if they exist
      const completions = [dateStr(0), dateStr(1)]
      const streak = calcStreak(completions, dateStr(0), dateStr(-1))
      expect(streak).toBe(1) // Only today counts
    })
  })

  describe('Validation Edge Cases', () => {
    test('rejects numeric input', () => {
      const result = validateHabitName(123)
      expect(result.valid).toBe(false)
    })

    test('rejects boolean input', () => {
      const result = validateHabitName(true)
      expect(result.valid).toBe(false)
    })

    test('rejects object input', () => {
      const result = validateHabitName({})
      expect(result.valid).toBe(false)
    })

    test('accepts emoji in name', () => {
      const result = validateHabitName('🏃 Run 5km')
      expect(result.valid).toBe(true)
    })

    test('accepts unicode characters', () => {
      const result = validateHabitName('Correre 5km al parco')
      expect(result.valid).toBe(true)
    })

    test('accepts name with numbers', () => {
      const result = validateHabitName('Drink 8 glasses')
      expect(result.valid).toBe(true)
    })
  })

  describe('Creation Edge Cases', () => {
    test('trims excessive whitespace', () => {
      const habit = createHabit('   Exercise   ', '💪', '#22c55e')
      expect(habit.name).toBe('Exercise')
    })

    test('preserves intentional spacing', () => {
      const habit = createHabit('Morning Run', '🏃', '#22c55e')
      expect(habit.name).toBe('Morning Run')
    })

    test('handles very long valid name (50 chars)', () => {
      const name = 'A'.repeat(50)
      const habit = createHabit(name, '⭐', '#6366f1')
      expect(habit.name).toBe(name)
      expect(habit.name).toHaveLength(50)
    })
  })
})

describe('Real-World Scenarios', () => {
  describe('Weekly Habit Tracking', () => {
    test('track 7-day streak', () => {
      let habit = makeHabit({ completions: [] })

      // Complete for 7 consecutive days
      for (let i = -6; i <= 0; i++) {
        habit = toggleCompletion(habit, dateStr(i))
      }

      const streak = calcHabitStreak(habit, dateStr(0), dateStr(-1))
      expect(streak).toBe(7)
    })

    test('track habit with missed day', () => {
      let habit = makeHabit({ completions: [] })

      // Complete for 5 days, miss 1, complete 2 more
      for (let i = -8; i <= -4; i++) {
        habit = toggleCompletion(habit, dateStr(i))
      }
      // Skip day -3
      for (let i = -2; i <= 0; i++) {
        habit = toggleCompletion(habit, dateStr(i))
      }

      const streak = calcHabitStreak(habit, dateStr(0), dateStr(-1))
      expect(streak).toBe(3) // Only last 3 days count
    })
  })

  describe('Multiple Habits Management', () => {
    test('manage multiple habits with different states', () => {
      const habits = [
        makeHabit({
          id: '1',
          name: 'Exercise',
          completions: [dateStr(0), dateStr(-1)],
          streak: 2
        }),
        makeHabit({
          id: '2',
          name: 'Read',
          completions: [dateStr(-1)],
          streak: 1
        }),
        makeHabit({
          id: '3',
          name: 'Meditate',
          completions: [],
          streak: 0
        })
      ]

      const stats = calcStats(habits, dateStr(0))

      expect(stats.totalHabits).toBe(3)
      expect(stats.completedToday).toBe(1) // Only Exercise
      expect(stats.bestStreak).toBe(2)
      expect(stats.totalCompletions).toBe(3)
    })

    test('sorted by streak shows top habits', () => {
      const habits = [
        makeHabit({ id: '1', name: 'Exercise', streak: 5 }),
        makeHabit({ id: '2', name: 'Read', streak: 10 }),
        makeHabit({ id: '3', name: 'Meditate', streak: 3 }),
        makeHabit({ id: '4', name: 'Journal', streak: 7 })
      ]

      const top3 = getSortedByStreak(habits, 3)

      expect(top3).toHaveLength(3)
      expect(top3[0].name).toBe('Read') // 10
      expect(top3[1].name).toBe('Journal') // 7
      expect(top3[2].name).toBe('Exercise') // 5
    })
  })

  describe('Data Cleanup Scenarios', () => {
    test('cleanup preserves recent data', () => {
      const habit = makeHabit({
        completions: Array.from({ length: 100 }, (_, i) => dateStr(-i))
      })

      const cleaned = cleanOldCompletions(habit, 90)

      // Should keep last 90 days
      expect(cleaned.completions.length).toBeLessThanOrEqual(91)
      expect(cleaned.completions).toContain(dateStr(0)) // Today
      expect(cleaned.completions).toContain(dateStr(-89)) // 89 days ago
    })

    test('cleanup handles empty completions', () => {
      const habit = makeHabit({ completions: [] })
      const cleaned = cleanOldCompletions(habit, 90)
      expect(cleaned.completions).toHaveLength(0)
    })

    test('cleanup handles single completion', () => {
      const habit = makeHabit({ completions: [dateStr(0)] })
      const cleaned = cleanOldCompletions(habit, 90)
      expect(cleaned.completions).toHaveLength(1)
    })
  })

  describe('Storage Persistence', () => {
    test('habit data survives multiple save/load cycles', () => {
      let habits = [
        makeHabit({ id: '1', name: 'Exercise', completions: [dateStr(0)] })
      ]

      // Simulate 5 save/load cycles
      for (let i = 0; i < 5; i++) {
        const serialized = JSON.stringify(habits)
        habits = JSON.parse(serialized)
      }

      expect(habits).toHaveLength(1)
      expect(habits[0].completions).toContain(dateStr(0))
    })

    test('toggle preserves data integrity', () => {
      let habit = makeHabit({
        id: '1',
        name: 'Exercise',
        completions: [dateStr(-1), dateStr(-2)]
      })

      // Toggle multiple times
      habit = toggleCompletion(habit, dateStr(0))
      habit = toggleCompletion(habit, dateStr(0))
      habit = toggleCompletion(habit, dateStr(0))

      // Should be completed (odd number of toggles)
      expect(habit.completions).toContain(dateStr(0))
      expect(habit.completions).toContain(dateStr(-1))
      expect(habit.completions).toContain(dateStr(-2))
    })
  })
})
