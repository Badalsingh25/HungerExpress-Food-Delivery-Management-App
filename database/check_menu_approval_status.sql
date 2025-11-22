-- Check menu item approval status for Apple Restaurant
USE foodexpress;

-- 1. Find Apple Restaurant ID
SELECT id, name, cuisine, description, approved 
FROM restaurant 
WHERE name LIKE '%Apple%'
ORDER BY id DESC;

-- 2. Check menu items for Apple Restaurant (replace '9' with actual restaurant ID from above)
SELECT 
    mi.id,
    mi.name,
    mi.price,
    mi.approval_status,
    mi.submitted_at,
    mi.approved_at,
    r.name AS restaurant_name,
    mc.name AS category_name
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
LEFT JOIN menu_category mc ON mi.category_id = mc.id
WHERE r.name LIKE '%Apple%'
ORDER BY mi.id DESC;

-- 3. Count menu items by approval status
SELECT 
    r.name AS restaurant_name,
    mi.approval_status,
    COUNT(*) AS item_count
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
WHERE r.name LIKE '%Apple%'
GROUP BY r.name, mi.approval_status;

-- 4. Check all pending menu items across all restaurants
SELECT 
    mi.id,
    r.name AS restaurant_name,
    mi.name AS item_name,
    mi.price,
    mi.approval_status,
    mi.submitted_at
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
WHERE mi.approval_status = 'PENDING'
ORDER BY mi.submitted_at DESC;

-- ========================================
-- FIX: Approve all pending menu items
-- ========================================
-- Uncomment and run this to approve pending menu items:
-- UPDATE menu_item 
-- SET approval_status = 'APPROVED',
--     approved_at = NOW(),
--     approved_by = 1  -- Replace with admin user ID
-- WHERE approval_status = 'PENDING';
