-- Migration: Convert all prices from USD to INR
-- Conversion rate: 1 USD = 83 INR (adjust as needed)
-- Created: 2025-01-26

-- Update menu_items table
UPDATE menu_items 
SET price = ROUND(price * 83, 2)
WHERE price IS NOT NULL;

-- Update orders table
UPDATE orders 
SET total_amount = ROUND(total_amount * 83, 2),
    subtotal = ROUND(subtotal * 83, 2),
    delivery_fee = ROUND(delivery_fee * 83, 2),
    tax = ROUND(tax * 83, 2)
WHERE total_amount IS NOT NULL;

-- Update restaurants delivery_fee
UPDATE restaurants
SET delivery_fee = ROUND(delivery_fee * 83, 2)
WHERE delivery_fee IS NOT NULL;

-- Update order_items
UPDATE order_items
SET price = ROUND(price * 83, 2),
    subtotal = ROUND(subtotal * 83, 2)
WHERE price IS NOT NULL;

-- Add comment to indicate currency is INR
COMMENT ON COLUMN menu_items.price IS 'Price in INR (Indian Rupees)';
COMMENT ON COLUMN orders.total_amount IS 'Total amount in INR (Indian Rupees)';
COMMENT ON COLUMN restaurants.delivery_fee IS 'Delivery fee in INR (Indian Rupees)';

-- Verification queries (run separately to check)
-- SELECT name, price, 'INR' as currency FROM menu_items LIMIT 10;
-- SELECT id, total_amount, 'INR' as currency FROM orders LIMIT 10;
