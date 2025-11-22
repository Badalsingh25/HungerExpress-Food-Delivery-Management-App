CREATE TABLE IF NOT EXISTS restaurant (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500),
  image_url VARCHAR(300),
  cuisine VARCHAR(32) NOT NULL,
  rating DOUBLE NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  city VARCHAR(120) NOT NULL
);

-- Seed sample data
INSERT INTO restaurant (name, description, image_url, cuisine, rating, delivery_fee, city) VALUES
 ('Pasta Palace', 'Authentic Italian pasta and more', 'https://picsum.photos/seed/pasta/600/400', 'ITALIAN', 4.6, 2.99, 'Rome'),
 ('Sushi Zen', 'Fresh sushi and sashimi', 'https://picsum.photos/seed/sushi/600/400', 'SUSHI', 4.8, 3.49, 'Tokyo'),
 ('Bombay Spice', 'Classic Indian curries and tandoor', 'https://picsum.photos/seed/indian/600/400', 'INDIAN', 4.5, 2.49, 'Mumbai');
