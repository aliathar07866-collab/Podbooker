# Design Guidelines: Podcast Appointment Booking Platform

## Design Approach: Reference-Based (Hybrid)
**Primary References:** Calendly (booking flows) + Spotify (podcast aesthetics) + Airbnb (trust/reviews)
**Rationale:** Experience-focused platform requiring visual appeal, trust-building through reviews, and seamless booking UX

## Core Design Principles
1. **Trust-First Design:** Reviews and social proof prominently featured
2. **Effortless Booking:** Minimal clicks from discovery to confirmed appointment
3. **Podcast-Centric:** Audio/media aesthetic with rich visuals
4. **Scannable Information:** Quick evaluation of hosts/availability

## Color Palette

### Light Mode
- **Primary:** 139 65% 50% (Deep purple - podcast/audio association)
- **Secondary:** 220 15% 25% (Charcoal for text/headers)
- **Accent:** 340 75% 55% (Energetic pink for CTAs)
- **Background:** 0 0% 98% (Soft white)
- **Surface:** 0 0% 100% (Pure white cards)
- **Success:** 142 71% 45% (Confirmed bookings)

### Dark Mode
- **Primary:** 139 60% 60% (Lighter purple)
- **Secondary:** 0 0% 90% (Light text)
- **Accent:** 340 70% 60% (Vibrant pink)
- **Background:** 222 20% 8% (Deep charcoal)
- **Surface:** 222 18% 12% (Elevated cards)
- **Success:** 142 65% 50% (Confirmed bookings)

## Typography
- **Headings:** Inter (700-800 weight) - Modern, professional
- **Body:** Inter (400-500 weight) - Excellent readability
- **Accents:** Inter (600 weight) - Emphasis elements
- **Sizes:** text-5xl/6xl (hero), text-3xl/4xl (section headers), text-xl/2xl (card titles), text-base/lg (body)

## Layout System
**Spacing Units:** Consistent use of 4, 8, 12, 16, 20, 24 (px-4, py-8, gap-12, etc.)
- **Container:** max-w-7xl with px-4 md:px-6 lg:px-8
- **Sections:** py-16 md:py-24 lg:py-32 vertical rhythm
- **Cards:** p-6 md:p-8 internal padding
- **Grid Systems:** grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for podcast cards

## Component Library

### Navigation
- Fixed header with blur backdrop (backdrop-blur-md bg-white/80 dark:bg-gray-900/80)
- Logo left, primary nav center, CTA button right
- Mobile: Hamburger with slide-in menu

### Hero Section (Full-Width)
- Large hero image featuring podcast studio/hosts in action (1920x800px)
- Overlayed heading + subheading + dual CTAs (Search Podcasts + List Your Podcast)
- Trust indicators below (e.g., "15,000+ Appointments Booked")
- Gradient overlay for text readability (from transparent to primary-900/40)

### Podcast Host Cards
- Grid layout with rounded-2xl cards
- Components per card:
  - Host avatar (rounded-full, 80x80px)
  - Podcast cover art thumbnail (rounded-lg, 120x120px)
  - Star rating (5-star display with average)
  - Review count
  - Category tags (rounded-full pills)
  - "View Profile" CTA button
- Hover: Subtle lift (shadow-lg) and scale (scale-105)

### Booking Calendar
- Week/month view with available slots highlighted in accent color
- Time slots in 15/30/60 min increments
- Selected slot: Filled accent color with checkmark
- Unavailable: Gray with diagonal stripe pattern

### Reviews Section
- 2-column layout (desktop), stacked (mobile)
- Review cards with:
  - Reviewer avatar + name + verified badge
  - 5-star rating
  - Date posted
  - Review text (max-w-prose)
  - Helpful counter (thumbs up)
- Featured review spotlight at section top (larger card, highlighted border)

### Profile Pages
- Split layout: Left sidebar (avatar, stats, contact button), Right content (bio, services, calendar)
- About section with rich text
- Portfolio/past episodes grid
- Availability widget

### Search & Filters
- Sticky filter bar with dropdowns:
  - Category (Genre)
  - Rating (4+ stars, 3+ stars, etc.)
  - Availability (This week, Next week, Flexible)
  - Price range
- Real-time results update
- Sort options (Relevance, Rating, Price, Availability)

### CTAs & Buttons
- Primary: bg-accent text-white rounded-lg px-6 py-3 font-semibold
- Secondary: border-2 border-accent text-accent rounded-lg px-6 py-3 font-semibold
- Ghost: text-accent hover:bg-accent/10 rounded-lg px-6 py-3 font-semibold
- On images: backdrop-blur-sm bg-white/20 (light) or bg-black/30 (dark) with white text

### Forms
- Booking form with progressive disclosure
- Input fields: rounded-lg border-2 focus:border-accent
- Date/time pickers with calendar popover
- Confirmation step with summary card

## Images

### Hero Section
- Large hero image (1920x800px): Professional podcast studio with hosts recording, warm lighting
- Purpose: Establish credibility and aspirational quality

### Podcast Cards
- Host avatars (professional headshots, 200x200px minimum)
- Podcast cover art (square, 400x400px)

### Testimonials
- Customer photos (authentic, candid, 150x150px)

### About/Trust Section
- Team photo or montage of successful bookings (1200x600px)

## Animations
**Minimal Use:**
- Card hover: transform duration-200
- Button interactions: Built-in states only
- Page transitions: Fade-in on scroll (once per element)
- Calendar slot selection: Quick highlight flash

## Accessibility
- Dark mode: Consistent across all inputs, selects, textareas
- ARIA labels on all interactive elements
- Focus indicators: 2px accent ring
- Contrast ratios: WCAG AA minimum (4.5:1 text)
- Keyboard navigation: Tab order logical, escape to close modals

This comprehensive system creates a trustworthy, visually engaging platform that makes booking podcast appointments effortless while showcasing reviews prominently.