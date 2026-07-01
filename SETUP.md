# Cameroon Tourism - Project Setup Guide

## Quick Start

This guide will help you set up the Cameroon Tourism platform locally.

### 1. Clone Repository
```bash
git clone https://github.com/ASONG-DENIS15/Cameroon.git
cd Cameroon
```

### 2. Backend Setup

```bash
cd server

npm install
cp .env.example .env

# Update .env with your configuration
mysql -u root -p < database.sql
npm run dev
```

### 3. Frontend Setup

```bash
cd client

npm install
cp .env.example .env

# Update .env with API URL
npm run dev
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Features Implemented

✅ User Authentication & Registration
✅ Email Verification
✅ Password Reset
✅ Attractions Management
✅ Booking System
✅ Reviews & Ratings
✅ Admin Dashboard
✅ Region Management
✅ Search & Filter
✅ Responsive Design

## Tech Stack

- **Backend**: Node.js, Express, MySQL
- **Frontend**: React, Vite, Bootstrap 5
- **Auth**: JWT
- **UI**: React Bootstrap, Framer Motion

## Support

For issues or questions, check the documentation in `/docs` folder.

---

**Happy coding! 🚀**
