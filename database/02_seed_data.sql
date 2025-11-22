-- ===================================
-- FoodExpress Initial Data
-- ===================================
-- This script creates the initial admin account
-- Admin Password: password123
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

USE foodexpress;

-- ===================================
-- ADMIN USER
-- ===================================

INSERT INTO users (email, password, full_name, phone, role, email_verified, phone_verified, profile_completed, is_active) VALUES
('badalkusingh8@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Badal Singh', NULL, 'ADMIN', TRUE, TRUE, TRUE, TRUE);

-- ===================================
-- Database initialized successfully
-- ===================================
-- Admin account created: badalkusingh8@gmail.com
-- Password: password123
-- 
-- Real users, restaurants, and data will be added through the application
-- ===================================

SELECT 'Database initialized with admin account!' as message;
