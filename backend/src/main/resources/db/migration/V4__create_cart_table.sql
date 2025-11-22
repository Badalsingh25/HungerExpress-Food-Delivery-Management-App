-- Migration V4: Create Cart table
-- Created: 2025-01-26
-- Purpose: Add shopping cart functionality for users

CREATE TABLE IF NOT EXISTS cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_menu_item FOREIGN KEY (menu_item_id) 
        REFERENCES menu_item(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT chk_quantity CHECK (quantity > 0),
    CONSTRAINT chk_price CHECK (price >= 0),
    
    -- Unique constraint: One menu item per user in cart
    CONSTRAINT uk_cart_user_menuitem UNIQUE (user_id, menu_item_id)
);

-- Indexes for performance
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_menu_item_id ON cart(menu_item_id);
CREATE INDEX idx_cart_created_at ON cart(created_at DESC);

-- Shopping cart items for users
-- price: Price in INR captured at time of adding to cart
-- quantity: Number of items
-- created_at: When item was added to cart
-- updated_at: Last update timestamp
