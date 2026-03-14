# PowerLink Ethiopia

A digital platform for managing electricity services, outage reporting, and service requests in Ethiopia.

## Features

- **Service Requests**: Submit and track electricity service requests
- **Outage Reporting**: Report and monitor power outages
- **User Management**: Role-based access (Admin, Supervisor, Technician, Customer)
- **Document Upload**: Attach supporting documents to service requests
- **Real-time Updates**: Track request status and notifications

## Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Framer Motion
- React Router

**Backend:**
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- Multer (File uploads)

## Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL or Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd powerlink
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend/vite-project
   npm install
   cp .env.example .env
   # Update .env with your API URL
   npm run dev
   ```

### Environment Configuration

See `backend/ENV_SETUP.md` for detailed environment setup instructions.

### Database Setup

1. Run the SQL script: `SUPABASE_TABLES.sql`
2. Create admin user: `node backend/scripts/create-super-admin.js`

## Project Structure

```
powerlink/
├── backend/           # Node.js API server
│   ├── config/       # Database configuration
│   ├── routes/       # API routes
│   ├── scripts/      # Database scripts
│   └── uploads/      # File uploads
├── frontend/         # React application
│   └── vite-project/
└── database/         # SQL scripts
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/service-requests` - Get service requests
- `POST /api/service-requests` - Create service request
- `GET /api/outages` - Get outage reports
- `GET /api/announcements` - Get announcements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.