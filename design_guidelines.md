# Design Guidelines: Uber Driver Finance Tracker

## Design Approach

**Selected System**: Apple Human Interface Guidelines (HIG)
**Justification**: User explicitly requested "minimalista estilo Apple" with clean typography, generous spacing, and rounded corners. The data-rich, utility-focused nature of financial tracking aligns perfectly with Apple's clarity and efficiency principles.

**Core Principles**:
- Clarity through hierarchy and whitespace
- Deference to content over decorative elements
- Depth through subtle layering and elevation
- Immediate comprehension of financial data

## Typography

**Font Stack**: system-ui, -apple-system, SF Pro Display, Segoe UI, sans-serif

- **Display (Números grandes)**: 48px/56px, weight 700, tracking -0.02em
- **Headings H1**: 32px/40px, weight 600
- **Headings H2**: 24px/32px, weight 600
- **Headings H3**: 20px/28px, weight 600
- **Body Large**: 17px/24px, weight 400
- **Body Regular**: 15px/22px, weight 400
- **Labels/Captions**: 13px/18px, weight 500
- **Numbers**: Tabular numerals enabled for financial data alignment

## Layout System

**Spacing Scale**: Tailwind units of **3, 4, 6, 8, 12, 16**
- Card padding: p-6 or p-8
- Section spacing: py-12 or py-16
- Element gaps: gap-4 or gap-6
- Component margins: mb-6 or mb-8

**Grid Structure**:
- Dashboard: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Forms: Single column max-w-2xl centered
- History table: Full-width with horizontal scroll on mobile

## Component Library

### Cards (Tarjetas de Dashboard)
- Rounded corners: rounded-2xl (16px radius)
- Generous padding: p-6 lg:p-8
- Subtle elevation with soft shadows
- Clean dividers between sections within cards
- Hover state: subtle lift effect (translate-y)

### Navigation
- Top header bar with logo, user name, logout
- Clean segmented control for week/month toggle
- Sidebar navigation for mobile (hamburger menu)

### Forms (Registro de Turnos)
- Large, comfortable input fields with clear labels above
- Rounded inputs: rounded-xl
- Generous touch targets (min-h-12)
- Inline validation with helpful messages
- Grouped related fields with subtle background distinction

### Data Display
- **Stats Cards**: Large number display with small label below
- **Progress Bars**: Thick (h-3), rounded-full, smooth transitions
- **Charts**: Clean, minimalist line/bar charts using Chart.js or similar
- **Tables**: Zebra striping (subtle), sticky headers, responsive horizontal scroll

### Buttons
- Primary: Rounded-xl, bold weight, comfortable padding (px-6 py-3)
- Secondary: Outlined with rounded-xl
- Icon buttons: Circular (rounded-full) for actions
- Blur background for buttons over images

### Login Screen
- Centered card on clean background
- max-w-md card with generous padding
- Large input fields with icons
- Clear error states below inputs
- "Recordar sesión" checkbox with system font

### Modals/Overlays
- Rounded-2xl with backdrop blur
- Slide-up animation on mobile
- Center modal on desktop with overlay

## Key Dashboard Sections

### Hero/Summary Card
Large card at top showing:
- Ganancia neta semanal (large display number)
- Progreso visual hacia meta con barra
- Turnos completados esta semana
- No hero image needed - data is the hero

### Metrics Grid (3 columns on desktop)
- Horas trabajadas
- Promedio por hora
- Gasto en combustible
- Progress hacia arriendo (if active)

### Charts Section
- 2-column layout: Ganancias por día + Horas trabajadas
- Clean axis labels, subtle grid lines
- Interactive tooltips on hover

### Recent Shifts Table
- Compact rows with key info: Fecha, Horas, Ganancia bruta, Ganancia neta
- Quick actions: Editar/Eliminar icons
- "Ver historial completo" link

### Configuration Module
- Clean toggle switches for "Trabajo con arriendo"
- Number inputs with currency symbols
- Save button prominent at bottom

## Light/Dark Mode

**Automatic Detection**: prefers-color-scheme media query

**Light Mode**:
- Clean whites and light grays
- Subtle shadows for depth
- Black text with excellent contrast

**Dark Mode**:
- True blacks with elevated grays for cards
- Reduced shadows, use borders instead
- White text with proper contrast
- Dim green/red for positive/negative numbers

## Animations

**Minimal & Purposeful**:
- Card hover lift: transform duration-200
- Number changes: count-up animation for stats
- Progress bar fills: transition duration-500
- Page transitions: fade only, no slides
- Loading states: Apple-style spinner

## Accessibility

- WCAG AA contrast ratios minimum
- Focus rings visible on all interactive elements
- Keyboard navigation fully supported
- Screen reader labels on all icons
- Form labels always visible (no placeholder-only)

## Data Visualization Principles

- Numbers dominate, graphics support
- Clear labels in local format (CLP currency)
- Color-blind safe palette for charts
- Export button clearly visible (icon + text)