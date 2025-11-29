-- Migration: Convert all prices from USD to INR
-- Conversion rate: 1 USD = 83 INR (adjust as needed)
-- Created: 2025-01-26

-- Update menu_item table
UPDATE menu_item 
SET price = ROUND(price * 83, 2)
WHERE price IS NOT NULL;

-- Update orders table
UPDATE orders 
SET total = ROUND(total * 83, 2),
    subtotal = ROUND(subtotal * 83, 2),
    delivery_fee = ROUND(delivery_fee * 83, 2),
    tax = ROUND(tax * 83, 2)
WHERE total IS NOT NULL;

-- Update restaurant delivery_fee
UPDATE restaurant
SET delivery_fee = ROUND(delivery_fee * 83, 2)
WHERE delivery_fee IS NOT NULL;

-- Update order_item prices
UPDATE order_item
SET price = ROUND(price * 83, 2)
WHERE price IS NOT NULL;

-- (Optional) Verification queries to run manually if needed
-- SELECT name, price, 'INR' as currency FROM menu_item LIMIT 10;
-- SELECT id, total, 'INR' as currency FROM orders LIMIT 10;
