-- Create agent_transactions table to track delivery earnings history
CREATE TABLE IF NOT EXISTS agent_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL COMMENT 'Reference to user.id of the agent',
    order_id BIGINT NOT NULL COMMENT 'Reference to orders.id',
    order_number VARCHAR(50) COMMENT 'Human-readable order number',
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Delivery fee earned',
    bonus DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Bonus or incentive earned',
    total_earning DECIMAL(10, 2) NOT NULL COMMENT 'Total earning (delivery_fee + bonus)',
    transaction_type VARCHAR(20) DEFAULT 'DELIVERY' COMMENT 'DELIVERY, BONUS, ADJUSTMENT, PAYOUT',
    status VARCHAR(20) DEFAULT 'COMPLETED' COMMENT 'COMPLETED, PENDING, PAID_OUT',
    restaurant_name VARCHAR(200) COMMENT 'Restaurant name for reference',
    customer_name VARCHAR(200) COMMENT 'Customer name for reference',
    delivery_address VARCHAR(500) COMMENT 'Delivery address for reference',
    distance_km DECIMAL(5, 2) COMMENT 'Distance traveled in kilometers',
    delivered_at TIMESTAMP NOT NULL COMMENT 'When the order was delivered',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When the transaction was created',
    
    INDEX idx_agent_id (agent_id),
    INDEX idx_order_id (order_id),
    INDEX idx_delivered_at (delivered_at),
    INDEX idx_agent_delivered (agent_id, delivered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks individual delivery transactions for agent earnings';
