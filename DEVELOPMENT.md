# Development Notes - Habit Tracker

## Technical Decisions

### Storage Strategy
- **Key**: `habits_data` - single JSON blob
- **Format**: Array of habit objects with completions array
- **Cleanup**: Auto-remove completions older than 90 days
- **Why**: Simple, atomic writes, avoids complex indexing

### Streak Calculation
- Checks consecutive days backwards from today
- If completed today → start from today
- If completed yesterday (but not today) → start from yesterday
- If neither → streak = 0
- **Why**: Prevents false streaks when missing a day

### UI Design
- **480px logical width** (212px physical × ~2.27 scale)
- **Dark theme** (#0a0a0f background) for AMOLED
- **Bottom navigation** with centered add button
- **Touch targets**: Minimum 48px for accessibility
- **Why**: Optimized for Mi Band 10 display and touch input

### Vibration Feedback
- Uses `system.vibrator` with 'short' mode
- Triggers on habit completion
- **Why**: Provides haptic confirmation without being annoying

### Data Cleanup
- Runs on app init (`cleanOldCompletions`)
- Keeps last 90 days of completions
- **Why**: Prevents storage bloat while maintaining useful history

## Common Issues

### 1. Streak Resets Unexpectedly
**Cause**: App wasn't opened on a day
**Solution**: Streaks check both today AND yesterday. If you complete a habit yesterday but not today, the streak continues when you open the app today.

### 2. Data Lost After Uninstall
**Cause**: `system.storage` is per-app, cleared on uninstall
**Solution**: No fix - data is tied to the app installation. Consider exporting feature for future versions.

### 3. Storage Quota Exceeded
**Cause**: Too many habits with long completion history
**Solution**: 90-day cleanup prevents this. If still happening, reduce max habits.

## Performance Considerations

### Storage Operations
- Single write per change (saveData)
- No debouncing needed (low frequency)
- JSON.parse/stringify for simplicity

### Rendering
- Max 10-15 habits recommended
- List rendering handled by Vela JS framework
- No virtual scrolling needed at this scale

### Memory
- Habit objects are lightweight (~200 bytes each)
- Completions array: ~10 bytes per day
- 10 habits × 90 days ≈ 20KB total

## Testing Checklist

- [ ] Add new habit with custom icon/color
- [ ] Complete habit (checkbox turns green, vibration)
- [ ] Uncomplete habit (checkbox clears)
- [ ] Delete habit
- [ ] Streak increments on consecutive days
- [ ] Streak resets after missing a day
- [ ] Stats update correctly
- [ ] Data persists after app restart
- [ ] Old completions cleaned up (>90 days)
- [ ] Empty state shows when no habits

## Future Enhancements

1. **Reminders**: Local notifications at specific times
2. **Export/Backup**: Save habits to file
3. **Categories**: Group habits by type
4. **Notes**: Add daily notes to completions
5. **Charts**: Visualize completion trends
6. **Themes**: Light/dark mode toggle
7. **Multi-day**: Habits with weekly frequency
8. **Sharing**: Compare with friends

## Build & Deploy

### Local Development
1. Open AIoT-IDE
2. File → Open Folder → project root
3. Edit src/pages/index/index.ux
4. Live preview on connected device

### Production Build
```bash
# Via CLI
aiot-ide build --target rpk

# Output
dist/com.forlin.habittracker.rpk
```

### Install on Device
```bash
# Via CLI (requires USB connection)
aiot-ide install --device <mac-address>

# Via Mi Fitness app
# Transfer RPK file manually
```

## Code Style

- **ES6+** features (arrow functions, template literals, destructuring)
- **No semicolons** (prettier config)
- **Single quotes** (prettier config)
- **2 spaces** indent (prettier config)
- **Functional components** where possible
- **Descriptive variable names** (no abbreviations)

## Git Workflow

- **Conventional commits** enforced via commitlint
- **Husky** pre-commit hook runs lint-staged
- **Branch naming**: `feature/xxx`, `fix/xxx`, `docs/xxx`

Example:
```bash
git commit -m "feat: add habit completion streak tracking"
git commit -m "fix: correct streak calculation for yesterday"
git commit -m "docs: update README with installation steps"
```
