# Global Pathways - Automated Scholarship System

## 🎓 Complete College Admissions Platform with AI-Powered Scholarship Matching

This is the complete source code for the Global Pathways website, featuring an automated scholarship ingestion system, real-time updates, AI-powered matching, and comprehensive college admissions tools.

## 🌟 Features

### Core Platform
- **AI-Powered Scholarship Finder** - GPT-4 integration for personalized recommendations
- **College Comparison Tool** - Side-by-side comparison of up to 4 colleges
- **Personalized Cost Calculator** - Accounts for user profile, major, and location
- **Comprehensive Database** - 150+ colleges and automated scholarship ingestion
- **Real-time Updates** - Live scholarship updates using Supabase Realtime
- **Admin Moderation Panel** - Complete management system for scholarships

### Automated Scholarship System
- **Multi-source Ingestion** - CSV, RSS, and API support
- **Deduplication Logic** - Prevents duplicate entries
- **Link Validation** - Automatic broken link detection
- **Real-time Display** - Updates appear within 10 seconds
- **User Reporting** - Community-driven quality control
- **GitHub Actions Automation** - Daily scheduled ingestion

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React hooks + Context API
- **Routing**: React Router DOM
- **Real-time**: Supabase Realtime subscriptions

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Edge Functions**: TypeScript serverless functions
- **Storage**: File storage for images/documents

### Automation (Node.js + GitHub Actions)
- **Ingestion Script**: Node.js with multiple source support
- **Scheduling**: GitHub Actions cron jobs
- **Monitoring**: Comprehensive logging and alerts
- **Quality Control**: Admin moderation workflow

## 📁 Project Structure

```
college_admissions_guide/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navigation.tsx  # Main navigation
│   │   └── Footer.tsx      # Site footer
│   ├── pages/              # Page components
│   │   ├── AutoScholarshipFinderPage.tsx  # AI scholarship finder
│   │   ├── ScholarshipPage.tsx            # Scholarship search
│   │   ├── CollegeComparisonPage.tsx      # College comparison
│   │   ├── CostCalculatorPage.tsx         # Cost calculator
│   │   ├── AdminPage.tsx                  # Admin panel
│   │   └── ...
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── integrations/       # Third-party integrations
│   └── lib/                # Utility functions
├── supabase/
│   ├── migrations/         # Database migrations
│   └── edge_function/      # Serverless functions
├── cypress/                # E2E tests
├── .github/workflows/      # GitHub Actions
├── ingest-sources.js       # Scholarship ingestion script
└── package.json           # Dependencies
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- GitHub account (for automation)

### 1. Clone and Install
```bash
# Extract the downloaded archive
tar -xzf global_pathways_complete_code.tar.gz
cd college_admissions_guide

# Install dependencies
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Run the SQL migrations in your Supabase dashboard:
```bash
# Execute all files in supabase/migrations/ in order
```

### 4. Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## 🔧 Automated Scholarship System Setup

### 1. Configure Sources
Edit `ingest-sources.js` and replace the sample sources with real providers:
```javascript
const SOURCES = [
  {
    id: 'fastweb',
    type: 'api',
    url: 'https://api.fastweb.com/scholarships',
    apiKey: process.env.FASTWEB_API_KEY
  },
  // Add more sources...
];
```

### 2. GitHub Actions Setup
Add these secrets to your GitHub repository:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SENDGRID_API_KEY` (optional)
- `ADMIN_EMAIL` (optional)

### 3. Manual Ingestion Test
```bash
# Set environment variables
export SUPABASE_URL=your_url
export SUPABASE_SERVICE_KEY=your_service_key

# Run ingestion
node ingest-sources.js
```

## 🎯 Key Components

### AutoScholarshipFinderPage.tsx
- AI-powered scholarship matching using GPT-4
- Real-time updates via Supabase subscriptions
- User profile-based filtering
- Bookmarking and alerts system

### ScholarshipPage.tsx
- Comprehensive scholarship search and filtering
- Real-time data synchronization
- User reporting functionality
- Mobile-responsive design

### AdminPage.tsx
- Scholarship moderation queue
- User report management
- Ingestion monitoring dashboard
- Bulk edit/approve/delete operations

### ingest-sources.js
- Multi-source data ingestion (CSV, RSS, API)
- Deduplication and validation logic
- Error handling and logging
- Email notifications

## 🗄️ Database Schema

### Main Tables
- `scholarships` - Automated scholarship data
- `colleges_database_2025_10_06_01_15` - College information
- `reports` - User feedback and issues
- `ingest_reports` - Ingestion monitoring
- `scholarship_bookmarks_2025_10_07_02_17` - User bookmarks

### Key Features
- Row Level Security (RLS) policies
- Real-time subscriptions
- Comprehensive indexing
- Data validation constraints

## 🧪 Testing

### Run Cypress Tests
```bash
# Start development server
npm run dev

# Run tests
npm run test
```

### Test Coverage
- Scholarship search and filtering
- Real-time updates
- Admin functionality
- Mobile responsiveness
- Error handling

## 🚀 Deployment

### Frontend Deployment
The project is configured for deployment on:
- Vercel (recommended)
- Netlify
- Any static hosting service

### Automation Deployment
- GitHub Actions runs automatically
- Daily ingestion at 3:00 AM UTC
- Error notifications via email

## 🔐 Security

### Authentication
- Supabase Auth integration
- Row Level Security policies
- Admin role-based access

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## 📊 Monitoring

### Admin Dashboard
- Real-time ingestion status
- Error tracking and resolution
- User report management
- Performance metrics

### Logging
- Comprehensive error logging
- Ingestion success/failure tracking
- User activity monitoring
- Performance analytics

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation

## 📞 Support

### Common Issues
1. **Scholarship not updating**: Check Supabase connection and RLS policies
2. **Ingestion failing**: Verify API keys and source configurations
3. **Real-time not working**: Check Supabase Realtime settings

### Debugging
- Check browser console for errors
- Review Supabase logs
- Monitor GitHub Actions output
- Use admin panel for system status

## 📈 Performance

### Optimization Features
- Lazy loading components
- Database indexing
- Image optimization
- Caching strategies

### Scalability
- Horizontal scaling ready
- Database connection pooling
- CDN integration
- Load balancing support

## 🔄 Updates

### Keeping Current
- Regular dependency updates
- Security patch monitoring
- Feature enhancement tracking
- Community feedback integration

---

## 📋 Quick Reference

### Important URLs
- **Live Site**: https://5k8d9u5r3c.skywork.website
- **Admin Panel**: /admin (requires admin access)
- **API Documentation**: Supabase dashboard

### Key Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests
node ingest-sources.js  # Manual ingestion
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
SENDGRID_API_KEY=your_sendgrid_key
```

---

**Built with ❤️ for students worldwide**

This system helps international and underprivileged students access U.S. higher education through automated scholarship discovery and comprehensive college guidance.