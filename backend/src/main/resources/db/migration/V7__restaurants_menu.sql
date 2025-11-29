-- Menu categories and items
CREATE TABLE IF NOT EXISTS menu_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  position INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_menu_category_rest FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
);

CREATE TABLE IF NOT EXISTS menu_item (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT NOT NULL,
  category_id BIGINT,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(300),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  approval_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
  submitted_at TIMESTAMP NULL,
  submitted_by BIGINT NULL,
  approved_at TIMESTAMP NULL,
  approved_by BIGINT NULL,
  rejection_reason VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_item_rest FOREIGN KEY (restaurant_id) REFERENCES restaurant(id),
  CONSTRAINT fk_menu_item_cat FOREIGN KEY (category_id) REFERENCES menu_category(id)
);
