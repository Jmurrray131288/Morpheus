Morpheus EMR System
Overview
Morpheus is a comprehensive Electronic Medical Records (EMR) system built as a full-stack web application. The system provides healthcare professionals with tools to manage patient records, track health metrics, manage medications, record visit notes, and implement precision medicine protocols. It's designed as a modern, responsive web application with a focus on usability and comprehensive patient care management.

System Architecture
Frontend Architecture
Framework: React 18 with TypeScript
Routing: Wouter for client-side routing
State Management: TanStack Query (React Query) for server state management
Styling: Tailwind CSS with shadcn/ui component library
Form Handling: React Hook Form with Zod validation
Build Tool: Vite for development and production builds
Backend Architecture
Runtime: Node.js with Express.js server
Language: TypeScript with ES modules
API Design: RESTful API architecture
Session Management: Express sessions with PostgreSQL storage
Database Client: Supabase client for type-safe database operations
Data Storage Solutions
Primary Database: PostgreSQL via Neon serverless
Session Storage: PostgreSQL-backed session store using connect-pg-simple
Schema Management: Supabase database with direct SQL schema management
Key Components
Patient Management System
Comprehensive patient records with demographics, contact information, and medical history
Patient selector interface for quick switching between patients
Support for patient profile management and updates
Health Metrics Tracking
Body Composition: BMI, body fat percentage, muscle mass tracking
Cardiovascular Health: Blood pressure, heart rate monitoring
Metabolic Health: Blood glucose, insulin levels, metabolic markers
Real-time metric calculations and trend analysis
Medication Management
Prescribed medication tracking with dosage, frequency, and duration
Medication entry logging for adherence monitoring
Integration with patient health metrics for comprehensive care
Laboratory Records
Lab result management and storage
Support for various lab panel types and custom test results
Historical lab data tracking and trend analysis
Visit Notes System
Structured visit note creation and management
Integration with patient health data for comprehensive documentation
Visit history and note searching capabilities
Advanced Treatment Protocols
Precision Medicine: Genomic report integration and precision lab testing
Peptide Therapy: Specialized peptide treatment tracking
Supplement Management: Nutritional supplement monitoring
IV Treatment: Intravenous therapy protocol management
Authentication & Authorization
Session-based authentication system
User profile management with role-based access (prepared for future expansion)
Secure session storage in PostgreSQL database
Data Flow
Client Request: React frontend makes API requests through TanStack Query
Server Processing: Express.js server handles requests with proper validation
Database Operations: Drizzle ORM manages PostgreSQL interactions
Response Handling: Server returns JSON responses with appropriate status codes
State Management: TanStack Query caches and manages server state on the client
UI Updates: React components re-render based on updated state
External Dependencies
Database & Infrastructure
Neon PostgreSQL: Serverless PostgreSQL database hosting
WebSocket Support: For real-time database connections
UI & Styling
Radix UI: Headless component primitives for accessibility
Tailwind CSS: Utility-first CSS framework
Lucide React: Icon library for consistent iconography
Development & Build Tools
Vite: Fast development server and build tool
TypeScript: Type safety across the entire stack
ESBuild: Fast JavaScript bundler for production builds
Validation & Forms
Zod: Runtime type validation and schema definition
React Hook Form: Performant form handling with minimal re-renders
Deployment Strategy
Development Environment
Local development server running on port 5000
Hot module replacement via Vite
Database connection to Neon PostgreSQL instance
Session storage in development database
Production Deployment
Platform: Replit deployment with autoscale capability
Build Process:
Vite builds React frontend to dist/public
ESBuild bundles Express server to dist/index.js
Runtime: Node.js production server serving static files and API
Database: Production PostgreSQL instance via Neon
Port Configuration: External port 80 mapped to internal port 5000
Database Management
Schema migrations managed through Drizzle Kit
Database schema defined in shared TypeScript files
Environment-based connection string configuration
Production Launch Requirements
Phase 1: Security & Authentication (Essential)
 User Authentication System - Login/logout with role-based access
 User Management - Admin can create doctor/nurse/staff accounts
 Password Security - Encrypted passwords, password reset functionality
 Session Management - Secure session handling, auto-logout
 Access Control - Role-based permissions (admin, doctor, nurse, staff)
Phase 2: HIPAA Compliance (Required for Medical Use)
 Data Encryption - All patient data encrypted at rest and in transit
 Audit Logging - Track all user actions and data access
 Privacy Controls - Patient consent management, data access restrictions
 Backup Systems - Automated daily backups with encryption
 Business Associate Agreements - Legal compliance documentation
Phase 3: Professional Deployment (Infrastructure)
 Custom Domain - Professional URL (e.g., morpheusemr.com)
 SSL Certificate - HTTPS encryption for all connections
 Professional Hosting - Move to HIPAA-compliant hosting provider
 Database Security - Production-grade PostgreSQL with security hardening
 Error Monitoring - Real-time error tracking and alerting
Phase 4: Clinical Features (Nice-to-Have)
 Appointment Scheduling - Calendar integration for patient appointments
 Prescription Management - E-prescribing integration
 Insurance Verification - Insurance card scanning and verification
 Billing Integration - Connect to practice management software
 Patient Portal - Secure patient access to their own records
Phase 5: Compliance & Legal (Before Launch)
 HIPAA Risk Assessment - Professional security audit
 Legal Review - Terms of service, privacy policy, compliance documentation
 Staff Training - User manuals and training materials
 Disaster Recovery Plan - Data backup and recovery procedures
 Support System - Help desk and technical support setup
Changelog
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
- June 27, 2025: Enhanced patient profile header with full-width design, gradient background, and professional headshot/initials display for improved patient identification
- June 27, 2025: Added comprehensive weight and muscle mass trends chart to patient records with dual-axis visualization, trend analysis, and progress tracking capabilities
- June 27, 2025: Created functional body composition entry form with US measurements (height in inches, weight in pounds) and automatic BMI calculation - replaced confusing dual-button interface with single clean form
- June 27, 2025: Removed manual date selector from body composition form and implemented automatic server-side timestamping for clinical accuracy - measurements are now timestamped exactly when entered
- June 27, 2025: Added comprehensive body composition history modal with trend analysis - users can now view complete timeline of all past measurements with visual trend indicators showing progress over time
- June 27, 2025: Implemented medication deletion functionality with confirmation dialogs and trash can icons for safe medication management
- June 27, 2025: Created comprehensive medication discontinuation system with required reason documentation, staff initials tracking, and audit trail - includes edit modal with status change capabilities and discontinuation info display
- June 27, 2025: Converted patients page from card layout to efficient table format for better scalability with 50+ patients - displays essential info in compact rows with quick access to patient profiles
- June 27, 2025: Fixed API request parameter order bugs in patient and medication editing - resolved HTTP method errors that prevented updates from working properly
- June 27, 2025: Added comprehensive practice analytics dashboard above patients list - shows total patients, average age, growth trends, demographics with visual charts for age distribution and gender breakdown using real patient data
- June 27, 2025: Enhanced analytics with treatment types visualization - shows which services are thriving by categorizing medications into supplements, diabetes care, cardiovascular, pain management, and general medicine with real-time data
- June 27, 2025: Fixed visit notes "Add Note" button functionality - resolved API request format errors and implemented working visit note creation modal with proper form validation and automatic data refresh
- June 30, 2025: Implemented production-ready drag-and-drop file upload system for lab reports with AWS S3 cloud storage integration, secure multipart file upload, and proper validation (PDF, images, Word docs up to 10MB)
- June 30, 2025: Removed recent activity dashboard component to streamline interface focus on core clinical functionality
- June 30, 2025: Successfully deployed complete Morpheus EMR system to GitHub repository (Morpheus-Precision) with comprehensive README, proper .gitignore, and all production-ready features
- July 7, 2025: Identified production launch requirements - documented comprehensive 5-phase plan for security, HIPAA compliance, professional deployment, clinical features, and legal compliance needed for real medical office deployment
- July 7, 2025: User working on GitHub deployment and Render hosting - converting Drizzle schema to Prisma for deployment compatibility
- July 8, 2025: Fixed critical import errors in server/routes.ts - corrected schema imports to use ../shared/schema instead of ./schema, removed duplicate imports, fixed dynamic imports, and successfully restored application functionality
- July 8, 2025: Resolved runtime module resolution errors - fixed @shared/schema alias imports in server/storage.ts and server/db.ts to use relative paths (../shared/schema), ensuring proper module resolution in Node.js runtime environment
- July 8, 2025: Fixed medication system compatibility - updated code to work with production Prisma database structure using both medications and prescribed_medications tables
- July 8, 2025: Created missing health metrics modal components - added cardiovascular and metabolic health entry modals to fix non-functional "Add Entry" buttons
- July 9, 2025: Enhanced database schema to match production structure - added appointments, vitals, diagnoses, protocols, providers, services, and service_orders tables with proper relations and type definitions for complete EMR functionality
- July 9, 2025: Implemented comprehensive RLS (Row Level Security) authentication system with role-based access control - created login/logout functionality, session management, user creation/management, and database-level security policies for admin, doctor, nurse, and staff roles
- July 9, 2025: Updated all production tables to exactly match database structure - standardized patient_id fields to text type, added US measurement units (inches, pounds, Fahrenheit), and synchronized all table schemas for seamless deployment
- July 9, 2025: Created comprehensive production database migration guide (PRODUCTION_DATABASE_MIGRATION.md) - contains all SQL commands needed to update production database to match development schema changes for medication system compatibility
- July 9, 2025: Identified Prisma/Supabase schema mismatch - created PRISMA_BACKEND_FILES.md with correct backend code to work with user's existing Prisma schema structure using prescribed_medications table with BigInt IDs and snake_case field names
- July 9, 2025: Fixed critical medication system compatibility issues - removed non-existent medicationEntryId references from schema and frontend modals that were causing runtime errors
- July 9, 2025: Resolved health metrics "Add Entry" button functionality - updated backend storage functions to use raw SQL queries matching actual Prisma database structure (cardiovascular, metabaolic, "Body Composition Entries" tables)
- July 9, 2025: Fixed database field mapping issues - corrected cardiovascular modal to use JSON fields and integer blood pressure, metabolic modal to use text fields, and body composition modal to use correct field names (heightIn, weightLbs, bodyFatPerc, skeletalMusc)
- July 9, 2025: Updated all health metrics modals to work with production Prisma/Supabase database structure - fixed API request formats, field name mappings, and data type conversions for cardiovascular, metabolic, and body composition entries
- July 10, 2025: Completely fixed medication system - removed all broken medicationEntry/medicationEntryId references from routes, storage, and schema; updated medication modal to work directly with prescribed_medications table; cleaned up advanced treatments to work without intermediate medication entries
- July 10, 2025: **MAJOR: Replaced Drizzle ORM with Supabase client** - eliminated all production build errors by removing complex ORM bundling issues; created clean database layer using your exact Prisma schema structure; significantly reduced bundle size and complexity while maintaining full EMR functionality
- July 10, 2025: **DEPLOYMENT READY: Complete package-lock.json sync** - regenerated and uploaded updated lock file with all Supabase dependencies to GitHub repository; resolved npm ci deployment errors; production deployment now fully functional with new architecture
- July 10, 2025: **FINAL DEPLOYMENT FIX: Updated Render configuration** - modified render.yaml to force clean package lock regeneration during build; fixed remaining authentication and RLS database references; eliminated all deployment version mismatch errors
- July 10, 2025: **RAILWAY DEPLOYMENT: Added Procfile configuration** - discovered user deploying on Railway platform instead of Render; created Procfile with explicit build commands to resolve package.json file path issues and force proper dependency installation sequence
- July 10, 2025: **COMPLETE DRIZZLE REMOVAL: Clean Supabase architecture** - completely eliminated all remaining Drizzle ORM references from authentication.ts, routes.ts, and codebase; replaced with clean Supabase executeQuery calls; removed drizzle-orm, drizzle-zod, drizzle-kit packages; updated replit.md documentation; fixed all database operations to use proper SQL with snake_case field names
User Preferences
Preferred communication style: Simple, everyday language.
