-- DYNAMIC FIX: Correct category_id for all menu items
-- This ensures items belong to categories from their own restaurant

USE foodexpress;

-- Step 1: Show current problem
SELECT 
    mi.id AS item_id,
    mi.name AS item_name,
    mi.restaurant_id,
    r.name AS restaurant_name,
    mi.category_id AS current_category_id,
    mc.name AS current_category_name,
    mc.restaurant_id AS category_restaurant_id,
    CASE 
        WHEN mc.restaurant_id = mi.restaurant_id THEN '✅ OK'
        WHEN mc.restaurant_id IS NULL THEN '⚠️ No Category'
        ELSE '❌ WRONG RESTAURANT'
    END AS status
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
LEFT JOIN menu_category mc ON mi.category_id = mc.id
ORDER BY mi.restaurant_id, mi.id;

-- Step 2: FIX - Auto-assign items to the first category of their restaurant
-- This is DYNAMIC and works for all restaurants

UPDATE menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
LEFT JOIN menu_category current_cat ON mi.category_id = current_cat.id
SET mi.category_id = (
    SELECT mc.id 
    FROM menu_category mc 
    WHERE mc.restaurant_id = mi.restaurant_id 
    ORDER BY mc.position ASC, mc.id ASC 
    LIMIT 1
)
WHERE 
    -- Only update if category is wrong or missing
    current_cat.id IS NULL OR current_cat.restaurant_id != mi.restaurant_id;

-- Step 3: Verify the fix
SELECT 
    mi.id AS item_id,
    mi.name AS item_name,
    r.name AS restaurant_name,
    mi.category_id,
    mc.name AS category_name,
    CASE 
        WHEN mc.restaurant_id = mi.restaurant_id THEN '✅ Fixed'
        ELSE '❌ Still Wrong'
    END AS status
FROM menu_item mi
JOIN restaurant r ON mi.restaurant_id = r.id
LEFT JOIN menu_category mc ON mi.category_id = mc.id
ORDER BY mi.restaurant_id, mi.id;
