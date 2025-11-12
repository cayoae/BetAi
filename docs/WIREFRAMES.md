# BetAI - UI/UX Design & Wireframes

**Design Philosophy:**
- Informação densa mas organizada
- Gráficos interativos e dinâmicos
- Interface limpa e moderna
- Relatórios em tempo real customizáveis

---

## Layout Principal

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Logo | Sport Tabs | Search | User Menu               │
├────────┬────────────────────────────────────────────────────────┤
│        │                                                         │
│ Side   │  Main Content Area                                     │
│ Panel  │  ┌──────────────────────────────────────────────────┐ │
│        │  │  Today's Games Overview (Cards Grid)             │ │
│ Quick  │  │  ┌────────┐ ┌────────┐ ┌────────┐               │ │
│ Stats  │  │  │ Game 1 │ │ Game 2 │ │ Game 3 │               │ │
│        │  │  │ [Stats]│ │ [Stats]│ │ [Stats]│               │ │
│ Filter │  │  └────────┘ └────────┘ └────────┘               │ │
│ Panel  │  └──────────────────────────────────────────────────┘ │
│        │                                                         │
│ [AI]   │  ┌──────────────────────────────────────────────────┐ │
│ Chat   │  │  Interactive Analytics Section                   │ │
│ Toggle │  │  [Chart 1] [Chart 2] [Chart 3] [Customizable]   │ │
│        │  └──────────────────────────────────────────────────┘ │
│        │                                                         │
└────────┴─────────────────────────────────────────────────────────┘
```

---

## 1. Dashboard Principal (Home)

### Layout Sections:

**A. Header Bar (Fixed Top)**
```
┌─────────────────────────────────────────────────────────────────┐
│ [🏀 BetAI]  NFL | NBA | MLB | WNBA | Soccer    [🔍] [@User ▼] │
└─────────────────────────────────────────────────────────────────┘
```

**B. Sidebar (Collapsible Left)**
```
┌─────────────┐
│ Quick Stats │
│ ───────────│
│ Today: 12   │
│ Live: 3     │
│ Upcoming: 9 │
│             │
│ Filters     │
│ ───────────│
│ □ Live Only │
│ □ Favorites │
│ □ High Odds │
│             │
│ [💬 AI Chat]│
└─────────────┘
```

**C. Main Content - Games Grid**
```
┌───────────────────────────────────────────────────────────┐
│  📅 Today - Tuesday, Nov 12, 2025        [View: Grid ▼]  │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────┐│
│  │ NFL             │  │ NBA             │  │ MLB       ││
│  │ KC vs SF        │  │ LAL vs BOS      │  │ NYY vs LAD││
│  │ 20:20 ET  [🔴]  │  │ 19:30 ET        │  │ Completed ││
│  │                 │  │                 │  │           ││
│  │ KC: 24 (53%)    │  │ LAL: -3.5       │  │ 🏆 NYY 5  ││
│  │ SF: 28 (47%)    │  │ BOS: +3.5       │  │    LAD 3  ││
│  │                 │  │ O/U: 218.5      │  │           ││
│  │ [View Stats →]  │  │ [Analyze →]     │  │ [Stats →] ││
│  └─────────────────┘  └─────────────────┘  └───────────┘│
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**D. Interactive Analytics Dashboard (Below Games)**
```
┌────────────────────────────────────────────────────────────┐
│  📊 Custom Analytics  [+ Add Chart] [Reset] [Save View]   │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐│
│  │ Team Performance │  │ Odds Movement    │  │ Head2Head││
│  │ (Last 10 Games) │  │ (24h)            │  │          ││
│  │                  │  │                  │  │ KC: 65%  ││
│  │ [Line Chart]     │  │ [Area Chart]     │  │ SF: 35%  ││
│  │                  │  │                  │  │          ││
│  │ [⚙️ Settings]    │  │ [⚙️ Settings]    │  │ [⚙️]     ││
│  └──────────────────┘  └──────────────────┘  └──────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Game Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  NFL                                  [Share] [Favorite]    │
│  Kansas City Chiefs vs San Francisco 49ers                  │
│  Tuesday, Nov 12, 2025 - 20:20 ET                          │
│                                                              │
│  ┌─────────────────┐   VS   ┌─────────────────┐           │
│  │  KC Chiefs      │        │  SF 49ers       │           │
│  │  [Logo]         │  24-28 │  [Logo]         │           │
│  │  Record: 8-3    │        │  Record: 10-1   │           │
│  └─────────────────┘        └─────────────────┘           │
│                                                              │
│  ┌─────────────── TABS ─────────────────────────┐          │
│  │ Overview | Stats | Odds | Players | AI Insights│         │
│  ├──────────────────────────────────────────────┤          │
│  │                                               │          │
│  │  📊 Key Stats                                │          │
│  │  ┌──────────────┬──────────┬──────────────┐ │          │
│  │  │ Total Yards  │ KC: 342  │ SF: 389      │ │          │
│  │  │ Turnovers    │ KC: 1    │ SF: 2        │ │          │
│  │  │ Time of Poss │ KC: 28:15│ SF: 31:45    │ │          │
│  │  └──────────────┴──────────┴──────────────┘ │          │
│  │                                               │          │
│  │  📈 Performance Trends                       │          │
│  │  [Interactive Chart - Last 5 Games]          │          │
│  │                                               │          │
│  │  💰 Betting Odds                             │          │
│  │  Spread: SF -3.5 (-110) | KC +3.5 (-110)    │          │
│  │  Moneyline: SF -165 | KC +145               │          │
│  │  Total: O 47.5 (-105) | U 47.5 (-115)       │          │
│  │                                               │          │
│  └───────────────────────────────────────────────┘          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. AI Chat Interface (Slide-out Panel)

```
┌─ AI Assistant ────────────────────────────────┐
│                                      [✕ Close] │
├────────────────────────────────────────────────┤
│                                                │
│  💬 Chat History                              │
│  ┌──────────────────────────────────────────┐│
│  │ You: What are today's best bets?        ││
│  │                                          ││
│  │ AI: Based on current data, here are     ││
│  │     3 high-value opportunities:         ││
│  │     1. KC vs SF - Under 47.5 (68% conf) ││
│  │     2. ...                               ││
│  │                                          ││
│  │ [Show Details] [Add to Tracker]         ││
│  └──────────────────────────────────────────┘│
│                                                │
│  Quick Actions:                               │
│  [📊 Today's Analysis]                        │
│  [🎯 Upset Alerts]                            │
│  [🔥 Hot Picks]                               │
│  [📈 Trends]                                  │
│                                                │
│  ┌──────────────────────────────────────────┐│
│  │ Ask anything...                    [Send]││
│  └──────────────────────────────────────────┘│
└────────────────────────────────────────────────┘
```

---

## 4. Custom Analytics Builder

**User Flow:**
1. Click "+ Add Chart"
2. Select chart type (Line, Bar, Pie, Radar, etc)
3. Choose data source (Team Stats, Player Stats, Odds, etc)
4. Configure filters (Time range, Teams, Sports)
5. Chart renders in real-time
6. User can resize, reposition, or remove charts

**Example Chart Configuration Modal:**
```
┌─ Create Chart ────────────────────────────────┐
│                                                │
│  Chart Type:                                  │
│  [Line] [Bar] [Pie] [Radar] [Area] [Scatter] │
│                                                │
│  Data Source:                                 │
│  ▼ Team Performance                           │
│    - Points Scored                            │
│    - Points Allowed                           │
│    - Yards Per Game                           │
│    - Win/Loss Record                          │
│                                                │
│  Filters:                                     │
│  Sport: [NFL ▼]                               │
│  Teams: [Select... ▼]                         │
│  Date Range: [Last 10 Games ▼]               │
│                                                │
│  [Preview]          [Cancel]  [Create Chart]  │
└────────────────────────────────────────────────┘
```

---

## 5. Component Library - Visual Design

### Color Palette (Already in Tailwind config):
- **Primary Blue:** #1a73e8 (Actions, Links)
- **NFL:** #013369 (Navy Blue)
- **NBA:** #17408B (Royal Blue)
- **MLB:** #041E42 (Dark Blue)
- **WNBA:** #C8102E (Red)
- **Soccer:** #00B140 (Green)
- **Success:** #34a853 (Green)
- **Danger:** #ea4335 (Red)
- **Warning:** #fbbc04 (Yellow)

### Typography:
- **Headings:** Bold, Sans-serif
- **Body:** Regular, Sans-serif
- **Stats:** Monospace for numbers

### Spacing:
- Cards: 24px padding
- Grid gap: 24px
- Sections: 32px margin

---

## 6. Key Interactive Features

### A. **Live Updates**
- Real-time score updates (every 30 seconds)
- Odds movement indicators (🔺 up, 🔻 down)
- Live game indicators (🔴 LIVE badge)

### B. **User Customization**
- Drag & drop chart repositioning
- Save custom dashboard layouts
- Favorite teams quick filter
- Dark/Light mode toggle

### C. **Data Visualization**
- Hover tooltips with detailed stats
- Click to drill down into details
- Zoom in/out on charts
- Export charts as images

### D. **Smart Insights**
- AI-generated insights per game
- Trend indicators (↗️ improving, ↘️ declining)
- Value bet highlights
- Upset alert badges

---

## 7. Responsive Design

### Desktop (1920px+):
- 3-4 game cards per row
- Sidebar always visible
- 3 charts side-by-side

### Tablet (768px - 1919px):
- 2 game cards per row
- Collapsible sidebar
- 2 charts side-by-side

### Mobile (< 768px):
- 1 game card per row
- Bottom navigation
- 1 chart full width
- Swipeable tabs

---

## 8. Components to Build (Priority Order)

### Phase 1 - Core UI:
1. ✅ Button (variants: primary, secondary, outline, ghost)
2. ✅ Card (hover effects, borders)
3. ✅ Badge (sport colors, status indicators)
4. Input (text, search)
5. Select/Dropdown
6. Modal/Dialog
7. Tabs

### Phase 2 - Sports Components:
8. GameCard (compact & detailed views)
9. TeamCard (logo, name, record)
10. PlayerCard
11. StatsTable (sortable)
12. OddsDisplay (with movement indicators)

### Phase 3 - Charts:
13. LineChart (trends over time)
14. BarChart (comparisons)
15. PieChart (distributions)
16. RadarChart (player attributes)
17. AreaChart (odds movement)

### Phase 4 - Advanced:
18. ChatInterface (messages, input)
19. CustomChartBuilder
20. DashboardGrid (drag & drop)

---

**Feedback Needed:**
1. Você gostaria de focar em algum esporte primeiro (NFL, NBA, etc)?
2. Prefere começar com game cards ou charts?
3. Alguma feature específica que é prioridade?
