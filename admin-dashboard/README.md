# Meet a Rwandan Local - Admin Dashboard

A Next.js web application for managing the Meet a Rwandan Local platform.

## Features

- User management and verification
- Activity listings and moderation
- Booking management and analytics
- Payment tracking and disputes
- Review moderation
- Real-time dashboard analytics
- Content management system

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Meet a Rwandan Local Admin
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001
```

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js
- **TypeScript**: Full type safety

## Deployment

Deploy to Vercel, Netlify, or any Node.js hosting platform:

```bash
npm run build
npm start
```

## Admin Features

### Dashboard Overview
- Key metrics and KPIs
- Recent activities
- Revenue analytics
- User growth charts

### User Management
- User verification workflow
- Account status management
- Profile moderation
- Support ticket system

### Activity Management
- Activity approval process
- Content moderation
- Featured activity selection
- Category management

### Booking Analytics
- Booking trends and patterns
- Revenue tracking
- Cancellation analytics
- Host performance metrics

### Review System
- Review moderation queue
- Inappropriate content flagging
- Response management
- Quality scoring

## Security

- Role-based access control
- Secure authentication
- API rate limiting
- Audit logging
- Data encryption