# Database Schema

## Overview
This document describes the MySQL database schema for the Cameroon Tourism Platform.

## Database: cameroon_tourism

### Table: users
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  bio TEXT,
  profile_image VARCHAR(255),
  role ENUM('tourist', 'admin') DEFAULT 'tourist',
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### Table: regions
```sql
CREATE TABLE regions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: attractions
```sql
CREATE TABLE attractions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  region_id INT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  category VARCHAR(50),
  entry_fee DECIMAL(10, 2) DEFAULT 0,
  opening_hours TIME,
  closing_hours TIME,
  image_url VARCHAR(255),
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  visit_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id),
  INDEX idx_region (region_id),
  INDEX idx_category (category),
  INDEX idx_is_featured (is_featured),
  INDEX idx_slug (slug)
);
```

### Table: attraction_images
```sql
CREATE TABLE attraction_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attraction_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  caption VARCHAR(255),
  is_main BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE,
  INDEX idx_attraction (attraction_id)
);
```

### Table: bookings
```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_number VARCHAR(20) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  attraction_id INT NOT NULL,
  booking_date DATE NOT NULL,
  number_of_adults INT NOT NULL,
  number_of_children INT DEFAULT 0,
  total_visitors INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  special_requests TEXT,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (attraction_id) REFERENCES attractions(id),
  INDEX idx_user (user_id),
  INDEX idx_attraction (attraction_id),
  INDEX idx_status (status),
  INDEX idx_booking_date (booking_date)
);
```

### Table: reviews
```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  attraction_id INT NOT NULL,
  booking_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (attraction_id) REFERENCES attractions(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  UNIQUE KEY unique_user_attraction (user_id, attraction_id),
  INDEX idx_attraction (attraction_id),
  INDEX idx_rating (rating)
);
```

### Table: tokens
```sql
CREATE TABLE tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  type ENUM('email_verification', 'password_reset', 'refresh') NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_token (token),
  INDEX idx_user_type (user_id, type),
  INDEX idx_expires (expires_at)
);
```

### Table: nearby_places
```sql
CREATE TABLE nearby_places (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attraction_id INT NOT NULL,
  place_type ENUM('hotel', 'restaurant', 'hospital', 'gas_station', 'atm') NOT NULL,
  name VARCHAR(100) NOT NULL,
  distance_km DECIMAL(5, 2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(20),
  website VARCHAR(255),
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE,
  INDEX idx_attraction (attraction_id),
  INDEX idx_type (place_type)
);
```

### Table: admin_activity_logs
```sql
CREATE TABLE admin_activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id),
  INDEX idx_admin (admin_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
);
```

## Relationships

```
users (1) ──→ (many) bookings
users (1) ──→ (many) reviews
users (1) ──→ (many) tokens
users (1) ──→ (many) admin_activity_logs

regions (1) ──→ (many) attractions

attractions (1) ──→ (many) bookings
attractions (1) ──→ (many) reviews
attractions (1) ──→ (many) attraction_images
attractions (1) ──→ (many) nearby_places

bookings (1) ──→ (many) reviews
```
