/**
 * Storage Operations Tests
 * Tests for data persistence patterns (mocked storage)
 */

const {
  today,
  createHabit,
  toggleCompletion,
  cleanOldCompletions,
  calcHabitStreak,
  calcStats
} = require('../src/common/utils')

// Mock storage module
const mockStorage = {
  _data: {},
  get: jest.fn(({ key, success }) => {
    const value = mockStorage._data[key] || null
    if (success) success(value)
    return value
  }),
  set: jest.fn(({ key, value }) => {
    mockStorage._data[key] = value
    return true
  }),
  clear: jest.fn(() => {
    mockStorage._data = {}
    return true
  }),
  delete: jest.fn(({ key }) => {
    delete mockStorage._data[key]
    return true
  })
}

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

describe('Storage Operations', () => {
  beforeEach(() => {
    mockStorage.clear()
    jest.clearAllMocks()
  })

  describe('Save and Load Habits', () => {
    test('saves habits to storage', () => {
      const habits = [
        makeHabit({ id: '1', name: 'Exercise' }),
        makeHabit({ id: '2', name: 'Read' })
      ]

      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      expect(mockStorage.set).toHaveBeenCalledWith({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })
    })

    test('loads habits from storage', () => {
      const habits = [
        makeHabit({ id: '1', name: 'Exercise' })
      ]

      // Pre-populate storage
      mockStorage._data['habits_data'] = JSON.stringify(habits)

      mockStorage.get({
        key: 'habits_data',
        success: (data) => {
          const loaded = JSON.parse(data)
          expect(loaded).toHaveLength(1)
          expect(loaded[0].name).toBe('Exercise')
        }
      })
    })

    test('returns null for non-existent key', () => {
      mockStorage.get({
        key: 'non_existent',
        success: (data) => {
          expect(data).toBeNull()
        }
      })
    })
  })

  describe('Habit Lifecycle', () => {
    test('full lifecycle: create, complete, uncomplete, delete', () => {
      // Start with empty storage
      let habits = []

      // Create habit
      const newHabit = createHabit('Exercise', '💪', '#22c55e')
      habits.push(newHabit)

      // Save to storage
      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      // Load from storage
      mockStorage.get({
        key: 'habits_data',
        success: (data) => {
          habits = JSON.parse(data)
        }
      })

      expect(habits).toHaveLength(1)
      expect(habits[0].name).toBe('Exercise')

      // Complete habit
      const todayStr = today()
      habits[0] = toggleCompletion(habits[0], todayStr)

      // Save updated
      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      // Verify completion
      expect(habits[0].completions).toContain(todayStr)

      // Uncomplete habit
      habits[0] = toggleCompletion(habits[0], todayStr)

      // Save updated
      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      // Verify uncompleted
      expect(habits[0].completions).not.toContain(todayStr)

      // Delete habit
      habits = habits.filter(h => h.id !== newHabit.id)

      // Save updated
      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      // Verify deleted
      expect(habits).toHaveLength(0)
    })

    test('multiple habits independent completions', () => {
      let habits = [
        createHabit('Exercise', '💪', '#22c55e'),
        createHabit('Read', '📚', '#6366f1')
      ]

      const todayStr = today()
      const yesterdayStr = dateStr(-1)

      // Complete first habit today
      habits[0] = toggleCompletion(habits[0], todayStr)

      // Complete second habit yesterday
      habits[1] = toggleCompletion(habits[1], yesterdayStr)

      // Save
      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      // Load and verify
      mockStorage.get({
        key: 'habits_data',
        success: (data) => {
          const loaded = JSON.parse(data)
          expect(loaded[0].completions).toContain(todayStr)
          expect(loaded[0].completions).not.toContain(yesterdayStr)
          expect(loaded[1].completions).toContain(yesterdayStr)
          expect(loaded[1].completions).not.toContain(todayStr)
        }
      })
    })
  })

  describe('Data Cleanup', () => {
    test('removes old completions on save', () => {
      const habits = [
        makeHabit({
          id: '1',
          completions: [dateStr(0), dateStr(-50), dateStr(-100)]
        })
      ]

      // Clean old completions before saving
      const cleaned = habits.map(h => cleanOldCompletions(h, 90))

      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(cleaned)
      })

      // Verify cleanup
      mockStorage.get({
        key: 'habits_data',
        success: (data) => {
          const loaded = JSON.parse(data)
          expect(loaded[0].completions).toHaveLength(2)
          expect(loaded[0].completions).toContain(dateStr(0))
          expect(loaded[0].completions).toContain(dateStr(-50))
        }
      })
    })
  })

  describe('Streak Persistence', () => {
    test('streaks survive storage round-trip', () => {
      const habits = [
        makeHabit({
          id: '1',
          completions: [dateStr(0), dateStr(-1), dateStr(-2)],
          streak: 3
        })
      ]

      // Save
      mockStorage.set({
        key: 'habits_data',
        value: JSON.stringify(habits)
      })

      // Load
      mockStorage.get({
        key: 'habits_data',
        success: (data) => {
          const loaded = JSON.parse(data)
          const streak = calcHabitStreak(loaded[0], dateStr(0), dateStr(-1))
          expect(streak).toBe(3)
        }
      })
    })
  })

  describe('Stats Calculation', () => {
    test('stats update after habit changes', () => {
      let habits = [
        makeHabit({
          id: '1',
          completions: [dateStr(0)],
          streak: 1
        }),
        makeHabit({
          id: '2',
          completions: [],
          streak: 0
        })
      ]

      // Calculate stats
      const stats = calcStats(habits, dateStr(0))

      expect(stats.totalHabits).toBe(2)
      expect(stats.completedToday).toBe(1)
      expect(stats.bestStreak).toBe(1)
      expect(stats.totalCompletions).toBe(1)

      // Complete second habit
      habits[1] = toggleCompletion(habits[1], dateStr(0))

      // Recalculate stats
      const newStats = calcStats(habits, dateStr(0))

      expect(newStats.completedToday).toBe(2)
      expect(newStats.totalCompletions).toBe(2)
    })
  })

  describe('Storage Error Handling', () => {
    test('handles storage.get failure gracefully', () => {
      const failStorage = {
        get: jest.fn(({ key, fail }) => {
          if (fail) fail(null, 'STORAGE_NOT_FOUND')
          return null
        })
      }

      let loadedData = null
      failStorage.get({
        key: 'habits_data',
        success: (data) => {
          loadedData = data
        },
        fail: (data, code) => {
          loadedData = []
        }
      })

      expect(loadedData).toEqual([])
    })

    test('handles storage.set failure gracefully', () => {
      const failStorage = {
        set: jest.fn(() => {
          throw new Error('Storage quota exceeded')
        })
      }

      expect(() => {
        failStorage.set({
          key: 'habits_data',
          value: '[]'
        })
      }).toThrow('Storage quota exceeded')
    })
  })
})
