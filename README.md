# Cameroon Tourism Platform

🇨🇲 **Africa in Miniature** - A comprehensive tourism booking and attraction management platform for Cameroon.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **User Authentication**: Register, login, email verification, password reset
- **Attraction Management**: Browse, search, filter attractions by region/category/price
- **Booking System**: Book attractions, manage bookings, cancel with reasons
- **Reviews & Ratings**: Leave reviews, rate attractions, view ratings
- **User Dashboard**: View bookings, manage profile, booking history
- **Admin Dashboard**: Manage bookings, view analytics, manage attractions
- **Region Management**: Organize attractions by region
- **Nearby Places**: Find hotels, restaurants, hospitals near attractions

### Technical Features
- JWT Authentication with refresh tokens
- Email notifications (welcome, verification, booking confirmation, password reset)
- Image upload with file validation
- Pagination and filtering
- Role-based access control (Tourist, Admin)
- Admin activity logging
- RESTful API with comprehensive error handling
- Responsive design with Bootstrap 5
- Smooth animations with Framer Motion
- Charts and analytics with Chart.js

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer
- **File Upload**: Multer
- **Validation**: express-validator
- **Environment**: dotenv

### Frontend
- **Framework**: React 18.2+
- **Build Tool**: Vite
- **Router**: React Router v6
- **HTTP Client**: Axios
- **UI Framework**: React Bootstrap 5
- **Form Management**: React Hook Form
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React

## 📁 Project Structure

```
Cameroon/
├── server/                      # Backend (Node.js/Express)
│   ├── src/
│   │   ├── config/             # Database & configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth, validation, file upload
│   │   ├── models/             # Database queries
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Helper functions
│   │   └── app.js              # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
├── client/                      # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── App.jsx
│   │   └── main.jsx            # Entry point
│   ├── .env.example
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
├── docs/                        # Documentation
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   └── DEPLOYMENT.md
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js 16.x or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

5. **Create database**
   ```bash
   mysql -u root -p < database.sql
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Configuration section)

## ⚙️ Configuration

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cameroon_tourism

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=30d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@cameroon-tourism.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif
UPLOAD_DIR=./uploads
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Cameroon Tourism
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FRONTEND_URL=http://localhost:3000
```

## 🎯 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Client runs on: http://localhost:3000

### Production Build

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm preview
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for detailed API endpoints and usage.

### Quick API Overview

**Authentication Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh access token

**Attractions Endpoints:**
- `GET /api/attractions` - Get all attractions with pagination
- `GET /api/attractions/featured` - Get featured attractions
- `GET /api/attractions/:id` - Get attraction details
- `GET /api/attractions/search?q=query` - Search attractions
- `POST /api/attractions` - Create attraction (Admin)
- `PUT /api/attractions/:id` - Update attraction (Admin)
- `DELETE /api/attractions/:id` - Delete attraction (Admin)

**Bookings Endpoints:**
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings/:id/cancel` - Cancel booking

**Reviews Endpoints:**
- `POST /api/reviews` - Create review
- `GET /api/reviews/attraction/:id` - Get attraction reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

**Regions Endpoints:**
- `GET /api/regions` - Get all regions
- `GET /api/regions/:id` - Get region details

**Admin Endpoints:**
- `GET /api/admin/dashboard/statistics` - Get dashboard stats
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `GET /api/admin/analytics/top-attractions` - Top attractions
- `GET /api/admin/analytics/revenue` - Total revenue

## 📊 Database Schema

See [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for detailed database schema and relationships.

### Main Tables
- `users` - User accounts and profiles
- `attractions` - Tourist attractions
- `regions` - Geographic regions
- `bookings` - Attraction bookings
- `reviews` - User reviews and ratings
- `tokens` - Authentication tokens
- `nearby_places` - Hotels, restaurants, hospitals
- `admin_activity_logs` - Admin action logs

## 🚀 Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions for:
- Heroku
- DigitalOcean
- AWS
- Vercel (Frontend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Cameroon tourism inspiration
- Express.js and React communities
- Bootstrap and Framer Motion teams

## 📞 Support

For support, email support@cameroon-tourism.com or open an issue on GitHub.

---

**Made with ❤️ for Cameroon Tourism**
