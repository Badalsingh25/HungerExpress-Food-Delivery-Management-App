-- ===================================
-- FoodExpress Database Cleanup
-- ===================================
-- This script removes all test/dummy users except the admin
-- Run this to clean up the database for production use

USE foodexpress;

-- ===================================
-- BACKUP WARNING
-- ===================================
-- Before running this script, consider backing up your database:
-- mysqldump -u root -p foodexpress > backup_before_cleanup.sql

-- ===================================
-- Clean up test users (keep only admin)
-- ===================================

-- Delete all users except the admin (badalkusingh8@gmail.com)
-- This will cascade delete all related data due to foreign keys
DELETE FROM users 
WHERE email != 'badalkusingh8@gmail.com';

-- Verify cleanup
SELECT 
    'After Cleanup' as Status,
    COUNT(*) as Total_Users,
    SUM(CASE WHEN role = 'ADMIN' THEN 1 ELSE 0 END) as Admin_Users,
    SUM(CASE WHEN role = 'OWNER' THEN 1 ELSE 0 END) as Owner_Users,
    SUM(CASE WHEN role = 'CUSTOMER' THEN 1 ELSE 0 END) as Customer_Users,
    SUM(CASE WHEN role = 'AGENT' THEN 1 ELSE 0 END) as Agent_Users
FROM users;

-- Show remaining user
SELECT id, email, full_name, role, enabled, created_at
FROM users;

-- ===================================
-- Database is now clean!
-- ===================================
SELECT 'Database cleanup complete! Only admin user remains.' as message;
