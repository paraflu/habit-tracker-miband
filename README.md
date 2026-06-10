# Habit Tracker for Xiaomi Mi Band 10 📋

A comprehensive habit tracking app built with Vela JS for Xiaomi Mi Band 10.

## Features

- ✅ **Track daily habits** with simple tap-to-complete
- 🔥 **Streak tracking** - see consecutive day streaks
- 📊 **Statistics** - completion rates, best streaks, all-time stats
- 🎨 **Customizable** - choose icons and colors for each habit
- 💾 **Persistent storage** - habits survive app restarts
- 📱 **Optimized UI** - designed for 212×520px AMOLED display

## Screenshots

### Today View
- List of habits with checkboxes
- Streak indicators (🔥)
- Completion counter
- Add new habits with + button

### Add Habit
- Name input
- Icon picker (12 options)
- Color picker (6 colors)
- Save/cancel buttons

### Statistics
- Total habits count
- Best streak
- All-time completions
- Overall completion rate
- Top 5 streaks leaderboard

## Tech Stack

- **Runtime**: Vela JS (ES6+)
- **Storage**: system.storage (persistent)
- **Vibration**: system.vibrator (haptic feedback)
- **Target**: Xiaomi Mi Band 10 (HyperOS 2)
- **Display**: 212×520px AMOLED (480px logical)

## Installation

### Build from Source

1. Clone the repository:
```bash
git clone https://github.com/paraflu/habit-tracker-miband.git
cd habit-tracker-miband
```

2. Open in AIoT-IDE:
   - File → Open Folder → select the project root
   - AIoT-IDE will detect the Vela JS project

3. Build the RPK:
   - Click Build → Build RPK
   - Output: `dist/com.forlin.habittracker.rpk`

4. Install on Mi Band 10:
   - Use AIoT-IDE's Install feature
   - Or transfer via Mi Fitness app

### Pre-built RPK

Download the latest release from [GitHub Releases](https://github.com/paraflu/habit-tracker-miband/releases)

## Usage

1. **Add a habit**: Tap the + button at the bottom center
2. **Complete a habit**: Tap the circle next to the habit name
3. **Delete a habit**: Tap the × button on the right
4. **View stats**: Tap the 📊 icon in the bottom nav

## Data Storage

Habits are stored locally on the device using `system.storage`. Data includes:
- Habit name, icon, color
- Completion dates (last 90 days)
- Streak counts

No data is sent externally - everything stays on your band.

## Customization

### Available Icons
⭐ 💪 📚 💧 🧘 🏃 🎯 ✍️ 🎵 💤 🥗 🧹

### Available Colors
Indigo (#6366f1) | Green (#22c55e) | Orange (#f97316) | Red (#ef4444) | Cyan (#06b6d4) | Yellow (#eab308)

## Development

### Project Structure

```
habit-tracker-miband/
├── src/
│   ├── app.ux              # App entry point
│   ├── manifest.json       # App configuration
│   ├── pages/
│   │   └── index/
│   │       └── index.ux    # Main UI + logic (500+ lines)
│   └── common/
│       └── logo.png        # App icon (108×108px)
├── .gitignore
├── build.sh               # Build helper script
└── README.md
```

### Key Implementation Details

- **Streak Calculation**: Checks consecutive days backwards from today/yesterday
- **Storage Cleanup**: Auto-removes completions older than 90 days
- **Haptic Feedback**: Vibration on habit completion
- **Real-time Updates**: Stats refresh immediately after changes

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created by [@paraflu](https://github.com/paraflu) with Hermes Agent
