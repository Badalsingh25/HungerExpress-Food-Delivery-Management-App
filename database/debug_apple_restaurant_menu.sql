-- Debug: Why Apple Restaurant menu items aren't showing
USE foodexpress;

-- Step 1: Find Apple Restaurant
SELECT id, name, cuisine, approved 
FROM restaurant 
WHERE name LIKE '%Apple%';

-- Step 2: Check menu categories for Apple Restaurant (use ID from step 1)
SELECT 
    mc.id,
    mc.name,
    mc.position,
    mc.restaurant_id
FROM menu_category mc
JOIN restaurant r ON mc.restaurant_id = r.id
WHERE r.name LIKE '%Apple%'
ORDER BY mc.position;

-- Step 3: Check menu items and their approval status
SELECT 
    mi.id,
    mi.name,
    mi.price,
    mi.approval_status,
    mi.available,
    mi.approved_at,
    mi.submitted_at,
    r.name AS restaurant_name,
    mc.name AS category_name
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
LEFT JOIN menu_category mc ON mi.category_id = mc.id
WHERE r.name LIKE '%Apple%'
ORDER BY mi.id;

-- Step 4: Count items by approval status
SELECT 
    approval_status,
    COUNT(*) AS count
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
WHERE r.name LIKE '%Apple%'
GROUP BY approval_status;

-- Step 5: Check if categories have any items at all
SELECT 
    mc.id AS category_id,
    mc.name AS category_name,
    COUNT(mi.id) AS total_items,
    SUM(CASE WHEN mi.approval_status = 'APPROVED' THEN 1 ELSE 0 END) AS approved_items
FROM menu_category mc
JOIN restaurant r ON mc.restaurant_id = r.id
LEFT JOIN menu_item mi ON mi.category_id = mc.id
WHERE r.name LIKE '%Apple%'
GROUP BY mc.id, mc.name
ORDER BY mc.position;
