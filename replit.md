# Morpheus EMR System

## Overview

Morpheus is a comprehensive Electronic Medical Records (EMR) system built as a full-stack web application. The system provides healthcare professionals with tools to manage patient records, track health metrics, manage medications, record visit notes, and implement precision medicine protocols. It's designed as a modern, responsive web application with a focus on usability and comprehensive patient care management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM for type-safe database operations

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Schema Management**: Drizzle migrations for database schema versioning

## Key Components

### Patient Management System
- Comprehensive patient records with demographics, contact information, and medical history
- Patient selector interface for quick switching between patients
- Support for patient profile management and updates

### Health Metrics Tracking
- **Body Composition**: BMI, body fat percentage, muscle mass tracking
- **Cardiovascular Health**: Blood pressure, heart rate monitoring
- **Metabolic Health**: Blood glucose, insulin levels, metabolic markers
- Real-time metric calculations and trend analysis

### Medication Management
- Prescribed medication tracking with dosage, frequency, and duration
- Medication entry logging for adherence monitoring
- Integration with patient health metrics for comprehensive care

### Laboratory Records
- Lab result management and storage
- Support for various lab panel types and custom test results
- Historical lab data tracking and trend analysis

### Visit Notes System
- Structured visit note creation and management
- Integration with patient health data for comprehensive documentation
- Visit history and note searching capabilities

### Advanced Treatment Protocols
- **Precision Medicine**: Genomic report integration and precision lab testing
- **Peptide Therapy**: Specialized peptide treatment tracking
- **Supplement Management**: Nutritional supplement monitoring
- **IV Treatment**: Intravenous therapy protocol management

### Authentication & Authorization
- Session-based authentication system
- User profile management with role-based access (prepared for future expansion)
- Secure session storage in PostgreSQL database

## Data Flow

1. **Client Request**: React frontend makes API requests through TanStack Query
2. **Server Processing**: Express.js server handles requests with proper validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: Server returns JSON responses with appropriate status codes
5. **State Management**: TanStack Query caches and manages server state on the client
6. **UI Updates**: React components re-render based on updated state

## External Dependencies

### Database & Infrastructure
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting
- **WebSocket Support**: For real-time database connections

### UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundler for production builds

### Validation & Forms
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Performant form handling with minimal re-renders

## Deployment Strategy

### Development Environment
- Local development server running on port 5000
- Hot module replacement via Vite
- Database connection to Neon PostgreSQL instance
- Session storage in development database

### Production Deployment
- **Platform**: Replit deployment with autoscale capability
- **Build Process**: 
  1. Vite builds React frontend to `dist/public`
  2. ESBuild bundles Express server to `dist/index.js`
- **Runtime**: Node.js production server serving static files and API
- **Database**: Production PostgreSQL instance via Neon
- **Port Configuration**: External port 80 mapped to internal port 5000

### Database Management
- Schema migrations managed through Drizzle Kit
- Database schema defined in shared TypeScript files
- Environment-based connection string configuration

## Changelog

```
Changelog:
- June 26, 2025: Initial EMR system setup with comprehensive schema
- June 26, 2025: Fixed date validation issue in patient creation form - converted empty strings to null for optional date fields
- June 26, 2025: Successfully deployed and tested complete EMR dashboard with patient creation and medication management functionality
- June 27, 2025: Completed full navigation system with all sidebar sections working (Patients, Medications, Lab Records, Health Metrics, Precision Medicine, Visit Notes)
- June 27, 2025: Added functional sample data buttons for body composition and peptide therapy to demonstrate empty state handling and data population
- June 27, 2025: Redesigned dashboard to be doctor-focused with Today's Schedule, Priority Alerts, Recent Activity, and Quick Patient Search components arranged for optimal daily practice workflow
- June 27, 2025: Implemented browser-bar style patient search with live suggestions and clear labeling for intuitive user experience
- June 27, 2025: Added navigation from today's schedule to patient profiles - clicking "View" now takes you directly to the patient's full medical record
- June 27, 2025: Converted all patient profile sections from card-based to compact table rows - dramatically improved information density and space efficiency for clinical review
- June 27, 2025: Updated today's schedule to use real patient data instead of mock appointments - creates seamless workflow from daily schedule to actual patient records
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```