-- Agent role tables and setup
-- Creates agent_profile and agent_order_assignment, and ensures AGENT role exists

-- 1) Ensure AGENT role exists
INSERT INTO role (name)
SELECT 'AGENT'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'AGENT');

-- 2) agent_profile table (matches com.hungerexpress.agent.AgentProfile)
CREATE TABLE IF NOT EXISTS agent_profile (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT FALSE,
  rating DOUBLE DEFAULT 0,
  total_earnings DOUBLE DEFAULT 0,
  pending_payout DOUBLE DEFAULT 0,
  last_status_change TIMESTAMP NULL,
  last_payout_date TIMESTAMP NULL,
  vehicle_type VARCHAR(50) NULL,
  vehicle_number VARCHAR(50) NULL,
  license_number VARCHAR(50) NULL,
  current_latitude DOUBLE NULL,
  current_longitude DOUBLE NULL,
  last_location_update TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_agent_profile_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_agent_profile_user ON agent_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_profile_available ON agent_profile(is_available);

-- 3) agent_order_assignment table (matches com.hungerexpress.agent.AgentOrderAssignment)
CREATE TABLE IF NOT EXISTS agent_order_assignment (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  agent_id BIGINT NOT NULL,
  order_id BIGINT NOT NULL,
  assigned_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  picked_up_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ASSIGNED',
  CONSTRAINT fk_aoa_agent FOREIGN KEY (agent_id) REFERENCES users(id),
  CONSTRAINT fk_aoa_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX IF NOT EXISTS idx_aoa_agent ON agent_order_assignment(agent_id);
CREATE INDEX IF NOT EXISTS idx_aoa_order ON agent_order_assignment(order_id);
CREATE INDEX IF NOT EXISTS idx_aoa_status ON agent_order_assignment(status);

-- 4) Orders linkage for agents (optional safety: add assigned_to + timestamps if missing)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS assigned_to BIGINT NULL AFTER restaurant_id;
ALTER TABLE orders ADD INDEX IF NOT EXISTS idx_assigned_to (assigned_to);

SET @fk_exists := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'orders'
    AND CONSTRAINT_NAME = 'fk_orders_assigned_to'
);
SET @sql := IF(@fk_exists = 0,
  'ALTER TABLE orders ADD CONSTRAINT fk_orders_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMP NULL AFTER created_at;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP NULL AFTER dispatched_at;
