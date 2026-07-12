# College Datesheet Portal

A full-stack web application for managing college exam datesheets with PDF parsing capabilities.

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Redis with Bull Queue for job processing
- JWT Authentication
- PDF parsing with pdf-parse

### Frontend
- React 18
- Vite
- React Router
- Axios for API calls
- Chart.js for data visualization

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Redis (for queue processing)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd College Datesheet Portal
```

### 2. Backend Setup

Navigate to the Backend directory:
```bash
cd Backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/college-datesheet-portal
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

### 3. Frontend Setup

Navigate to the Frontend directory:
```bash
cd ../Frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

## Running the Application

1. Make sure MongoDB is running on your system
2. Make sure Redis is running (required for PDF parsing queue)
3. Start the backend server (default: http://localhost:5000)
4. Start the frontend server (default: http://localhost:5173)

## Features

- Admin dashboard for managing exam datesheets
- PDF upload and automatic parsing
- Student portal for viewing exam schedules
- Complaint management system
- Notification system
- Real-time updates

## Project Structure

```
College Datesheet Portal/
├── Backend/
│   ├── config/          # Database and configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── queue/           # Bull queue setup
│   ├── worker/          # Queue workers
│   └── uploads/         # File upload directory
└── Frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   ├── context/     # React context providers
    │   ├── hooks/       # Custom React hooks
    │   └── routes/      # Route configurations
    └── public/          # Static assets
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Admin Routes
- `/api/admin/*` - Admin-specific endpoints
- `/api/course/*` - Course management
- `/api/branch/*` - Branch management
- `/api/subject/*` - Subject management
- `/api/datesheet/*` - Datesheet management
- `/api/pdf/*` - PDF upload and parsing
- `/api/parsing-job/*` - Parsing job management
- `/api/dashboard/*` - Dashboard statistics
- `/api/complaints/*` - Complaint management
- `/api/clashes/*` - Exam clash detection

### Student Routes
- `/api/student/*` - Student-specific endpoints
- `/api/notifications/*` - Notification management

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the MONGO_URI in your .env file

### Redis Connection Error
- Ensure Redis is running on the specified host and port
- Check REDIS_HOST and REDIS_PORT in .env file

### PDF Parsing Not Working
- Verify Redis is running (required for Bull Queue)
- Check that the worker process is started

## License

ISC
