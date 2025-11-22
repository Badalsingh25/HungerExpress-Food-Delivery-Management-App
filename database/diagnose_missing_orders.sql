-- Diagnostic SQL: Check why orders are not showing in My Orders page
-- Run this in MySQL Workbench to diagnose the issue

USE foodexpress;

-- 1. Check all orders and their user_id
SELECT 
    id AS order_id,
    user_id,
    status,
    total,
    created_at,
    CASE 
        WHEN user_id IS NULL THEN '❌ NULL user_id (PROBLEM!)'
        ELSE '✅ Has user_id'
    END AS diagnosis
FROM orders
ORDER BY id DESC
LIMIT 10;

-- 2. Check which user is logged in (find by email)
SELECT id, email, full_name, phone 
FROM user_roles 
WHERE email = 'YOUR_EMAIL_HERE';  -- Replace with your login email

-- 3. Find orders with NULL user_id (these won't show up!)
SELECT 
    id AS order_id,
    status,
    total,
    created_at
FROM orders
WHERE user_id IS NULL
ORDER BY created_at DESC;

-- 4. Count orders by user_id
SELECT 
    user_id,
    COUNT(*) AS order_count,
    MIN(created_at) AS first_order,
    MAX(created_at) AS last_order
FROM orders
GROUP BY user_id
ORDER BY user_id;

-- ========================================
-- FIX: If orders have NULL user_id
-- ========================================
-- Uncomment and run this to assign orders to a specific user:
-- UPDATE orders 
-- SET user_id = 1  -- Replace '1' with correct user ID from step 2
-- WHERE user_id IS NULL;
