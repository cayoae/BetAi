# BetAI Documentation

## 📄 Files in this Directory

### mockup.html
**Complete HTML mockup of the BetAI frontend**

A fully self-contained, interactive HTML mockup showcasing the complete UI/UX design.

**How to view:**
1. Open `mockup.html` in any web browser
2. No build process or dependencies required
3. Fully responsive (test on mobile, tablet, desktop)

**What's included:**
- ✅ Complete header with sport navigation
- ✅ Collapsible sidebar with filters and quick stats
- ✅ Game cards (live, scheduled, completed states)
- ✅ Interactive analytics section with 4 chart placeholders
- ✅ Stats table with player data
- ✅ AI chat button (mockup)
- ✅ Responsive design (mobile-first)
- ✅ Hover effects and transitions
- ✅ Sport-specific color theming

**Features demonstrated:**
- Game cards with live scores and odds
- Multiple badge variants (sport, status)
- Chart containers with filters and actions
- Sortable data tables
- Search functionality
- User menu

### WIREFRAMES.md
**Detailed wireframe specifications and component breakdown**

Complete design documentation including:
- System architecture diagrams
- Layout specifications
- Component priorities
- Mobile/tablet/desktop layouts
- User interaction flows

---

## 🎨 Design System

### Colors
- **Primary:** #1a73e8 (Blue)
- **NFL:** #013369 (Navy)
- **NBA:** #17408B (Royal Blue)
- **MLB:** #041E42 (Dark Blue)
- **WNBA:** #C8102E (Red)
- **Soccer:** #00B140 (Green)
- **Success:** #34a853
- **Danger:** #ea4335
- **Warning:** #fbbc04

### Typography
- **Font:** System fonts (-apple-system, SF Pro, Segoe UI, etc.)
- **Headings:** Bold, various sizes (2rem, 1.5rem, 1.125rem)
- **Body:** Regular, 1rem
- **Small:** 0.875rem, 0.75rem

### Spacing Scale
- 0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem

### Border Radius
- Small: 0.5rem
- Medium: 0.75rem
- Large: 1rem
- Pills: 9999px

---

## 📐 Layout Specifications

### Desktop (1920px+)
- **Sidebar:** 280px fixed
- **Content:** Flex 1
- **Game Cards:** 3-4 per row
- **Charts:** 2 per row

### Tablet (768px - 1919px)
- **Sidebar:** Collapsible
- **Game Cards:** 2 per row
- **Charts:** 2 per row

### Mobile (< 768px)
- **Sidebar:** Slide-in overlay
- **Game Cards:** 1 per row (full width)
- **Charts:** 1 per row (full width)

---

## 🚀 Next Steps

After reviewing the mockup:

1. **Adjust design** - Provide feedback on any changes needed
2. **Implement in React** - Convert static HTML to React components (already done!)
3. **Connect data** - Integrate with Supabase
4. **Add interactivity** - Implement real chart rendering with Recharts

---

## 📝 Notes

The mockup uses placeholder chart areas. In the actual React implementation:
- Charts use Recharts library with real data
- All interactions are functional
- Data updates in real-time
- Animations are smoother with proper transitions
