# Design Guidelines: CinemaMax Ticket Booking Platform

## Design Approach

**Reference-Based Approach** drawing from leading entertainment and booking platforms:
- **Movie Discovery**: Netflix's card-based browsing with large imagery
- **Booking Flow**: Airbnb's step-by-step booking experience with clear progress
- **Seat Selection**: Custom interactive grid inspired by BookMyShow/Fandango
- **Admin Dashboard**: Linear's clean data tables with Stripe's payment UI clarity
- **Payment**: Stripe Checkout's trustworthy, minimal design

**Core Principle**: Cinematic experience meets functional booking - visual storytelling for discovery, precision and clarity for transactions.

---

## Typography System

**Font Families** (Google Fonts):
- **Primary**: Inter (UI, body text, data)
- **Display**: Poppins (headings, movie titles, hero text)

**Hierarchy**:
- Hero/Display: Poppins Bold, text-5xl to text-7xl
- Page Headings: Poppins SemiBold, text-3xl to text-4xl
- Section Titles: Poppins Medium, text-2xl
- Card Titles: Inter SemiBold, text-lg to text-xl
- Body Text: Inter Regular, text-base
- Captions/Labels: Inter Medium, text-sm
- Data/Numbers: Inter SemiBold (for prices, seat numbers)

---

## Layout System

**Spacing Scale**: Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 20, 24** consistently.

**Common Patterns**:
- Container max-width: `max-w-7xl`
- Section padding: `py-12 md:py-20`
- Card padding: `p-6`
- Component gaps: `gap-4` or `gap-6`
- Grid gaps: `gap-6` or `gap-8`

**Responsive Breakpoints**:
- Mobile-first approach
- Cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Dashboard: `grid-cols-1 lg:grid-cols-12` with sidebar

---

## Page-Specific Layouts

### Public Pages

**Homepage**:
- Hero: 70vh immersive movie backdrop with blurred background treatment, centered content with search/CTA
- Now Showing: 4-column movie card grid (responsive: 1→2→3→4)
- Coming Soon: Horizontal scrollable carousel
- ML Predictions Highlight: 2-column feature showing "Trending Shows" based on predictions
- Footer: 3-column (links, contact, social)

**Movie Detail Page**:
- Hero: Full-width movie backdrop (60vh) with gradient overlay
- Details Section: 2-column layout (poster + info)
- Showtimes Grid: Date selector + time slots in responsive grid
- Cast/Crew: Horizontal scroll cards

**Seat Selection**:
- Screen visualization at top (trapezoid shape with "SCREEN" label)
- Interactive seat grid: Center-aligned with responsive scaling
- Sidebar (desktop) / Bottom sheet (mobile): Selected seats summary + pricing
- Legend: Available/Selected/Booked indicators

**Booking Confirmation**:
- E-ticket card: Centered, max-w-2xl, with QR code
- Booking details in organized sections
- Download/Email options

### Admin Dashboard

**Layout**:
- Fixed sidebar (w-64) on desktop, collapsible on mobile
- Main content area with header (breadcrumbs, user menu)
- Data tables with sticky headers

**Dashboard Home**:
- Stats cards in 4-column grid: Revenue, Bookings, Occupancy, ML Accuracy
- Charts: 2-column (Sales graph + Occupancy heatmap)
- Recent activity feed

**ML Predictions Panel**:
- Prediction cards showing: Show → Predicted Sales → Confidence → Recommended Price
- Manual override controls
- Comparison: Base Price vs ML Price vs Current Price

---

## Component Library

### Navigation
- **Public Header**: Logo left, navigation center, auth buttons right, sticky with blur backdrop
- **Admin Sidebar**: Hierarchical menu with icons, active state highlighting

### Movie Cards
- **Standard Card**: Poster (aspect-ratio-[2/3]), title, genre tags, rating badge, "Book Now" CTA
- **Featured Card**: Larger with additional info (cast, duration)
- Hover: Subtle lift (translate-y-1) and shadow increase

### Seat Map Components
- **Seat Button**: Rounded squares (w-8 h-8 on mobile, w-10 h-10 desktop)
- States: Available (outlined), Selected (filled), Booked (disabled, opacity-40)
- Row labels: Sticky on scroll

### Pricing Display
- **Dynamic Price Badge**: Prominent display with strikethrough for base price when discounted
- **ML Indicator**: Subtle badge "AI-optimized" when ML pricing active
- **Price Breakdown**: Itemized list (ticket × quantity, taxes, total)

### Admin Components
- **Data Tables**: Sortable headers, row actions dropdown, pagination
- **Prediction Card**: Metric display with trend indicators (↑↓), confidence bars
- **Override Modal**: Form with before/after comparison

### Forms
- **Input Fields**: Outlined style with floating labels
- **Date/Time Pickers**: Calendar dropdown for dates, time slot selection
- **Payment Form**: Stripe Elements integration with clean spacing

### Buttons
- **Primary CTA**: Rounded-lg, px-6 py-3, medium weight text
- **Secondary**: Outlined variant
- **Ghost**: Text-only for tertiary actions
- **Icon Buttons**: Circular for actions (edit, delete)

### Modals/Overlays
- **Backdrop**: Blur + semi-transparent overlay
- **Modal Container**: Rounded-xl, max-w-2xl centered, shadow-2xl
- **Slide-out Panel**: Right-side for filters/details (w-96)

---

## Animations

**Minimal, Purposeful Usage**:
- Page transitions: Simple fade
- Card hover: Subtle lift (duration-200)
- Modal entry: Fade + scale (duration-300)
- Seat selection: Quick scale feedback (duration-150)
- Loading states: Shimmer skeleton screens

**NO** scroll-triggered animations, parallax effects, or complex sequences.

---

## Images

**Hero Sections**:
- Homepage: Large cinematic movie backdrop (film reel or theater ambiance)
- Movie Detail: Movie-specific backdrop with gradient overlay
- Admin: Optional subtle pattern background

**Movie Posters**: 
- Aspect ratio 2:3, high quality, lazy loaded
- Placeholder: Shimmer effect while loading

**Other Imagery**:
- Theater seat icons in legend
- QR code on e-ticket
- Empty state illustrations (no bookings, no results)

---

## Accessibility

- Semantic HTML throughout
- ARIA labels on all interactive seat buttons (`aria-label="Row A Seat 5"`)
- Keyboard navigation for seat selection (arrow keys)
- Focus visible states on all interactive elements
- Color contrast ratios meeting WCAG AA
- Screen reader announcements for booking steps

---

## Key UX Patterns

**Progressive Disclosure**: Show complexity only when needed (advanced filters collapsed by default)

**Booking Flow Steps**: Clear progress indicator → Select Show → Choose Seats → Payment → Confirmation

**Error Handling**: Inline validation, toast notifications for system messages, clear error states

**Loading States**: Skeleton screens for data-heavy components, spinner for actions

**Responsive Behavior**: 
- Mobile: Bottom sheets for filters/booking summary
- Tablet: Hybrid layout with collapsible sidebars
- Desktop: Full multi-column layouts with persistent navigation

This design system balances cinematic visual appeal for movie discovery with precision and trust for the booking and payment experience, while providing admins with a clean, data-rich interface for management and ML insights.