-- Add approval workflow columns to menu_item table
ALTER TABLE menu_item ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'APPROVED';
ALTER TABLE menu_item ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP NULL;
ALTER TABLE menu_item ADD COLUMN IF NOT EXISTS submitted_by BIGINT NULL;
ALTER TABLE menu_item ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL;
ALTER TABLE menu_item ADD COLUMN IF NOT EXISTS approved_by BIGINT NULL;
ALTER TABLE menu_item ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(500) NULL;

-- Set default values for existing items
UPDATE menu_item 
SET approval_status = 'APPROVED', 
    submitted_at = NOW(), 
    approved_at = NOW()
WHERE approval_status IS NULL OR approval_status = '';
