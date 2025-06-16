# Megaflix - Streaming Platform

## Overview

Megaflix is a modern streaming platform application built with React and Express.js. It's designed as a Netflix-like service that provides access to movies, series, anime, cartoons, and novels in a single platform. The application features a responsive design with a dark theme and includes subscription plans, content browsing, and user testimonials.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with dark theme implementation
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Storage**: In-memory storage implementation with interface for future database integration
- **Session Management**: Planned with connect-pg-simple for PostgreSQL sessions

### Key Components

#### Frontend Components
- **Header**: Navigation with smooth scrolling between sections
- **Hero Section**: Main landing area with call-to-action buttons
- **Trending Section**: Content carousel with modal popups for detailed views
- **Subscription Plans**: Three-tier pricing structure (Monthly, Yearly, Lifetime)
- **Benefits Section**: Feature highlights with device compatibility
- **Testimonials**: User reviews and ratings
- **Footer**: Links and final call-to-action

#### Backend Structure
- **Routes**: Centralized route registration in `server/routes.ts`
- **Storage Interface**: Abstracted storage layer with memory and database implementations
- **Schema**: User management with Drizzle ORM schema definitions
- **Middleware**: Request logging and error handling

## Data Flow

1. **Client Request**: User interacts with React components
2. **State Management**: React Query manages server state and caching
3. **API Calls**: Frontend makes HTTP requests to Express backend
4. **Route Handling**: Express routes process requests using storage interface
5. **Data Storage**: Storage interface abstracts database operations
6. **Response**: JSON data returned to frontend for UI updates

## External Dependencies

### Frontend Dependencies
- **UI Library**: Radix UI components for accessibility
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React and React Icons
- **Animations**: CSS animations and transitions
- **Fonts**: Google Fonts (Poppins, Inter)

### Backend Dependencies
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with Zod schema validation
- **Session Store**: PostgreSQL session store (connect-pg-simple)
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Static type checking
- **ESLint/Prettier**: Code quality and formatting
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL database
- **Environment**: Replit with Node.js 20, PostgreSQL 16 modules

### Production Build
- **Frontend**: Vite build process generating optimized static assets (71KB CSS, 367KB JS)
- **Backend**: esbuild compilation to single JavaScript file (34KB)
- **Build Output**: `dist/public/` for frontend, `dist/index.js` for server
- **Deployment**: Vercel serverless functions
- **Configuration**: Optimized `vercel.json` for full-stack deployment

### Vercel Deployment
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Server Function**: `dist/index.js` with 30s timeout
- **Environment Variables**: 
  - FOR4PAYMENTS_API_KEY: `6c1c43c0-c504-438d-bc39-ecbfd65c2f27`
  - UTMIFY_API_TOKEN: `JYGvNA3D1cBxNv6w6iLnk0p65FsI4kYXZyWq`
  - OPENAI_API_KEY: Required for chat functionality
- **Routing**: API routes to serverless function, static assets served directly
- **Configuration**: Fixed vercel.json to use functions instead of builds property

### Database Management
- **Migrations**: Drizzle Kit for schema migrations
- **Connection**: Environment-based DATABASE_URL configuration
- **Schema**: Shared schema definitions between frontend and backend

## Changelog

Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Integrated ChatGPT-powered support chat with specialized prompt for comprehensive customer service
- June 14, 2025. Added interactive action buttons in chat (Assinar Agora, Ver Catálogo)
- June 14, 2025. Fixed testimonials avatars with custom colored initial badges
- June 14, 2025. Created intelligent fallback system for chat responses
- June 14, 2025. Added complete download page for app delivery after payment confirmation
- June 14, 2025. Implemented 4-device download system (Mobile, Smart TV, Computer, TV Box)
- June 14, 2025. Added Telegram support integration and installation instructions
- June 15, 2025. Expanded FAQ system with 400+ questions covering all service aspects
- June 15, 2025. Built production-ready Vercel deployment with optimized bundle sizes
- June 15, 2025. Configured serverless functions and static asset routing for deployment
- June 15, 2025. Implemented order bump functionality in checkout system
- June 15, 2025. Added upsell offers: monthly plan gets "+1 mês de uso por R$ 9,90", all plans get "atendimento exclusivo R$ 9,90"
- June 15, 2025. Created interactive checkbox interface with dynamic pricing calculation and order summary updates
- June 15, 2025. Replaced desktop redirect with comprehensive /noticia page featuring 25 best films of 2025
- June 15, 2025. Enhanced news page with categorized content, top 5 rankings, and Megaflix promotion sections
- June 15, 2025. Configured OpenAI ChatGPT integration for natural human-like customer service responses
- June 15, 2025. Enhanced chat system to answer any question type with intelligent redirection to Megaflix services
- June 15, 2025. Implemented desktop device detection and automatic redirection from / to /noticia for PC users
- June 15, 2025. Added comprehensive device detection middleware and React hook for cross-platform compatibility
- June 15, 2025. Fixed Vercel deployment configuration removing builds/functions conflict
- June 15, 2025. Updated environment variables with production API keys for FOR4PAYMENTS and UTMIFY
- June 15, 2025. Removed promotional section from news page and updated mobile download link to Dropbox APK
- June 16, 2025. Fixed critical payment API error "Resposta invalidada do servidor de pagamento"
- June 16, 2025. Implemented proper 4ForPayments API structure with CPF/email validation and authentic payment processing
- June 16, 2025. Resolved Vercel deployment configuration with correct dist directory mapping for production builds
- June 16, 2025. Removed automatic desktop redirection - all devices now access home page directly

## User Preferences

Preferred communication style: Simple, everyday language.