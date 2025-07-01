# Morpheus EMR System

A comprehensive Electronic Medical Records (EMR) system built for modern precision medicine practices. Morpheus provides healthcare professionals with advanced tools for patient management, health metrics tracking, medication management, and clinical documentation.

## 🏥 Features

### Patient Management
- Complete patient profiles with demographics and medical history
- Efficient patient search and selection interface
- Real-time patient data updates

### Health Metrics Tracking
- **Body Composition**: BMI, body fat percentage, muscle mass tracking with trend analysis
- **Cardiovascular Health**: Blood pressure, cholesterol, inflammatory markers
- **Metabolic Health**: Glucose monitoring, HbA1c tracking, metabolic markers

### Clinical Documentation
- Visit notes with structured documentation
- Lab results management with file upload capabilities
- Medication tracking and prescription management

### Advanced Treatment Protocols
- **Precision Medicine**: Genomic reporting and precision lab testing
- **Peptide Therapy**: Specialized peptide treatment tracking
- **Supplement Management**: Nutritional supplement monitoring
- **IV Treatment**: Intravenous therapy protocol management

### File Management
- Secure cloud-based lab report storage (AWS S3)
- Drag-and-drop file upload interface
- Support for PDF, images, and Word documents

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for modern, responsive design
- **shadcn/ui** component library
- **TanStack Query** for efficient state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** via Neon serverless

### Infrastructure
- **AWS S3** for secure file storage
- **PostgreSQL** database with session storage
- **RESTful API** architecture

## 📋 Database Schema

The system includes comprehensive tables for:
- Patient demographics and profiles
- Health metrics (body composition, cardiovascular, metabolic)
- Medication entries and prescriptions
- Visit notes and clinical documentation
- Lab records and file attachments
- Advanced treatment tracking (peptides, supplements, IV therapy)
- Precision medicine data (genomic reports, specialized testing)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- AWS S3 bucket (for file storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/morpheus-emr.git
cd morpheus-emr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database
DATABASE_URL=your_postgresql_connection_string

# AWS S3 (optional - falls back to local storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name

# Session
SESSION_SECRET=your_session_secret
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database operations
│   └── fileUpload.ts      # File handling
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── package.json
```

## 📊 Dashboard Features

- **Clinical Dashboard**: Daily practice overview with priority alerts
- **Today's Schedule**: Patient appointments with direct access to records
- **Patient Search**: Fast patient lookup with live suggestions
- **Analytics**: Practice metrics, patient demographics, and treatment trends

## 🔒 Security & Compliance

- Session-based authentication
- Secure file storage with presigned URLs
- Input validation and sanitization
- Type-safe database operations
- Environment-based configuration

## 📈 Performance Optimizations

- Optimized API endpoints with combined patient data fetching
- Efficient database queries with Drizzle ORM
- Client-side caching with TanStack Query
- Responsive design for various screen sizes

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open database studio

### Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Submit a pull request

## 📝 License

This project is proprietary software developed for healthcare practice management.

## 🏥 About

Morpheus EMR is designed specifically for precision medicine practices, providing advanced tools for comprehensive patient care management, health optimization, and clinical excellence.