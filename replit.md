# Cinema Ticket Booking Platform

## Project Overview
A production-ready responsive cinema ticket booking web application with ML-driven dynamic pricing. Built with modern full-stack JavaScript technologies including React, Express, PostgreSQL, and TypeScript.

## Current Status (Last updated: Nov 17, 2025)

### Completed Features
1. **Database Schema** - Complete PostgreSQL schema with 8 tables:
   - users (with JWT authentication)
   - movies (with posters, cast, ratings)
   - theaters & screens
   - showtimes (with ML pricing fields)
   - seats & bookings
   - pricing_history
   - All migrations pushed successfully

2. **Backend API** - Comprehensive REST API with:
   - Auth endpoints (signup, login with JWT, password hashing with bcryptjs)
   - Movie CRUD operations
   - Showtime management with date filtering
   - Booking system with seat validation
   - Mock payment flow (UPI/Card/Cash - NO Stripe per user requirement)
   - Admin endpoints for analytics
   - Proper error handling and Zod validation

3. **Frontend Components** - All UI components built:
   - HomePage with hero section and featured movies grid
   - MovieDetailPage with backdrop, showtimes, and cast
   - SeatSelectionPage with interactive seat map
   - CheckoutPage with mock payment options
   - BookingConfirmationPage with e-ticket
   - BookingsPage for user booking history
   - AuthPages (login/signup)
   - Complete Admin Dashboard with sidebar navigation
   - All components follow design_guidelines.md

4. **Integration** - Frontend connected to backend:
   - AuthContext for authentication state management
   - JWT tokens stored in localStorage and sent with all API requests
   - HomePage fetches real featured movies
   - MovieDetailPage fetches movie details and showtimes
   - AdminMoviesPage fetches all movies
   - Public header shows login/logout based on auth state
   - TanStack Query for data fetching with proper caching

5. **Database Seed Data**:
   - 4 movies (2 with AI-generated posters)
   - 1 theater with 3 screens
   - 54 showtimes across today and tomorrow
   - 2 users: Admin (admin@cinemamax.com / admin123), Demo (demo@example.com / demo123)

### Pending Tasks
1. **ML Integration** - Python scikit-learn service for dynamic pricing predictions
2. **Complete Booking Flow** - Full seat selection → checkout → payment → confirmation flow
3. **Admin Features** - Complete dashboard analytics and pricing override functionality
4. **E2E Testing** - Test critical user journeys with playwright

## Tech Stack
- **Frontend**: React, TypeScript, Wouter (routing), TanStack Query, Tailwind CSS + shadcn/ui
- **Backend**: Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Auth**: JWT with bcryptjs
- **Payment**: Mock system (UPI/Card/Cash) - NO Stripe per user request
- **ML**: Python scikit-learn (pending implementation)

## Design System
Following design_guidelines.md with:
- **Fonts**: Poppins (headings), Inter (body)
- **Colors**: Cinema-specific theme (deep purple primary, amber accents)
- **Components**: Shadcn/ui with custom cinema theming
- **Responsive**: Mobile-first design with careful attention to spacing and interactions

## Key Files
- `shared/schema.ts` - Database schema and TypeScript types
- `server/routes.ts` - All API endpoints
- `server/seed.ts` - Database seed script
- `client/src/lib/auth.tsx` - Authentication context
- `client/src/lib/queryClient.ts` - React Query setup with JWT
- `client/src/pages/*` - All page components
- `design_guidelines.md` - UI/UX design specifications

## Important Notes
- Mock payment system only (user requirement)
- No Stripe integration
- JWT authentication with localStorage
- PostgreSQL database with proper relations
- ML pricing service to be integrated next
