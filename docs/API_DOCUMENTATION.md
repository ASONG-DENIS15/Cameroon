# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+237123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "tourist"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### Verify Email
**POST** `/auth/verify-email`

**Request Body:**
```json
{
  "token": "verification_token"
}
```

### Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset_token",
  "password": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### Refresh Token
**POST** `/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### Get Profile
**GET** `/auth/profile`

**Headers:** Requires authentication

---

## Attractions Endpoints

### Get All Attractions
**GET** `/attractions?page=1&limit=10&region_id=1&category=natural&min_price=5000&max_price=50000`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `region_id` (optional): Filter by region
- `category` (optional): natural, cultural, historical, adventure
- `min_price` (optional): Minimum entry fee
- `max_price` (optional): Maximum entry fee
- `is_featured` (optional): true/false
- `min_rating` (optional): Minimum rating

### Get Featured Attractions
**GET** `/attractions/featured?limit=6`

### Get Attraction by ID
**GET** `/attractions/:id`

### Search Attractions
**GET** `/attractions/search?q=mount&limit=10`

### Create Attraction (Admin)
**POST** `/attractions`

**Headers:** Requires admin authentication

### Update Attraction (Admin)
**PUT** `/attractions/:id`

**Headers:** Requires admin authentication

### Delete Attraction (Admin)
**DELETE** `/attractions/:id`

**Headers:** Requires admin authentication

---

## Bookings Endpoints

### Create Booking
**POST** `/bookings`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "attraction_id": 1,
  "booking_date": "2024-12-25",
  "number_of_adults": 2,
  "number_of_children": 1,
  "special_requests": "Window seat preferred"
}
```

### Get User Bookings
**GET** `/bookings?page=1&limit=10`

**Headers:** Requires authentication

### Get Booking by ID
**GET** `/bookings/:id`

**Headers:** Requires authentication

### Cancel Booking
**POST** `/bookings/:id/cancel`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

---

## Reviews Endpoints

### Create Review
**POST** `/reviews`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "attraction_id": 1,
  "rating": 5,
  "comment": "Amazing experience!",
  "booking_id": 1
}
```

### Get Attraction Reviews
**GET** `/reviews/attraction/:attraction_id?page=1&limit=10`

### Update Review
**PUT** `/reviews/:id`

**Headers:** Requires authentication

### Delete Review
**DELETE** `/reviews/:id`

**Headers:** Requires authentication

---

## Regions Endpoints

### Get All Regions
**GET** `/regions`

### Get Region by ID
**GET** `/regions/:id`

### Create Region (Admin)
**POST** `/regions`

**Headers:** Requires admin authentication

### Update Region (Admin)
**PUT** `/regions/:id`

**Headers:** Requires admin authentication

---

## Admin Endpoints

All admin endpoints require admin role authentication.

### Get Dashboard Statistics
**GET** `/admin/dashboard/statistics`

### Get All Bookings
**GET** `/admin/bookings?page=1&limit=10&status=pending&attraction_id=1`

### Update Booking Status
**PUT** `/admin/bookings/:id/status`

**Request Body:**
```json
{
  "status": "confirmed",
  "cancellation_reason": null
}
```

### Get Top Attractions
**GET** `/admin/analytics/top-attractions?limit=5`

### Get Total Revenue
**GET** `/admin/analytics/revenue`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```
