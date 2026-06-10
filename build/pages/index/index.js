(function(){
    
    var createPageHandler = function() {
      return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/script-loader.js!./node_modules/@hap-toolkit/packager/lib/loaders/module-loader.js!./node_modules/babel-loader/lib/index.js?cwd=/home/andrea/projects/habit-tracker-miband&cacheDirectory&plugins[]=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/packager/babel.config.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/access-loader.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/pages/index/index.ux?uxType=page":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/script-loader.js!./node_modules/@hap-toolkit/packager/lib/loaders/module-loader.js!./node_modules/babel-loader/lib/index.js?cwd=/home/andrea/projects/habit-tracker-miband&cacheDirectory&plugins[]=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/packager/babel.config.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/access-loader.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/pages/index/index.ux?uxType=page ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = function __scriptModule__ (module, exports, $app_require$){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _system = _interopRequireDefault($app_require$("@app-module/system.storage"));
var _system2 = _interopRequireDefault($app_require$("@app-module/system.vibrator"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const formatDate = d => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
};
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
var _default = exports.default = {
  data: {
    view: 'today',
    habits: [],
    pageTitle: 'Habits',
    currentDate: formatDate(new Date()),
    newHabitName: '',
    newHabitIcon: '⭐',
    newHabitColor: '#6366f1',
    availableIcons: ['⭐', '💪', '📚', '💧', '🧘', '🏃', '🎯', '✍️', '🎵', '💤', '🥗', '🧹'],
    availableColors: ['#6366f1', '#22c55e', '#f97316', '#ef4444', '#06b6d4', '#eab308'],
    completedToday: 0,
    totalHabits: 0,
    bestStreak: 0,
    totalCompletions: 0,
    overallRate: 0
  },
  onInit() {
    this.loadData();
  },
  saveData() {
    _system.default.set({
      key: 'habits_data',
      value: JSON.stringify(this.habits)
    });
    this.updateStats();
  },
  loadData() {
    _system.default.get({
      key: 'habits_data',
      success: data => {
        if (data) {
          this.habits = JSON.parse(data);
          this.cleanOldCompletions();
          this.updateStreaks();
          this.updateStats();
        }
      },
      fail: (data, code) => {
        console.log(`Storage read failed: ${code}`);
        this.habits = [];
      }
    });
  },
  toggleHabit(id) {
    const habit = this.habits.find(h => h.id === id);
    if (!habit) return;
    const todayStr = today();
    if (!habit.completions) habit.completions = [];
    const idx = habit.completions.indexOf(todayStr);
    if (idx >= 0) {
      habit.completions.splice(idx, 1);
    } else {
      habit.completions.push(todayStr);
      _system2.default.vibrate({
        mode: 'short'
      });
    }
    this.saveData();
  },
  deleteHabit(id) {
    this.habits = this.habits.filter(h => h.id !== id);
    this.saveData();
  },
  isCompletedToday(id) {
    const habit = this.habits.find(h => h.id === id);
    if (!habit || !habit.completions) return false;
    return habit.completions.indexOf(today()) >= 0;
  },
  updateStreaks() {
    const todayStr = today();
    const yestStr = yesterday();
    this.habits.forEach(habit => {
      if (!habit.completions) habit.completions = [];
      habit.streak = this.calcStreak(habit.completions, todayStr, yestStr);
    });
  },
  calcStreak(completions, todayStr, yestStr) {
    if (!completions || completions.length === 0) return 0;
    if (!completions.includes(todayStr) && !completions.includes(yestStr)) return 0;
    let streak = 0;
    let checkDate = new Date();
    if (!completions.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (completions.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },
  cleanOldCompletions() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;
    this.habits.forEach(habit => {
      if (habit.completions) {
        habit.completions = habit.completions.filter(d => d >= cutoffStr);
      }
    });
  },
  updateStats() {
    this.completedToday = this.habits.filter(h => this.isCompletedToday(h.id)).length;
    this.totalHabits = this.habits.length;
    this.bestStreak = 0;
    this.habits.forEach(h => {
      if (h.streak > this.bestStreak) this.bestStreak = h.streak;
    });
    this.totalCompletions = 0;
    this.habits.forEach(h => {
      if (h.completions) this.totalCompletions += h.completions.length;
    });
    const daysSinceOldest = this.habits.length > 0 ? this.calcDaysSinceOldest() : 1;
    const possibleCompletions = this.habits.length * Math.max(daysSinceOldest, 1);
    this.overallRate = possibleCompletions > 0 ? Math.round(this.totalCompletions / possibleCompletions * 100) : 0;
    if (this.view === 'today') {
      this.pageTitle = `Habits · ${this.completedToday}/${this.totalHabits}`;
    }
  },
  calcDaysSinceOldest() {
    let oldest = new Date();
    this.habits.forEach(h => {
      if (h.completions && h.completions.length > 0) {
        const d = new Date(h.completions[0]);
        if (d < oldest) oldest = d;
      }
    });
    const diff = Math.ceil((new Date() - oldest) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  },
  get sortedByStreak() {
    return [...this.habits].sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5);
  },
  switchView(v) {
    this.view = v;
    if (v === 'today') {
      this.pageTitle = `Habits · ${this.completedToday}/${this.totalHabits}`;
    } else if (v === 'stats') {
      this.pageTitle = 'Statistics';
    }
  },
  startAdd() {
    this.newHabitName = '';
    this.newHabitIcon = '⭐';
    this.newHabitColor = '#6366f1';
    this.view = 'add';
    this.pageTitle = 'New Habit';
  },
  cancelAdd() {
    this.switchView('today');
  },
  setNewHabitName(val) {
    this.newHabitName = val;
  },
  selectIcon(icon) {
    this.newHabitIcon = icon;
  },
  selectColor(color) {
    this.newHabitColor = color;
  },
  saveHabit() {
    if (!this.newHabitName || this.newHabitName.trim().length === 0) return;
    const newHabit = {
      id: Date.now().toString(),
      name: this.newHabitName.trim(),
      icon: this.newHabitIcon,
      color: this.newHabitColor,
      completions: [],
      streak: 0,
      createdAt: today()
    };
    this.habits.push(newHabit);
    this.saveData();
    _system2.default.vibrate({
      mode: 'short'
    });
    this.switchView('today');
  }
};
const moduleOwn = exports.default || module.exports;
const accessors = ['public', 'protected', 'private'];
if (moduleOwn.data && accessors.some(function (acc) {
  return moduleOwn[acc];
})) {
  throw new Error('页面VM对象中的属性data不可与"' + accessors.join(',') + '"同时存在，请使用private替换data名称');
} else if (!moduleOwn.data) {
  moduleOwn.data = {};
  moduleOwn._descriptor = {};
  accessors.forEach(function (acc) {
    const accType = typeof moduleOwn[acc];
    if (accType === 'object') {
      moduleOwn.data = Object.assign(moduleOwn.data, moduleOwn[acc]);
      for (const name in moduleOwn[acc]) {
        moduleOwn._descriptor[name] = {
          access: acc
        };
      }
    } else if (accType === 'function') {
      console.warn('页面VM对象中的属性' + acc + '的值不能是函数，请使用对象');
    }
  });
}}

/***/ }),

/***/ "./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/pages/index/index.ux?uxType=page":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/pages/index/index.ux?uxType=page ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = {
  ".container": {
    "flexDirection": "column",
    "width": "480px",
    "height": "480px",
    "backgroundColor": "#0a0a0f",
    "justifyContent": "space-between"
  },
  ".header": {
    "flexDirection": "column",
    "paddingTop": "20px",
    "paddingRight": "24px",
    "paddingBottom": "10px",
    "paddingLeft": "24px",
    "alignItems": "center"
  },
  ".title": {
    "fontSize": "32px",
    "color": "#ffffff",
    "fontWeight": "bold"
  },
  ".date": {
    "fontSize": "18px",
    "color": "#666677",
    "marginTop": "4px"
  },
  ".content": {
    "flex": 1,
    "flexDirection": "column",
    "overflow": "hidden"
  },
  ".view": {
    "flex": 1,
    "flexDirection": "column",
    "paddingTop": "0px",
    "paddingRight": "20px",
    "paddingBottom": "0px",
    "paddingLeft": "20px"
  },
  ".empty-state": {
    "flex": 1,
    "flexDirection": "column",
    "alignItems": "center",
    "justifyContent": "center"
  },
  ".empty-icon": {
    "fontSize": "48px"
  },
  ".empty-text": {
    "fontSize": "22px",
    "color": "#888899",
    "marginTop": "12px"
  },
  ".empty-sub": {
    "fontSize": "16px",
    "color": "#555566",
    "marginTop": "8px"
  },
  ".habits-list": {
    "flex": 1,
    "flexDirection": "column"
  },
  ".habit-card": {
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "space-between",
    "backgroundColor": "#1a1a2e",
    "borderRadius": "16px",
    "paddingTop": "14px",
    "paddingRight": "16px",
    "paddingBottom": "14px",
    "paddingLeft": "16px",
    "marginBottom": "10px"
  },
  ".habit-left": {
    "flexDirection": "row",
    "alignItems": "center",
    "flex": 1
  },
  ".habit-check": {
    "width": "36px",
    "height": "36px",
    "borderRadius": "18px",
    "borderTopWidth": "2px",
    "borderRightWidth": "2px",
    "borderBottomWidth": "2px",
    "borderLeftWidth": "2px",
    "borderTopColor": "#444466",
    "borderRightColor": "#444466",
    "borderBottomColor": "#444466",
    "borderLeftColor": "#444466",
    "alignItems": "center",
    "justifyContent": "center"
  },
  ".habit-check-checked": {
    "backgroundColor": "#22c55e",
    "borderTopColor": "#22c55e",
    "borderRightColor": "#22c55e",
    "borderBottomColor": "#22c55e",
    "borderLeftColor": "#22c55e"
  },
  ".check-icon": {
    "fontSize": "20px",
    "color": "#ffffff"
  },
  ".habit-info": {
    "flexDirection": "column",
    "marginLeft": "14px",
    "flex": 1
  },
  ".habit-name": {
    "fontSize": "20px",
    "color": "#ffffff"
  },
  ".habit-streak": {
    "fontSize": "15px",
    "color": "#f97316",
    "marginTop": "3px"
  },
  ".habit-delete": {
    "fontSize": "28px",
    "color": "#555566",
    "paddingTop": "4px",
    "paddingRight": "8px",
    "paddingBottom": "4px",
    "paddingLeft": "8px"
  },
  ".stats-bar": {
    "flexDirection": "row",
    "justifyContent": "space-around",
    "paddingTop": "14px",
    "paddingRight": "0px",
    "paddingBottom": "14px",
    "paddingLeft": "0px",
    "marginTop": "8px"
  },
  ".stat-item": {
    "flexDirection": "column",
    "alignItems": "center"
  },
  ".stat-value": {
    "fontSize": "24px",
    "color": "#22c55e",
    "fontWeight": "bold"
  },
  ".stat-label": {
    "fontSize": "14px",
    "color": "#666677",
    "marginTop": "2px"
  },
  ".add-view": {
    "paddingTop": "20px",
    "paddingRight": "24px",
    "paddingBottom": "20px",
    "paddingLeft": "24px"
  },
  ".add-label": {
    "fontSize": "18px",
    "color": "#888899",
    "marginBottom": "10px"
  },
  ".habit-input": {
    "fontSize": "22px",
    "color": "#ffffff",
    "backgroundColor": "#1a1a2e",
    "borderRadius": "12px",
    "paddingTop": "14px",
    "paddingRight": "16px",
    "paddingBottom": "14px",
    "paddingLeft": "16px",
    "marginBottom": "20px",
    "width": "420px",
    "height": "50px"
  },
  ".icon-picker": {
    "flexDirection": "row",
    "flexWrap": "wrap",
    "marginBottom": "20px"
  },
  ".icon-option": {
    "width": "52px",
    "height": "52px",
    "borderRadius": "12px",
    "backgroundColor": "#1a1a2e",
    "alignItems": "center",
    "justifyContent": "center",
    "marginRight": "8px",
    "marginBottom": "8px",
    "borderTopWidth": "2px",
    "borderRightWidth": "2px",
    "borderBottomWidth": "2px",
    "borderLeftWidth": "2px",
    "borderTopColor": "rgba(0,0,0,0)",
    "borderRightColor": "rgba(0,0,0,0)",
    "borderBottomColor": "rgba(0,0,0,0)",
    "borderLeftColor": "rgba(0,0,0,0)"
  },
  ".icon-option-selected": {
    "borderTopColor": "#6366f1",
    "borderRightColor": "#6366f1",
    "borderBottomColor": "#6366f1",
    "borderLeftColor": "#6366f1",
    "backgroundColor": "#1e1b4b"
  },
  ".icon-text": {
    "fontSize": "26px"
  },
  ".color-picker": {
    "flexDirection": "row",
    "marginBottom": "24px"
  },
  ".color-option": {
    "width": "40px",
    "height": "40px",
    "borderRadius": "20px",
    "marginRight": "10px",
    "borderTopWidth": "3px",
    "borderRightWidth": "3px",
    "borderBottomWidth": "3px",
    "borderLeftWidth": "3px",
    "borderTopColor": "rgba(0,0,0,0)",
    "borderRightColor": "rgba(0,0,0,0)",
    "borderBottomColor": "rgba(0,0,0,0)",
    "borderLeftColor": "rgba(0,0,0,0)"
  },
  ".color-option-selected": {
    "borderTopColor": "#ffffff",
    "borderRightColor": "#ffffff",
    "borderBottomColor": "#ffffff",
    "borderLeftColor": "#ffffff"
  },
  ".add-actions": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "marginTop": "10px"
  },
  ".btn": {
    "flex": 1,
    "height": "50px",
    "borderRadius": "25px",
    "alignItems": "center",
    "justifyContent": "center"
  },
  ".btn-cancel": {
    "backgroundColor": "#1a1a2e",
    "marginRight": "10px"
  },
  ".btn-save": {
    "backgroundColor": "#6366f1",
    "marginLeft": "10px"
  },
  ".btn-save-disabled": {
    "opacity": 0.4
  },
  ".btn-text": {
    "fontSize": "20px",
    "color": "#ffffff",
    "fontWeight": "bold"
  },
  ".stats-view": {
    "paddingTop": "16px",
    "paddingRight": "24px",
    "paddingBottom": "16px",
    "paddingLeft": "24px"
  },
  ".stats-grid": {
    "flexDirection": "row",
    "flexWrap": "wrap",
    "justifyContent": "space-between"
  },
  ".stats-card": {
    "width": "200px",
    "height": "90px",
    "backgroundColor": "#1a1a2e",
    "borderRadius": "16px",
    "flexDirection": "column",
    "alignItems": "center",
    "justifyContent": "center",
    "marginBottom": "12px"
  },
  ".stats-card-value": {
    "fontSize": "28px",
    "color": "#6366f1",
    "fontWeight": "bold"
  },
  ".stats-card-label": {
    "fontSize": "14px",
    "color": "#666677",
    "marginTop": "4px"
  },
  ".streaks-section": {
    "flexDirection": "column",
    "marginTop": "8px"
  },
  ".section-title": {
    "fontSize": "20px",
    "color": "#ffffff",
    "fontWeight": "bold",
    "marginBottom": "12px"
  },
  ".streak-row": {
    "flexDirection": "row",
    "justifyContent": "space-between",
    "paddingTop": "10px",
    "paddingRight": "0px",
    "paddingBottom": "10px",
    "paddingLeft": "0px",
    "borderBottomWidth": "1px",
    "borderBottomColor": "#1a1a2e"
  },
  ".streak-name": {
    "fontSize": "18px",
    "color": "#ccccdd"
  },
  ".streak-value": {
    "fontSize": "18px",
    "color": "#f97316",
    "fontWeight": "bold"
  },
  ".bottom-nav": {
    "flexDirection": "row",
    "justifyContent": "space-around",
    "alignItems": "center",
    "paddingTop": "10px",
    "paddingRight": "20px",
    "paddingBottom": "20px",
    "paddingLeft": "20px",
    "backgroundColor": "#0f0f1a",
    "borderTopWidth": "1px",
    "borderTopColor": "#1a1a2e"
  },
  ".nav-item": {
    "flexDirection": "column",
    "alignItems": "center",
    "paddingTop": "8px",
    "paddingRight": "16px",
    "paddingBottom": "8px",
    "paddingLeft": "16px"
  },
  ".nav-label-active": {
    "color": "#6366f1"
  },
  ".nav-item-active": {
    "flexDirection": "column",
    "alignItems": "center",
    "paddingTop": "8px",
    "paddingRight": "16px",
    "paddingBottom": "8px",
    "paddingLeft": "16px"
  },
  ".nav-item-active .nav-label": {
    "color": "#6366f1",
    "_meta": {
      "ruleDef": [
        {
          "t": "a",
          "n": "class",
          "i": false,
          "a": "element",
          "v": "nav-item-active"
        },
        {
          "t": "d"
        },
        {
          "t": "a",
          "n": "class",
          "i": false,
          "a": "element",
          "v": "nav-label"
        }
      ]
    }
  },
  ".nav-icon": {
    "fontSize": "24px"
  },
  ".nav-label": {
    "fontSize": "13px",
    "color": "#666677",
    "marginTop": "4px"
  },
  ".add-btn": {
    "backgroundColor": "#6366f1",
    "borderRadius": "24px",
    "width": "48px",
    "height": "48px",
    "justifyContent": "center",
    "marginTop": "-16px"
  },
  ".add-icon": {
    "fontSize": "30px",
    "color": "#ffffff"
  }
}

/***/ }),

/***/ "./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/template-loader.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/pages/index/index.ux?uxType=page&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/template-loader.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/pages/index/index.ux?uxType=page& ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = {
  "type": "div",
  "attr": {},
  "classList": [
    "container"
  ],
  "children": [
    {
      "type": "div",
      "attr": {},
      "classList": [
        "header"
      ],
      "children": [
        {
          "type": "text",
          "attr": {
            "value": function () {return this.pageTitle}
          },
          "classList": [
            "title"
          ]
        },
        {
          "type": "text",
          "attr": {
            "value": function () {return this.currentDate}
          },
          "classList": [
            "date"
          ]
        }
      ]
    },
    {
      "type": "div",
      "attr": {},
      "classList": [
        "content"
      ],
      "children": [
        {
          "type": "div",
          "attr": {},
          "shown": function () {return this.view==='today'},
          "classList": [
            "view"
          ],
          "children": [
            {
              "type": "div",
              "attr": {},
              "shown": function () {return this.habits.length===0},
              "classList": [
                "empty-state"
              ],
              "children": [
                {
                  "type": "text",
                  "attr": {
                    "value": "📋"
                  },
                  "classList": [
                    "empty-icon"
                  ]
                },
                {
                  "type": "text",
                  "attr": {
                    "value": "No habits yet"
                  },
                  "classList": [
                    "empty-text"
                  ]
                },
                {
                  "type": "text",
                  "attr": {
                    "value": "Tap + to add one"
                  },
                  "classList": [
                    "empty-sub"
                  ]
                }
              ]
            },
            {
              "type": "div",
              "attr": {},
              "classList": [
                "habits-list"
              ],
              "children": [
                {
                  "type": "div",
                  "attr": {},
                  "repeat": function () {return this.habits},
                  "classList": [
                    "habit-card"
                  ],
                  "events": {
                    "click": function (evt) { return this.toggleHabit(this.$item.id,evt)}
                  },
                  "children": [
                    {
                      "type": "div",
                      "attr": {},
                      "classList": [
                        "habit-left"
                      ],
                      "children": [
                        {
                          "type": "div",
                          "attr": {},
                          "classList": function () {return [this.isCompletedToday(this.$item.id)?'habit-check-checked':'habit-check']},
                          "children": [
                            {
                              "type": "text",
                              "attr": {
                                "value": function () {return this.isCompletedToday(this.$item.id)?'✓':''}
                              },
                              "classList": [
                                "check-icon"
                              ]
                            }
                          ]
                        },
                        {
                          "type": "div",
                          "attr": {},
                          "classList": [
                            "habit-info"
                          ],
                          "children": [
                            {
                              "type": "text",
                              "attr": {
                                "value": function () {return this.$item.name}
                              },
                              "classList": [
                                "habit-name"
                              ]
                            },
                            {
                              "type": "text",
                              "attr": {
                                "value": function () {return '' + '🔥 ' + (this.$item.streak) + 'd streak'}
                              },
                              "classList": [
                                "habit-streak"
                              ],
                              "shown": function () {return this.$item.streak>0}
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "×"
                      },
                      "classList": [
                        "habit-delete"
                      ],
                      "events": {
                        "click": function (evt) { return this.deleteHabit(this.$item.id,evt)}
                      }
                    }
                  ]
                }
              ]
            },
            {
              "type": "div",
              "attr": {},
              "shown": function () {return this.habits.length>0},
              "classList": [
                "stats-bar"
              ],
              "children": [
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stat-item"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return this.completedToday}
                      },
                      "classList": [
                        "stat-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "Done"
                      },
                      "classList": [
                        "stat-label"
                      ]
                    }
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stat-item"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return this.habits.length-this.completedToday}
                      },
                      "classList": [
                        "stat-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "Left"
                      },
                      "classList": [
                        "stat-label"
                      ]
                    }
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stat-item"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return '' + (this.completionRate) + '%'}
                      },
                      "classList": [
                        "stat-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "Rate"
                      },
                      "classList": [
                        "stat-label"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "div",
          "attr": {},
          "shown": function () {return this.view==='add'},
          "classList": [
            "view",
            "add-view"
          ],
          "children": [
            {
              "type": "text",
              "attr": {
                "value": "New Habit"
              },
              "classList": [
                "add-label"
              ]
            },
            {
              "type": "input",
              "attr": {
                "type": "text",
                "placeholder": "e.g. Exercise 30min",
                "value": function () {return this.newHabitName}
              },
              "classList": [
                "habit-input"
              ],
              "events": {
                "change": function (evt) { return this.setNewHabitName(this.$event.value,evt)}
              }
            },
            {
              "type": "text",
              "attr": {
                "value": "Icon"
              },
              "classList": [
                "add-label"
              ]
            },
            {
              "type": "div",
              "attr": {},
              "classList": [
                "icon-picker"
              ],
              "children": [
                {
                  "type": "div",
                  "attr": {},
                  "repeat": function () {return this.availableIcons},
                  "classList": function () {return [this.newHabitIcon===this.$item?'icon-option-selected':'icon-option']},
                  "events": {
                    "click": function (evt) { return this.selectIcon(this.$item,evt)}
                  },
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return this.$item}
                      },
                      "classList": [
                        "icon-text"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "text",
              "attr": {
                "value": "Color"
              },
              "classList": [
                "add-label"
              ]
            },
            {
              "type": "div",
              "attr": {},
              "classList": [
                "color-picker"
              ],
              "children": [
                {
                  "type": "div",
                  "attr": {},
                  "repeat": function () {return this.availableColors},
                  "classList": function () {return [this.newHabitColor===this.$item?'color-option-selected':'color-option']},
                  "events": {
                    "click": function (evt) { return this.selectColor(this.$item,evt)}
                  },
                  "style": {
                    "backgroundColor": function () {return this.$item}
                  }
                }
              ]
            },
            {
              "type": "div",
              "attr": {},
              "classList": [
                "add-actions"
              ],
              "children": [
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "btn",
                    "btn-cancel"
                  ],
                  "events": {
                    "click": function (evt) { return this.cancelAdd(evt)}
                  },
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": "Cancel"
                      },
                      "classList": [
                        "btn-text"
                      ]
                    }
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "classList": function () {return [this.newHabitName.length>0?'btn btn-save':'btn btn-save-disabled']},
                  "events": {
                    "click": function (evt) { return this.saveHabit(evt)}
                  },
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": "Save"
                      },
                      "classList": [
                        "btn-text"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "div",
          "attr": {},
          "shown": function () {return this.view==='stats'},
          "classList": [
            "view",
            "stats-view"
          ],
          "children": [
            {
              "type": "div",
              "attr": {},
              "classList": [
                "stats-grid"
              ],
              "children": [
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stats-card"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return this.totalHabits}
                      },
                      "classList": [
                        "stats-card-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "Total Habits"
                      },
                      "classList": [
                        "stats-card-label"
                      ]
                    }
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stats-card"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return this.bestStreak}
                      },
                      "classList": [
                        "stats-card-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "Best Streak"
                      },
                      "classList": [
                        "stats-card-label"
                      ]
                    }
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stats-card"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return this.totalCompletions}
                      },
                      "classList": [
                        "stats-card-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "All-Time Done"
                      },
                      "classList": [
                        "stats-card-label"
                      ]
                    }
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "classList": [
                    "stats-card"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return '' + (this.overallRate) + '%'}
                      },
                      "classList": [
                        "stats-card-value"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": "Overall Rate"
                      },
                      "classList": [
                        "stats-card-label"
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "type": "div",
              "attr": {},
              "shown": function () {return this.habits.length>0},
              "classList": [
                "streaks-section"
              ],
              "children": [
                {
                  "type": "text",
                  "attr": {
                    "value": "🏆 Top Streaks"
                  },
                  "classList": [
                    "section-title"
                  ]
                },
                {
                  "type": "div",
                  "attr": {},
                  "repeat": function () {return this.sortedByStreak},
                  "classList": [
                    "streak-row"
                  ],
                  "children": [
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return '' + (this.$item.icon) + ' ' + (this.$item.name)}
                      },
                      "classList": [
                        "streak-name"
                      ]
                    },
                    {
                      "type": "text",
                      "attr": {
                        "value": function () {return '' + (this.$item.streak) + ' days'}
                      },
                      "classList": [
                        "streak-value"
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "div",
      "attr": {},
      "classList": [
        "bottom-nav"
      ],
      "children": [
        {
          "type": "div",
          "attr": {},
          "classList": function () {return [this.view==='today'?'nav-item-active':'nav-item']},
          "events": {
            "click": function (evt) { return this.switchView('today',evt)}
          },
          "children": [
            {
              "type": "text",
              "attr": {
                "value": "📋"
              },
              "classList": [
                "nav-icon"
              ]
            },
            {
              "type": "text",
              "attr": {
                "value": "Today"
              },
              "classList": [
                "nav-label"
              ]
            }
          ]
        },
        {
          "type": "div",
          "attr": {},
          "classList": [
            "nav-item",
            "add-btn"
          ],
          "events": {
            "click": function (evt) { return this.startAdd(evt)}
          },
          "children": [
            {
              "type": "text",
              "attr": {
                "value": "+"
              },
              "classList": [
                "nav-icon",
                "add-icon"
              ]
            }
          ]
        },
        {
          "type": "div",
          "attr": {},
          "classList": function () {return [this.view==='stats'?'nav-item-active':'nav-item']},
          "events": {
            "click": function (evt) { return this.switchView('stats',evt)}
          },
          "children": [
            {
              "type": "text",
              "attr": {
                "value": "📊"
              },
              "classList": [
                "nav-icon"
              ]
            },
            {
              "type": "text",
              "attr": {
                "value": "Stats"
              },
              "classList": [
                "nav-label"
              ]
            }
          ]
        }
      ]
    }
  ]
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************************************!*\
  !*** ./src/pages/index/index.ux?uxType=page ***!
  \**********************************************/

var $app_script$ = __webpack_require__(/*! !../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/script-loader.js!../../../node_modules/@hap-toolkit/packager/lib/loaders/module-loader.js!../../../node_modules/babel-loader/lib/index.js?cwd=/home/andrea/projects/habit-tracker-miband&cacheDirectory&plugins[]=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/packager/babel.config.js!../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/access-loader.js!../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./index.ux?uxType=page */ "./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/script-loader.js!./node_modules/@hap-toolkit/packager/lib/loaders/module-loader.js!./node_modules/babel-loader/lib/index.js?cwd=/home/andrea/projects/habit-tracker-miband&cacheDirectory&plugins[]=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/dsl-xvm/lib/loaders/babel-plugin-jsx.js&comments=false&configFile=/home/andrea/projects/habit-tracker-miband/node_modules/@hap-toolkit/packager/babel.config.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/access-loader.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!./src/pages/index/index.ux?uxType=page")
$app_define$('@app-component/index', [], function($app_require$, $app_exports$, $app_module$) {
     $app_script$($app_module$, $app_exports$, $app_require$)
        if ($app_exports$.__esModule && $app_exports$.default) {
          $app_module$.exports = $app_exports$.default
        }
    $app_module$.exports.template = __webpack_require__(/*! !../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/template-loader.js!../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./index.ux?uxType=page& */ "./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/template-loader.js!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=template!./src/pages/index/index.ux?uxType=page&")
    $app_module$.exports.style = __webpack_require__(/*! !../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!../../../node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./index.ux?uxType=page */ "./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/style-loader.js?index=0&type=style!./node_modules/@hap-toolkit/dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=style!./src/pages/index/index.ux?uxType=page")
});
$app_bootstrap$('@app-component/index',{ packagerVersion: "2.0.8" });
})();

/******/ })()
;
    };
    if (typeof window === "undefined") {
      return createPageHandler();
    }
    else {
      window.createPageHandler = createPageHandler
    }
  })();