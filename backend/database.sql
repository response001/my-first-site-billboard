-- Billboard Technology - Database Schema
-- MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS onbillboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE onbillboard;

-- Users (customers, students)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'student', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(80) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  quantity INT DEFAULT 0,
  image VARCHAR(255),
  gallery TEXT,
  features TEXT,
  featured TINYINT(1) DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30),
  address TEXT,
  total DECIMAL(12, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(150) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  method VARCHAR(50),
  status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  reference VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Internship applications
CREATE TABLE IF NOT EXISTS internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  school VARCHAR(150),
  level ENUM('L3', 'L4', 'L5', 'Other') NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  cv_file VARCHAR(255),
  recommendation_file VARCHAR(255),
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  duration VARCHAR(80) DEFAULT '3 Months',
  description TEXT,
  topics TEXT,
  fee DECIMAL(12, 2) DEFAULT 0,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course registrations
CREATE TABLE IF NOT EXISTS course_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  course_id INT,
  course_name VARCHAR(120) NOT NULL,
  education_level VARCHAR(80),
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- Contact messages
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  subject VARCHAR(180),
  message TEXT NOT NULL,
  `read` TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT,
  category VARCHAR(80),
  image VARCHAR(255),
  author VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product / course reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  item_type ENUM('product', 'course') NOT NULL,
  item_id INT NOT NULL,
  rating TINYINT NOT NULL DEFAULT 5,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed categories
INSERT IGNORE INTO categories (name, slug) VALUES
  ('Computers', 'computers'),
  ('Laptops', 'laptops'),
  ('Smart Watches', 'smart-watches'),
  ('Smartphones', 'smartphones'),
  ('Tablets', 'tablets'),
  ('Printers', 'printers'),
  ('Networking Devices', 'networking-devices'),
  ('Accessories', 'accessories');

-- Seed a default admin (password: admin123 hashed with bcrypt)
INSERT IGNORE INTO admins (username, email, password) VALUES
  ('admin', 'admin@onbillboard.com', '$2a$10$jA4PgQStw9sS27WHqrimNefbaXGwPI0JSYzDXzvNWy3ATalgs77U2');

-- Seed courses
INSERT IGNORE INTO courses (name, slug, duration, fee, topics, description) VALUES
  ('Software Development', 'software-development', '3 Months', 120000, 'HTML, CSS, JavaScript, React, Node.js, Express, MySQL, Git, Final Project', 'Learn to build modern web applications from scratch with real projects.'),
  ('Networking', 'networking', '3 Months', 100000, 'Computer Hardware, Network Basics, IP Addressing, Subnetting, Cisco, Routing, Switching, Security', 'Master computer networking and prepare for Cisco certification.'),
  ('Graphic Design', 'graphic-design', '3 Months', 90000, 'Photoshop, Illustrator, Canva, CorelDraw, Branding, Logo Design, Social Media Design', 'Become a professional graphic designer and build a strong portfolio.');

-- Seed sample products
INSERT IGNORE INTO products (category_id, name, slug, description, price, quantity, image, featured) VALUES
  (1, 'Billboard Desktop PC', 'billboard-desktop-pc', 'High performance desktop computer for office and school.', 450000, 15, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60', 1),
  (2, 'Billboard Pro Laptop', 'billboard-pro-laptop', 'Lightweight laptop with 16GB RAM and 512GB SSD.', 780000, 10, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60', 1),
  (4, 'Billboard S1 Smartphone', 'billboard-s1-smartphone', 'Modern smartphone with dual camera and long battery life.', 320000, 30, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60', 1),
  (3, 'Billboard Watch Fit', 'billboard-watch-fit', 'Smart watch with heart rate, GPS and notifications.', 95000, 25, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60', 1),
  (6, 'Billboard Laser Printer', 'billboard-laser-printer', 'Fast and reliable laser printer for home and office.', 180000, 8, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60', 1),
  (7, 'Billboard Wi-Fi Router', 'billboard-wifi-router', 'Dual band wireless router for fast internet.', 55000, 40, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60', 1);

-- Seed more modern products
INSERT IGNORE INTO products (category_id, name, slug, description, price, quantity, image, featured) VALUES
  (4, 'iPhone 15 Pro', 'iphone-15-pro', 'Flagship smartphone with A17 Pro chip and titanium design.', 1250000, 20, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60', 1),
  (4, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Galaxy AI smartphone with stunning camera and all-day battery.', 1050000, 25, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=60', 1),
  (2, 'MacBook Air M3', 'macbook-air-m3', 'Ultra-thin laptop with Apple M3 chip, 16GB RAM and all-day battery.', 1500000, 12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60', 1),
  (2, 'Dell XPS 15', 'dell-xps-15', 'Premium 15-inch laptop with 4K display for creators.', 1850000, 8, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=60', 0),
  (5, 'iPad Air', 'ipad-air', 'Powerful tablet with liquid retina display and Apple Pencil support.', 620000, 15, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60', 0),
  (5, 'Samsung Galaxy Tab S9', 'samsung-galaxy-tab-s9', 'Large AMOLED tablet perfect for school and creativity.', 780000, 10, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60', 0),
  (3, 'Apple Watch Series 9', 'apple-watch-series-9', 'Advanced smartwatch with health tracking and always-on display.', 480000, 18, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60', 1),
  (3, 'Samsung Galaxy Watch 6', 'samsung-galaxy-watch-6', 'Feature-packed smartwatch with sleep and fitness tracking.', 350000, 22, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5-headphones', 'Industry-leading noise cancelling wireless headphones.', 350000, 14, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'RGB Gaming Keyboard', 'rgb-gaming-keyboard', 'Mechanical keyboard with RGB lighting and fast switches.', 65000, 30, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60', 0),
  (1, '27-inch 4K Monitor', '27-inch-4k-monitor', 'Crisp 4K UHD monitor for work and entertainment.', 380000, 16, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Gaming Mouse', 'gaming-mouse', 'Precision RGB gaming mouse with adjustable DPI.', 35000, 40, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=60', 0),
  (6, 'Canon Wireless Printer', 'canon-wireless-printer', 'Wireless all-in-one printer with scanning and copying.', 210000, 9, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60', 0),
  (7, 'TP-Link Mesh Wi-Fi Router', 'tp-link-mesh-wifi-router', 'Whole-home mesh Wi-Fi 6 system for fast coverage.', 95000, 28, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60', 0),
  (7, 'CCTV Security Camera', 'cctv-security-camera', 'HD smart security camera with night vision and motion alerts.', 120000, 20, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Wireless Earbuds', 'wireless-earbuds', 'Crystal clear wireless earbuds with noise cancellation.', 80000, 35, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60', 0),
  (8, '1TB External SSD', '1tb-external-ssd', 'Ultra-fast portable 1TB solid state drive.', 190000, 12, 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=800&q=60', 0),
  (8, '20000mAh Power Bank', '20000mah-power-bank', 'High capacity power bank with fast charging.', 45000, 50, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=60', 0);

-- Seed extended catalog (48 more products)
INSERT IGNORE INTO products (category_id, name, slug, description, price, quantity, image, featured) VALUES
  (1, 'Gaming Desktop RTX 4070', 'gaming-desktop-rtx-4070', 'High-end gaming PC with RTX 4070 GPU and RGB cooling.', 1600000, 8, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60', 1),
  (1, 'All-in-One Desktop 24', 'all-in-one-desktop-24', 'Sleek touch all-in-one desktop, perfect for home and office.', 850000, 10, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=60', 0),
  (1, 'Office Mini PC', 'office-mini-pc', 'Compact and quiet mini PC for daily office work.', 420000, 18, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60', 0),
  (1, '4K Video Editing Workstation', '4k-video-editing-workstation', 'Powerful workstation for 4K video editing and rendering.', 2200000, 4, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60', 0),
  (1, 'Dual Monitor Office Setup', 'dual-monitor-office-setup', 'Complete dual monitor setup for maximum productivity.', 950000, 7, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60', 0),
  (1, 'Compact Business Desktop', 'compact-business-desktop', 'Reliable desktop PC for small businesses and schools.', 390000, 14, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'ASUS ROG Strix Gaming Laptop', 'asus-rog-strix-gaming-laptop', 'Gaming laptop with RTX graphics and 240Hz display.', 1700000, 6, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60', 1),
  (2, 'HP Spectre x360 2-in-1', 'hp-spectre-x360-2-in-1', 'Convertible premium laptop with touch screen and pen.', 1400000, 9, 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'Lenovo ThinkPad X1 Carbon', 'lenovo-thinkpad-x1-carbon', 'Ultra-light business laptop with legendary keyboard.', 1650000, 8, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'Acer Swift 3 Thin Laptop', 'acer-swift-3-thin-laptop', 'Thin and light everyday laptop with long battery.', 750000, 15, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'Microsoft Surface Laptop 5', 'microsoft-surface-laptop-5', 'Elegant touchscreen laptop from Microsoft.', 1300000, 7, 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebcaf?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'Budget Chromebook', 'budget-chromebook', 'Fast, secure and affordable Chromebook for students.', 350000, 22, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'Student Ultrabook 14', 'student-ultrabook-14', 'Lightweight 14-inch ultrabook built for school.', 680000, 20, 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60', 0),
  (2, 'Creator Pro 16 Laptop', 'creator-pro-16-laptop', 'Laptop tuned for designers and video creators.', 1900000, 5, 'https://images.unsplash.com/photo-1622151834677-70f982c9caef?auto=format&fit=crop&w=800&q=60', 0),
  (3, 'Fitness Tracker Band', 'fitness-tracker-band', 'Slim fitness band with heart rate and step tracking.', 40000, 45, 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=60', 0),
  (3, 'Garmin Forerunner Watch', 'garmin-forerunner-watch', 'Advanced running watch with GPS and training insights.', 480000, 12, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=60', 0),
  (3, 'Kids Smartwatch', 'kids-smartwatch', 'Safe smartwatch for kids with GPS and calls.', 65000, 30, 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=60', 0),
  (3, 'Classic Smartwatch Pro', 'classic-smartwatch-pro', 'Premium smartwatch with elegant classic design.', 250000, 18, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=60', 0),
  (4, 'Google Pixel 8', 'google-pixel-8', 'Pixel smartphone with incredible AI camera.', 900000, 15, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=60', 1),
  (4, 'Xiaomi Redmi Note 13', 'xiaomi-redmi-note-13', 'Excellent value smartphone with 108MP camera.', 380000, 28, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=60', 0),
  (4, 'OnePlus 12 Pro', 'oneplus-12-pro', 'Fast and smooth flagship smartphone.', 1100000, 12, 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=800&q=60', 0),
  (4, 'Samsung Galaxy Z Fold 5', 'samsung-galaxy-z-fold-5', 'Foldable smartphone with large inner display.', 1800000, 6, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=60', 0),
  (4, 'Budget Smartphone 6.5', 'budget-smartphone-6-5', 'Reliable entry-level smartphone with big screen.', 180000, 40, 'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?auto=format&fit=crop&w=800&q=60', 0),
  (4, 'Rugged Outdoor Phone', 'rugged-outdoor-phone', 'Waterproof and shockproof phone for tough jobs.', 290000, 15, 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=800&q=60', 0),
  (5, 'Kindle E-Reader', 'kindle-e-reader', 'Paper-like e-reader for books on the go.', 130000, 20, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=60', 0),
  (5, 'Galaxy Tab A 10.4', 'galaxy-tab-a-10-4', 'Great all-round tablet for home, school and fun.', 420000, 16, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60', 0),
  (5, 'Drawing Tablet Wacom', 'drawing-tablet-wacom', 'Pressure-sensitive tablet for digital artists.', 280000, 9, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=60', 0),
  (5, 'Lenovo Tab M11', 'lenovo-tab-m11', 'Affordable 11-inch tablet with kids mode.', 360000, 14, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=60', 0),
  (6, 'HP Deskjet 2700 Printer', 'hp-deskjet-2700-printer', 'Affordable wireless inkjet printer for home use.', 150000, 12, 'https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60', 0),
  (7, '8-Port Gigabit Network Switch', '8-port-gigabit-network-switch', 'Metal network switch for fast wired connections.', 60000, 20, 'https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60', 0),
  (7, 'CAT6 Network Cable 10m', 'cat6-network-cable-10m', 'High-speed network cable for reliable connection.', 12000, 60, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=60', 0),
  (7, 'Network Rack Cabinet 9U', 'network-rack-cabinet-9u', 'Wall-mount rack for routers, switches and servers.', 250000, 6, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60', 0),
  (7, 'Wi-Fi Repeater 1200Mbps', 'wifi-repeater-1200mbps', 'Extends your Wi-Fi coverage to every room.', 35000, 25, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Bluetooth Speaker JBL', 'bluetooth-speaker-jbl', 'Powerful portable Bluetooth speaker with deep bass.', 120000, 25, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=60', 1),
  (8, 'USB-C Multiport Hub', 'usb-c-multiport-hub', '7-in-1 USB-C hub with HDMI, USB and card reader.', 85000, 22, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Laptop Backpack 15.6', 'laptop-backpack-15-6', 'Water-resistant backpack with padded laptop sleeve.', 55000, 35, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=60', 0),
  (8, '1080p USB Webcam', '1080p-usb-webcam', 'Full HD webcam for meetings and streaming.', 60000, 30, 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'USB Condenser Microphone', 'usb-condenser-microphone', 'Crystal clear USB mic for recording and streaming.', 95000, 15, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Aluminum Laptop Stand', 'aluminum-laptop-stand', 'Ergonomic folding laptop stand for better posture.', 45000, 40, 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Wireless Fast Charger', 'wireless-fast-charger', '15W fast wireless charging pad for phones and buds.', 40000, 45, 'https://images.unsplash.com/photo-1583863790271-d3a3491fe11f?auto=format&fit=crop&w=800&q=60', 0),
  (8, '1TB External Hard Drive', '1tb-external-hard-drive', 'Portable 1TB hard drive for backups and files.', 120000, 18, 'https://images.unsplash.com/photo-1531493185146-021cefdee39b?auto=format&fit=crop&w=800&q=60', 0),
  (8, '128GB MicroSD Card', '128gb-microsd-card', 'High speed memory card for phones and cameras.', 30000, 50, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Smart Home Speaker', 'smart-home-speaker', 'Voice assistant speaker for music and smart home.', 150000, 20, 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'RGB Gaming Mouse Pad', 'rgb-gaming-mouse-pad', 'Large RGB illuminated mouse pad for gamers.', 25000, 38, 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Gaming Controller', 'gaming-controller', 'Wireless controller for PC and consoles.', 95000, 26, 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'VR Headset', 'vr-headset', 'Immersive virtual reality headset for gaming and apps.', 550000, 10, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Gaming Headset', 'gaming-headset', 'Surround sound headset with noise cancelling mic.', 85000, 24, 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=60', 0),
  (8, 'Wireless Optical Mouse', 'wireless-optical-mouse', 'Slim wireless mouse for everyday work.', 20000, 50, 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=60', 0);

-- Seed a blog post
INSERT IGNORE INTO blog (title, slug, excerpt, content, category, author) VALUES
  ('Welcome to Billboard Technology', 'welcome-to-billboard-technology', 'Discover your one-stop shop for the latest devices, professional short courses and real internship opportunities in Rwanda.', 'Welcome to Billboard Technology, your trusted partner for technology in Rwanda. Whether you want to buy a reliable device, learn a new skill or start your career in tech, we are here to support you every step of the way.

WHAT WE DO
We sell quality technology products - computers, laptops, smartphones, tablets, printers, smart watches, networking equipment and accessories - all with honest prices and a warranty. Every product is carefully chosen so you get the best value for your money.

WE TRAIN
Not everyone can afford a university degree, and that is why we offer practical 3-month short courses:
- Software Development: learn HTML, CSS, JavaScript, React, Node.js, Express and MySQL by building real projects.
- Networking: master hardware, IP addressing, routing, switching and security, and prepare for Cisco certification.
- Graphic Design: become a professional designer with Photoshop, Illustrator, Canva and CorelDRAW.

WE HIRE
For software development students in L3, L4 and L5, we run an internship program where you work on real projects with a mentor, build a portfolio and gain the confidence employers look for.

WHY CHOOSE US?
- Genuine products with warranty and after-sales support
- Practical, project-based training
- A real path from learning to employment
- Friendly support in Kinyarwanda, English and French

Ready to get started? Browse our shop, visit our courses page or contact us today. The future of technology in Rwanda starts with you.', 'Latest Technology News', 'Billboard Tech Team');

-- Product gallery + features seed (photos per product + specifications)

UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5-13400","GPU: Intel Integrated UHD","RAM: 8GB DDR4","Storage: 256GB SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-desktop-pc';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7","RAM: 16GB","Storage: 512GB SSD","Screen: 14-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-pro-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.7-inch LTPO 120Hz","Camera: 50MP + 48MP + 48MP","Battery: 5000mAh","Charging: 45W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-s1-smartphone';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 2.0-inch AMOLED","Battery Life: 5 days","Water Resistance: IP67","Connectivity: GPS + LTE","Health Tracking: Heart rate, SpO2, ECG & GPS","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-watch-fit';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60"]', features = '["Technology: Laser","Print Speed: Up to 25 ppm","Connectivity: USB + Wi-Fi","Paper Size: A4 & Letter","Duty Cycle: Up to 8,000 pages/month","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-laser-printer';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Dual Band Wi-Fi Router","Speed: Up to 1200 Mbps","Ports: 4 x Gigabit LAN","Security: WPA3 Encryption","Coverage: Up to 2,000 sq ft","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-wifi-router';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.1-inch Super Retina XDR","Chip: A17 Pro","Camera: 48MP main + 12MP tele + 12MP ultra","Battery: Up to 23 hours video playback","Operating System: iOS 17","Warranty: 1 Year Warranty"]' WHERE slug = 'iphone-15-pro';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.2-inch Dynamic AMOLED 120Hz","Camera: 50MP main + 12MP ultra","Battery: 4000mAh","Chip: Snapdragon 8 Gen 3","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-s24';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60"]', features = '["Chip: Apple M3","RAM: 8GB Unified Memory","Storage: 256GB SSD","Screen: 13.6-inch Liquid Retina","Battery: Up to 18 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'macbook-air-m3';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-13700H","GPU: NVIDIA GeForce RTX 4050","RAM: 16GB DDR5","Storage: 512GB SSD","Screen: 15.6-inch FHD+","Warranty: 1 Year Warranty"]' WHERE slug = 'dell-xps-15';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 10.9-inch Liquid Retina","Chip: Apple M1","Storage: 128GB","RAM: 8GB","Connectivity: Wi-Fi + 5G","Warranty: 1 Year Warranty"]' WHERE slug = 'ipad-air';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 11-inch Dynamic AMOLED 120Hz","Chip: Snapdragon 8 Gen 2","Storage: 128GB","RAM: 8GB","Connectivity: Wi-Fi + 5G","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-tab-s9';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.9-inch Retina LTPO OLED","Battery: Up to 18 hours","Water Resistance: IP6X + 5ATM","Connectivity: Bluetooth 5.3 + Wi-Fi","Operating System: watchOS 10","Warranty: 1 Year Warranty"]' WHERE slug = 'apple-watch-series-9';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.5-inch Super AMOLED","Battery: Up to 40 hours","Water Resistance: IP68 + 5ATM","Connectivity: Bluetooth 5.3 + Wi-Fi","Operating System: Wear OS 4","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-watch-6';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Over-ear Wireless Headphones","Noise Cancelling: Industry-leading ANC","Battery: Up to 30 hours","Connectivity: Bluetooth 5.2 + USB-C","Features: Multipoint pairing","Warranty: 1 Year Warranty"]' WHERE slug = 'sony-wh-1000xm5-headphones';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Mechanical Keyboard","Switches: Blue mechanical switches","Backlight: RGB per-key","Connectivity: Wired USB","Features: Anti-ghosting","Warranty: 1 Year Warranty"]' WHERE slug = 'rgb-gaming-keyboard';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 27-inch 4K UHD IPS","Refresh Rate: 60Hz","Connectivity: HDMI + DisplayPort + USB-C","Color Accuracy: 99% sRGB","Features: Height-adjustable stand","Warranty: 1 Year Warranty"]' WHERE slug = '27-inch-4k-monitor';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["DPI: Up to 16000","Buttons: 7 programmable","Backlight: RGB","Connectivity: Wired USB","Design: Ergonomic grip","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-mouse';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60"]', features = '["Technology: Inkjet All-in-One","Print Speed: Up to 22 ppm","Connectivity: USB + Wi-Fi + AirPrint","Paper Size: A4, Legal & Letter","Duty Cycle: Up to 5,000 pages/month","Warranty: 1 Year Warranty"]' WHERE slug = 'canon-wireless-printer';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Mesh Wi-Fi 6 System","Speed: AX3000 (3000 Mbps)","Ports: 4 x Gigabit LAN per node","Security: WPA3 + Parental Controls","Coverage: Up to 4,500 sq ft","Warranty: 1 Year Warranty"]' WHERE slug = 'tp-link-mesh-wifi-router';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60"]', features = '["Type: HD Security Camera","Video: 1080p Full HD","Connectivity: Wi-Fi + PoE","Features: Night Vision + Motion Alerts","Storage: SD card + Cloud","Warranty: 1 Year Warranty"]' WHERE slug = 'cctv-security-camera';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Noise Cancelling: Active ANC","Battery: Up to 32 hours with case","Charging: USB-C + Wireless","Water Resistance: IPX5","Warranty: 1 Year Warranty"]' WHERE slug = 'wireless-earbuds';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Capacity: 1TB NVMe SSD","Interface: USB 3.2 Gen 2","Read Speed: Up to 1050 MB/s","Portability: Pocket-sized","Compatibility: Windows, Mac & Android","Warranty: 1 Year Warranty"]' WHERE slug = '1tb-external-ssd';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Capacity: 20000mAh","Output: 22.5W USB-C PD + QC","Ports: 2 x USB-A + 1 x USB-C","Display: LED battery indicator","Safety: Overcharge protection","Warranty: 1 Year Warranty"]' WHERE slug = '20000mah-power-bank';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-13700K","GPU: NVIDIA RTX 4070 12GB","RAM: 32GB DDR5","Storage: 1TB NVMe SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-desktop-rtx-4070';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 24-inch FHD Touchscreen","CPU: Intel Core i5","RAM: 8GB DDR4","Storage: 512GB SSD","Operating System: Windows 11 Home","Warranty: 1 Year Warranty"]' WHERE slug = 'all-in-one-desktop-24';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB DDR4","Storage: 256GB SSD","Connectivity: Wi-Fi 6 + Bluetooth","Video Output: 4K HDMI + DisplayPort","Warranty: 1 Year Warranty"]' WHERE slug = 'office-mini-pc';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i9-13900K","GPU: NVIDIA RTX 4080 16GB","RAM: 64GB DDR5","Storage: 2TB NVMe SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = '4k-video-editing-workstation';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["Monitors: 2 x 24-inch FHD","Resolution: 1920 x 1080","Connectivity: HDMI + VGA","Stand: Dual monitor arm included","Features: Anti-glare display","Warranty: 1 Year Warranty"]' WHERE slug = 'dual-monitor-office-setup';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB DDR4","Storage: 512GB SSD","Operating System: Windows 11 Pro","Connectivity: Wi-Fi + Gigabit LAN","Warranty: 1 Year Warranty"]' WHERE slug = 'compact-business-desktop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: AMD Ryzen 9 7945HX","GPU: NVIDIA RTX 4070 8GB","RAM: 16GB DDR5","Storage: 1TB NVMe SSD","Screen: 16-inch 2.5K 240Hz","Warranty: 1 Year Warranty"]' WHERE slug = 'asus-rog-strix-gaming-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-1355U","RAM: 16GB LPDDR5","Storage: 1TB SSD","Screen: 13.5-inch 3K OLED Touch","Battery: Up to 13 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'hp-spectre-x360-2-in-1';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB","Storage: 256GB SSD","Screen: 13.3-inch FHD","Battery: Up to 8 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'lenovo-thinkpad-x1-carbon';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7","RAM: 16GB","Storage: 512GB SSD","Screen: 14-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'acer-swift-3-thin-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593642532842-98d0fd5ebcaf?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-1255U","RAM: 16GB","Storage: 512GB SSD","Screen: 13.5-inch PixelSense Touch","Battery: Up to 18 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'microsoft-surface-laptop-5';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Celeron N4500","RAM: 4GB","Storage: 64GB eMMC","Screen: 14-inch HD","Operating System: ChromeOS","Warranty: 1 Year Warranty"]' WHERE slug = 'budget-chromebook';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB","Storage: 256GB SSD","Screen: 13.3-inch FHD","Battery: Up to 8 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'student-ultrabook-14';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1622151834677-70f982c9caef?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-13700H","GPU: NVIDIA RTX 4070 8GB","RAM: 32GB DDR5","Storage: 1TB NVMe SSD","Screen: 16-inch 4K OLED","Warranty: 1 Year Warranty"]' WHERE slug = 'creator-pro-16-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.9-inch AMOLED","Battery Life: 14 days","Water Resistance: 3ATM","Connectivity: GPS + Bluetooth","Health Tracking: Full health suite","Warranty: 1 Year Warranty"]' WHERE slug = 'fitness-tracker-band';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.3-inch MIP","Battery: Up to 21 days","Water Resistance: 5ATM","Connectivity: GPS + Bluetooth","Health Tracking: Heart rate, SpO2 & GPS","Warranty: 1 Year Warranty"]' WHERE slug = 'garmin-forerunner-watch';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.4-inch touchscreen","Battery: Up to 7 days","Water Resistance: IP67","Connectivity: GPS + SIM card","Safety: Parental controls & SOS call","Warranty: 1 Year Warranty"]' WHERE slug = 'kids-smartwatch';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.7-inch AMOLED","Battery Life: 10 days","Water Resistance: IP68","Connectivity: Bluetooth 5.3 + Wi-Fi","Health Tracking: Heart rate, SpO2 & ECG","Warranty: 1 Year Warranty"]' WHERE slug = 'classic-smartwatch-pro';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.2-inch OLED 120Hz","Camera: 50MP main + 12MP ultra","Battery: 4575mAh","Chip: Google Tensor G3","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'google-pixel-8';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.67-inch AMOLED 120Hz","Camera: 108MP main","Battery: 5000mAh","Chip: Snapdragon 685","Operating System: Android 13","Warranty: 1 Year Warranty"]' WHERE slug = 'xiaomi-redmi-note-13';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.82-inch 2K OLED 120Hz","Camera: 50MP triple (main + ultra + tele)","Battery: 5400mAh","Charging: 100W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'oneplus-12-pro';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 7.6-inch inner + 6.2-inch cover","Camera: 50MP triple","Battery: 4400mAh","Chip: Snapdragon 8 Gen 2","Operating System: Android 13","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-z-fold-5';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1607936854279-55e8a4c64888?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.5-inch HD+ LCD","Camera: 13MP main","Battery: 4000mAh","RAM: 3GB + 32GB Storage","Operating System: Android 13","Warranty: 1 Year Warranty"]' WHERE slug = 'budget-smartphone-6-5';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.5-inch FHD+","Camera: 48MP main","Battery: 5000mAh","Protection: IP68 Waterproof + Dustproof","Connectivity: 4G LTE + NFC","Warranty: 1 Year Warranty"]' WHERE slug = 'rugged-outdoor-phone';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6-inch E-Ink 300ppi","Storage: 16GB","Battery: Up to 6 weeks","Connectivity: Wi-Fi","Lighting: Adjustable front light","Warranty: 1 Year Warranty"]' WHERE slug = 'kindle-e-reader';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 10.4-inch WXGA+ LCD","Storage: 64GB","RAM: 4GB","Battery: 5100mAh","Connectivity: Wi-Fi + LTE","Warranty: 1 Year Warranty"]' WHERE slug = 'galaxy-tab-a-10-4';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60"]', features = '["Active Area: 10 x 6.25 inches","Pressure Levels: 8192","Connectivity: USB","Compatibility: Windows, Mac & Android","Included: Battery-free pen","Warranty: 1 Year Warranty"]' WHERE slug = 'drawing-tablet-wacom';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 11-inch IPS 90Hz","Storage: 128GB","RAM: 4GB","Battery: 7040mAh","Features: Kids mode included","Warranty: 1 Year Warranty"]' WHERE slug = 'lenovo-tab-m11';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60"]', features = '["Technology: Inkjet","Print Speed: Up to 8 ppm","Connectivity: USB","Paper Size: A4 & Letter","Duty Cycle: Up to 1,000 pages/month","Warranty: 1 Year Warranty"]' WHERE slug = 'hp-deskjet-2700-printer';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Gigabit Network Switch","Speed: Up to 1 Gbps","Ports: 8 x Gigabit LAN","Security: WPA2 + VLAN Support","Coverage: Whole building","Warranty: 1 Year Warranty"]' WHERE slug = '8-port-gigabit-network-switch';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60"]', features = '["Type: CAT6 Ethernet Cable","Length: 10 meters","Speed: Up to 1 Gbps","Connectors: Gold-plated RJ45","Shielding: UTP","Warranty: 1 Year Warranty"]' WHERE slug = 'cat6-network-cable-10m';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Wall-Mount Network Rack","Capacity: 9U","Material: Steel","Features: Ventilated panels","Mounting: Wall + floor","Warranty: 1 Year Warranty"]' WHERE slug = 'network-rack-cabinet-9u';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Wi-Fi Range Extender","Speed: Up to 1200 Mbps","Antennas: 2 x External","Modes: Repeater + AP","Security: WPA/WPA2","Warranty: 1 Year Warranty"]' WHERE slug = 'wifi-repeater-1200mbps';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Battery: Up to 20 hours","Water Resistance: IPX7","Power: 20W output","Charging: USB-C","Warranty: 1 Year Warranty"]' WHERE slug = 'bluetooth-speaker-jbl';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Ports: 7-in-1 hub","Video: HDMI 4K@30Hz","Data: 3 x USB 3.0","Card Reader: SD + microSD","Charging: USB-C PD 100W","Warranty: 1 Year Warranty"]' WHERE slug = 'usb-c-multiport-hub';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Size: Fits laptops up to 15.6-inch","Material: Water-resistant nylon","Features: USB charging port","Compartments: Laptop + accessories","Padding: Shock-proof sleeve","Warranty: 1 Year Warranty"]' WHERE slug = 'laptop-backpack-15-6';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB wired","Compatibility: Works with Windows, Mac & Linux","Design: Ergonomic & lightweight","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = '1080p-usb-webcam';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Type: USB Condenser Mic","Polar Pattern: Cardioid","Sampling: Up to 192kHz/24-bit","Features: Pop filter included","Compatibility: PC & Mac plug-and-play","Warranty: 1 Year Warranty"]' WHERE slug = 'usb-condenser-microphone';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Material: Aluminum alloy","Design: Foldable & adjustable","Compatibility: 10 to 17-inch laptops","Features: Ergonomic height","Portability: Lightweight","Warranty: 1 Year Warranty"]' WHERE slug = 'aluminum-laptop-stand';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1583863790271-d3a3491fe11f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Output: 15W Fast Charging","Standard: Qi Wireless","Input: USB-C","Features: LED indicator","Compatibility: iPhone & Android","Warranty: 1 Year Warranty"]' WHERE slug = 'wireless-fast-charger';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1531493185146-021cefdee39b?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Capacity: 1TB HDD","Interface: USB 3.0","Speed: Up to 120 MB/s","Portability: Slim & portable","Compatibility: Windows, Mac & PS4/5","Warranty: 1 Year Warranty"]' WHERE slug = '1tb-external-hard-drive';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Capacity: 128GB","Class: UHS-I U1 A1","Read Speed: Up to 100 MB/s","Compatibility: Phones, cameras & drones","Durability: Waterproof & shockproof","Warranty: 1 Year Warranty"]' WHERE slug = '128gb-microsd-card';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Voice Assistant Speaker","Connectivity: Wi-Fi + Bluetooth","Sound: 360-degree audio","Voice Control: Works with Google Assistant","Features: Music streaming apps","Warranty: 1 Year Warranty"]' WHERE slug = 'smart-home-speaker';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Size: 800 x 300mm","Backlight: RGB edge lighting","Surface: Smooth cloth","Base: Anti-slip rubber","Features: Water-resistant","Warranty: 1 Year Warranty"]' WHERE slug = 'rgb-gaming-mouse-pad';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth + USB-C","Compatibility: PC, console & mobile","Features: Dual vibration motors","Battery: Up to 20 hours","Buttons: Customizable","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-controller';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Standalone VR Headset","Display: 4K LCD 90Hz","Controllers: 2 motion controllers included","Connectivity: Wi-Fi 6 + Bluetooth","Storage: 64GB","Warranty: 1 Year Warranty"]' WHERE slug = 'vr-headset';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Sound: 7.1 Surround Sound","Mic: Noise-cancelling","Backlight: RGB","Connectivity: USB","Compatibility: PC & consoles","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-headset';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: 2.4GHz Wireless","DPI: 1600","Buttons: 4 silent buttons","Battery: 1 x AA (up to 12 months)","Design: Slim & portable","Warranty: 1 Year Warranty"]' WHERE slug = 'wireless-optical-mouse';

-- New matching products per category
INSERT IGNORE INTO products (category_id, name, slug, description, price, quantity, image, features, featured) VALUES
  (1, 'Billboard Home Office PC', 'billboard-home-office-pc', 'Reliable desktop computer for home and small office work.', 350000, 20, 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=60', '["CPU: Intel Core i3-12100","RAM: 8GB DDR4","Storage: 256GB SSD","Operating System: Windows 11 Home","Connectivity: Wi-Fi + Gigabit LAN","Warranty: 1 Year Warranty"]', 0),
  (1, 'Gaming PC RTX 4060', 'gaming-pc-rtx-4060', 'Mid-range gaming desktop with RTX 4060 for smooth 1080p gaming.', 1150000, 8, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60', '["CPU: Intel Core i5-13400F","GPU: NVIDIA RTX 4060 8GB","RAM: 16GB DDR5","Storage: 512GB NVMe SSD","Operating System: Windows 11 Home","Warranty: 1 Year Warranty"]', 0),
  (1, 'Billboard Workstation Xeon', 'billboard-workstation-xeon', 'High-performance workstation for engineering and rendering.', 1850000, 5, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60', '["CPU: Intel Xeon E-2288G","GPU: NVIDIA RTX A4000 16GB","RAM: 64GB ECC","Storage: 1TB NVMe SSD","Operating System: Windows 11 Pro","Warranty: 2 Years Warranty"]', 0),
  (1, '27-inch Touch All-in-One', '27-inch-touch-all-in-one', 'Large touchscreen all-in-one desktop for home and office.', 980000, 6, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=60', '["Display: 27-inch FHD Touchscreen","CPU: Intel Core i5","RAM: 16GB DDR4","Storage: 512GB SSD","Operating System: Windows 11 Home","Warranty: 1 Year Warranty"]', 0),
  (2, 'HP Pavilion 15', 'hp-pavilion-15', 'Versatile 15-inch laptop for work, study and entertainment.', 950000, 12, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=60', '["CPU: Intel Core i5","RAM: 8GB","Storage: 512GB SSD","Screen: 15.6-inch FHD","Battery: Up to 9 hours","Warranty: 1 Year Warranty"]', 0),
  (2, 'Lenovo IdeaPad Slim 3', 'lenovo-ideapad-slim-3', 'Affordable everyday laptop with a slim design.', 550000, 18, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60', '["CPU: AMD Ryzen 5","RAM: 8GB","Storage: 512GB SSD","Screen: 15.6-inch FHD","Battery: Up to 8 hours","Warranty: 1 Year Warranty"]', 0),
  (2, 'Dell Inspiron 15', 'dell-inspiron-15', 'Reliable 15-inch laptop for students and professionals.', 820000, 10, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=60', '["CPU: Intel Core i5","RAM: 8GB","Storage: 512GB SSD","Screen: 15.6-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]', 0),
  (3, 'Apple Watch SE', 'apple-watch-se', 'Affordable Apple smartwatch with all the essentials.', 320000, 20, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60', '["Display: Retina OLED","Battery: Up to 18 hours","Water Resistance: 5ATM","Chip: Apple S8","Operating System: watchOS","Warranty: 1 Year Warranty"]', 0),
  (3, 'Huawei Watch GT 4', 'huawei-watch-gt-4', 'Premium smartwatch with long battery life and sports tracking.', 380000, 15, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60', '["Display: 1.32-inch AMOLED","Battery: Up to 14 days","Water Resistance: 5ATM","Connectivity: Bluetooth 5.2 + GPS","Health Tracking: Heart rate, SpO2 & sleep","Warranty: 1 Year Warranty"]', 0),
  (3, 'Amazfit GTS 4 Mini', 'amazfit-gts-4-mini', 'Lightweight fitness smartwatch with great value.', 150000, 25, 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=60', '["Display: 1.65-inch AMOLED","Battery: Up to 15 days","Water Resistance: 5ATM","Connectivity: Bluetooth 5.2 + GPS","Health Tracking: 120+ sports modes","Warranty: 1 Year Warranty"]', 0),
  (4, 'iPhone 15', 'iphone-15', 'Latest iPhone with Dynamic Island and A16 Bionic chip.', 850000, 18, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60', '["Display: 6.1-inch Super Retina XDR","Chip: A16 Bionic","Camera: 48MP main","Battery: Up to 20 hours video playback","Operating System: iOS 17","Warranty: 1 Year Warranty"]', 0),
  (4, 'Infinix Hot 40', 'infinix-hot-40', 'Budget smartphone with big display and long battery life.', 150000, 30, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=60', '["Display: 6.78-inch FHD+","Camera: 50MP main","Battery: 5000mAh","RAM: 8GB + 128GB Storage","Operating System: Android 13","Warranty: 1 Year Warranty"]', 0),
  (4, 'Tecno Camon 20', 'tecno-camon-20', 'Mid-range smartphone with an impressive camera.', 220000, 25, 'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?auto=format&fit=crop&w=800&q=60', '["Display: 6.67-inch AMOLED","Camera: 64MP main","Battery: 5000mAh","RAM: 8GB + 256GB Storage","Operating System: Android 13","Warranty: 1 Year Warranty"]', 0),
  (5, 'iPad 10th Generation', 'ipad-10th-generation', 'All-purpose iPad with 10.9-inch Liquid Retina display.', 550000, 15, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60', '["Display: 10.9-inch Liquid Retina","Chip: A14 Bionic","Storage: 64GB","Camera: 12MP","Connectivity: Wi-Fi + 5G","Warranty: 1 Year Warranty"]', 0),
  (5, 'Samsung Galaxy Tab A9', 'samsung-galaxy-tab-a9', 'Affordable tablet for streaming and light productivity.', 300000, 20, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60', '["Display: 8.7-inch LCD","Storage: 64GB","RAM: 4GB","Battery: 5100mAh","Connectivity: Wi-Fi + LTE","Warranty: 1 Year Warranty"]', 0),
  (5, 'Lenovo Tab P11', 'lenovo-tab-p11', 'Entertainment tablet with 2K display and quad speakers.', 420000, 12, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=60', '["Display: 11-inch 2K IPS","Storage: 128GB","RAM: 6GB","Battery: 7700mAh","Speakers: Quad JBL","Warranty: 1 Year Warranty"]', 0),
  (6, 'HP LaserJet Pro M404', 'hp-laserjet-pro-m404', 'Fast monochrome laser printer for small offices.', 350000, 10, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60', '["Technology: Laser","Print Speed: Up to 38 ppm","Connectivity: USB + Network","Paper Size: A4 & Letter","Duty Cycle: Up to 80,000 pages/month","Warranty: 1 Year Warranty"]', 0),
  (6, 'Epson EcoTank L3250', 'epson-ecotank-l3250', 'Refillable ink tank printer with ultra-low running costs.', 320000, 8, 'https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60', '["Technology: Ink Tank","Print Speed: Up to 10 ppm","Connectivity: USB + Wi-Fi","Paper Size: A4 & Legal","Features: Refillable ink system","Warranty: 1 Year Warranty"]', 0),
  (6, 'Canon PIXMA G2010', 'canon-pixma-g2010', 'Budget mega-tank printer for home and school.', 260000, 12, 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60', '["Technology: Ink Tank","Print Speed: Up to 8.8 ppm","Connectivity: USB","Paper Size: A4","Duty Cycle: Up to 1,800 pages/month","Warranty: 1 Year Warranty"]', 0),
  (6, 'Xerox Phaser 3020', 'xerox-phaser-3020', 'Compact personal laser printer.', 280000, 9, 'https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60', '["Technology: Laser","Print Speed: Up to 20 ppm","Connectivity: USB + Wi-Fi","Paper Size: A4 & Letter","Features: Mobile printing","Warranty: 1 Year Warranty"]', 0),
  (7, 'TP-Link Archer AX55', 'tp-link-archer-ax55', 'Wi-Fi 6 dual-band router for faster, stable connections.', 180000, 15, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60', '["Type: Wi-Fi 6 Router","Speed: AX3000 (3000 Mbps)","Ports: 4 x Gigabit LAN","Security: WPA3","Coverage: Up to 2,500 sq ft","Warranty: 1 Year Warranty"]', 0),
  (7, 'Ubiquiti UniFi Access Point', 'ubiquiti-unifi-access-point', 'Professional Wi-Fi access point for offices and hotels.', 320000, 10, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60', '["Type: Enterprise Access Point","Speed: AC1200","PoE: Power over Ethernet","Management: UniFi controller","Coverage: Up to 5,000 sq ft","Warranty: 1 Year Warranty"]', 0),
  (7, '24-Port PoE Network Switch', '24-port-poe-network-switch', 'Managed switch with Power over Ethernet for cameras and access points.', 380000, 5, 'https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60', '["Ports: 24 x Gigabit PoE + 4 SFP","PoE Budget: 370W","Management: Web-managed","Speed: Up to 1 Gbps","Features: Rack-mountable","Warranty: 1 Year Warranty"]', 0),
  (7, 'Fiber Media Converter Kit', 'fiber-media-converter-kit', 'Convert copper Ethernet to fiber for long-distance links.', 45000, 20, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=60', '["Type: Single-mode Media Converter","Speed: 1000 Mbps","Ports: 1 x RJ45 + 1 x SC fiber","Distance: Up to 20 km","Kit: 2 converters + SFP","Warranty: 1 Year Warranty"]', 0),
  (8, 'USB-C Fast Charging Cable', 'usb-c-fast-charging-cable', 'Durable fast-charging USB-C cable with braided finish.', 15000, 60, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=60', '["Length: 1.5 meters","Speed: 60W fast charging","Data: USB 2.0","Design: Braided nylon","Compatibility: USB-C devices","Warranty: 1 Year Warranty"]', 0),
  (8, 'Laptop Sleeve 14', 'laptop-sleeve-14', 'Protective sleeve for 14-inch laptops.', 25000, 40, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=60', '["Compatibility: 14-inch laptops","Material: Neoprene + fleece lining","Closure: Zipper","Design: Slim & padded","Colors: Multiple options","Warranty: 1 Year Warranty"]', 0),
  (8, '4K HDMI Cable 2m', '4k-hdmi-cable-2m', 'High-speed HDMI cable for 4K displays and consoles.', 15000, 50, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=60', '["Version: HDMI 2.0","Resolution: 4K@60Hz","Length: 2 meters","Bandwidth: 18 Gbps","Compatibility: TV, monitor, console","Warranty: 1 Year Warranty"]', 0),
  (8, 'Dual Monitor Arm Stand', 'dual-monitor-arm-stand', 'Desk-mounted arm for two monitors up to 27 inches.', 120000, 12, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60', '["Monitors: Supports 2 x 17-27 inch","VESA: 75x75 / 100x100","Mounting: Clamp + grommet","Adjustment: Height, tilt & rotate","Capacity: Up to 8kg per arm","Warranty: 1 Year Warranty"]', 0);

-- Blog posts for each category
INSERT IGNORE INTO blog (title, slug, excerpt, content, category, image, author) VALUES
  ('Rwanda''s Tech Sector Is Growing Fast in 2026', 'rwandas-tech-sector-is-growing-fast-in-2026', 'From digital payments to artificial intelligence, Rwanda keeps proving that innovation has no borders. Here is what is happening in 2026.', 'Rwanda has earned a reputation as one of Africa''s most tech-friendly countries, and 2026 is shaping up to be another milestone year. From Kigali''s buzzing innovation hubs to new fibre connections reaching more districts, the digital revolution is touching every corner of the country.

THE RISE OF DIGITAL PAYMENTS
Mobile money is already part of everyday life in Rwanda, and the next step is seamless online payments. More businesses - from small shops to large companies - now accept cashless payments on their websites and in stores. This makes it easier for Rwandan entrepreneurs to sell to customers in Kigali, in the diaspora and across the world. Technologies like Paypack and other local payment solutions are removing the barriers that once held back online commerce.

ARTIFICIAL INTELLIGENCE IS HERE TO STAY
Artificial intelligence is moving from headlines to real life. Clinics use AI to read scans faster, farmers use smart tools to predict weather, and schools use AI tutors to help students learn at their own pace. For small businesses, AI tools can handle customer questions, write marketing content and manage inventory - saving time and money.

THE SKILLS GAP AND THE OPPORTUNITY
The biggest challenge in Africa''s tech boom is not hardware - it is skills. Thousands of young Rwandans are eager to work in technology, but many lack practical training. This is why programs like our short courses and internships matter. When students learn by building real projects, they graduate ready to contribute immediately.

WHAT THIS MEANS FOR YOU
If you are a student, now is the best time to learn to code, configure networks or design brands. If you are a business owner, now is the best time to go digital. If you are looking for quality devices at honest prices, we are here to help you every step of the way.

At Billboard Technology, our mission is simple: make technology affordable and accessible to every Rwandan. Whether you are buying your first laptop, setting up an office network or learning to code, you are always welcome.', 'Latest Technology News', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('JavaScript for Absolute Beginners', 'javascript-for-absolute-beginners', 'JavaScript powers almost every modern website. Learn the basics step by step in this beginner-friendly guide with examples you can try today.', 'JavaScript is the programming language of the web. Almost every website you visit - from news sites to online shops - uses JavaScript to make pages interactive. Buttons, forms, menus, animations, games, even the calculator on your phone app are all powered by JavaScript.

WHY LEARN JAVASCRIPT?
First, it is one of the easiest languages to start. You do not need to install anything. Open your browser, press F12, click on "Console" and write your first program:
console.log("Hello Rwanda!");
Press Enter and you will see the message appear. Congratulations - you have written your first JavaScript code.

Second, JavaScript is everywhere. It runs in the browser, on servers with Node.js, on mobile phones and even on smart devices. Once you learn it, you can build websites, apps, games and backend systems with one language.

VARIABLES AND DATA
Variables store information so you can reuse it. In modern JavaScript, we use let for values that change and const for values that never change.
let name = "Aline";
const school = "KIST";
name = "Aline Claire"; // we can change a let value
console.log(name + " studies at " + school);
JavaScript has several data types: numbers (age = 22), strings ("hello"), booleans (true or false), arrays ([1, 2, 3]) and objects ({ name: "Aline", age: 22 }).

CONDITIONS
Conditions let your program make decisions:
let score = 75;
if (score >= 70) {
  console.log("Passed - congratulations!");
} else {
  console.log("Try again - you are close!");
}

LOOPS
Loops repeat an action. To print numbers from 1 to 5:
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

FUNCTIONS
Functions are reusable blocks of code:
function greet(name) {
  return "Welcome, " + name + "!";
}
console.log(greet("Eric"));
console.log(greet("Diane"));

ARRAYS AND OBJECTS IN REAL LIFE
Think of a product list in an online shop:
const products = [
  { name: "Laptop", price: 780000 },
  { name: "Router", price: 55000 },
  { name: "Printer", price: 180000 }
];
for (const product of products) {
  console.log(product.name + " costs " + product.price + " RWF");
}

YOUR LEARNING PATH
1. Master variables, data types and operators.
2. Practice with conditions and loops.
3. Learn functions and arrays.
4. Build small projects: a calculator, a to-do list or a simple quiz.
5. Then move to the Document Object Model (DOM) to make websites interactive.

The best way to learn JavaScript is to build. Write code every single day, even if it is only for fifteen minutes. When you get stuck - and you will - use the browser console to test small pieces of code.

Want a complete, guided journey? Our 3-month Software Development course teaches JavaScript, HTML, CSS, React, Node.js, Express, MySQL and Git through real projects. You will finish with a portfolio that proves what you can do.', 'Programming Tutorials', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('Build Your First Web App with React', 'build-your-first-web-app-with-react', 'React is one of the most popular tools for building modern web apps. Follow this guide to create and understand your first React application.', 'React is a JavaScript library created by Meta (Facebook) for building user interfaces. It is used by some of the biggest companies in the world because it makes applications fast, organized and easy to maintain. Once you understand JavaScript, React is the natural next step on your developer journey.

WHY REACT?
Before React, websites updated the whole page when something changed - slow and wasteful. React updates only the parts that changed, which makes apps feel instant. It is also built around components: small, reusable pieces of the interface. A button, a card, a header and a whole page are all components.

SETTING UP YOUR FIRST PROJECT
The fastest way to start is with Vite. Open your terminal and run:
npm create vite@latest my-app
cd my-app
npm install
npm run dev
Your browser will open on http://localhost:3000 with a starter page. Now open src/App.jsx - this is your main component.

YOUR FIRST COMPONENT
A component is a JavaScript function that returns JSX, which looks like HTML:
function ProductCard() {
  return (
    <div className="card">
      <h3>Billboard Pro Laptop</h3>
      <p>780,000 RWF</p>
    </div>
  );
}
export default ProductCard;

PROPS - PASSING DATA
Props let you reuse one component with different data:
function ProductCard({ name, price }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{price} RWF</p>
    </div>
  );
}
export default function App() {
  return (
    <div>
      <ProductCard name="Laptop" price={780000} />
      <ProductCard name="Printer" price={180000} />
    </div>
  );
}

STATE - MAKING COMPONENTS REMEMBER
State lets a component remember information that changes. The useState hook is the first one every beginner learns:
import { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

HANDLING LISTS
Rendering lists is one of the most common tasks:
const products = ["Laptop", "Printer", "Router"];
return (
  <ul>
    {products.map((item) => <li key={item}>{item}</li>)}
  </ul>
);

WHAT TO LEARN NEXT
After the basics, explore:
- Forms and controlled inputs
- useEffect for loading data from an API
- React Router for multiple pages
- Fetching data with fetch or axios
- Styling with CSS or Tailwind CSS

OUR OWN STORE IS BUILT WITH REACT
The site you are reading right now is a React application. When you learn React, you are learning the same technology that powers real shops, banks and social networks.

Join our 3-month Software Development course to go from "Hello World" to building full websites with React, Node.js, Express and MySQL - guided by mentors who work on real projects every day.', 'Programming Tutorials', 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('Computer Networking Basics Explained', 'computer-networking-basics-explained', 'Understand IP addresses, routers, switches, subnetting and more in this simple, practical introduction to computer networking.', 'Computer networking is how computers talk to each other and share information. Every time you send an email, stream a video, print a document or browse a website, a network is doing the work behind the scenes. If you want to work in IT, networking is a skill you cannot avoid - and it is easier to understand than most people think.

WHAT IS A NETWORK?
A network is a group of connected devices that share resources such as files, printers and internet access. The most common type is the Local Area Network (LAN) - the network inside your home or office, where your phone, laptop, TV and printer all connect to one router.

IP ADDRESSES - THE ADDRESSES OF THE INTERNET
Every device on a network needs a unique address so data knows where to go. This is called an IP (Internet Protocol) address, for example 192.168.1.10. Just as a letter needs a home address, data packets need IP addresses to reach the right device. You also have a public IP address - the address the rest of the internet uses to reach your connection.

ROUTERS AND SWITCHES
A router connects your local network to the internet. It decides the best path for data and sends it to the right destination. A switch, on the other hand, connects many devices inside the same network using cables. Think of a router as the post office sorting mail to other towns, and a switch as the person delivering mail inside your building.

SUBNETTING - SPLITTING THE NETWORK
Subnetting divides one large network into smaller, manageable pieces. This makes networks faster, more secure and easier to organize. When you see an address like 192.168.1.0/24, the /24 tells you how many addresses belong to that network.

DNS - THE PHONEBOOK OF THE INTERNET
You type www.google.com, but computers understand numbers. The Domain Name System (DNS) translates human-friendly names into IP addresses. Without DNS, you would have to remember numbers for every website you visit.

WHY SECURITY MATTERS
An unsecured network is an open door. Always:
- Use WPA2 or WPA3 encryption on Wi-Fi
- Set strong passwords on routers and switches
- Change default usernames and passwords
- Keep firmware updated
- Use a firewall

THE OSI MODEL - HOW NETWORKS WORK IN LAYERS
Network professionals understand communication through the OSI model, which divides networking into seven layers, from the physical cable (Layer 1) to the applications you use (Layer 7). You do not need to memorize everything at first, but understanding the layers helps you troubleshoot problems faster.

ARE YOU READY TO GO DEEPER?
Networking is the foundation of everything digital, and professionals with networking skills are in high demand. Our 3-month Networking course covers computer hardware, network basics, IP addressing, subnetting, Cisco, routing, switching and security - with real equipment, so you practice on the same routers and switches used in offices. We also stock all the routers, switches, cables and tools you need to build your own home lab.', 'Networking Tips', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('How to Set Up a Fast Home Wi-Fi Network', 'how-to-set-up-a-fast-home-wifi-network', 'Slow internet or dead zones? These simple, practical steps will make your home Wi-Fi faster, safer and more reliable.', 'A slow or unstable Wi-Fi connection is one of the most frustrating problems at home, especially when you are working, studying or streaming. The good news is that most Wi-Fi problems have simple fixes. Follow these steps and enjoy noticeably faster internet.

1. PLACE YOUR ROUTER IN THE CENTER
Wi-Fi signals spread out like a ball, so your router should be as central as possible. Place it at eye level, away from walls, metal objects, aquariums and the floor. Never hide it inside a cabinet or behind the TV - that blocks the signal.

2. ELEVATE IT
The higher the router, the better the coverage. A router on a high shelf or mounted on a wall covers much more space than one sitting on the floor behind a sofa.

3. CHOOSE THE RIGHT BAND
Most routers broadcast two bands: 2.4GHz and 5GHz. The 2.4GHz band travels farther and passes through walls better, while 5GHz is faster but has a shorter range. Connect devices that need speed - phones, laptops, streaming boxes - to 5GHz, and keep older or distant devices on 2.4GHz.

4. AVOID CROWDED CHANNELS
Neighbouring routers can use the same channel and slow you down. In your router settings, try changing the channel to one that is less crowded, or simply set it to "auto" and let the router pick the best one.

5. UPGRADE TO WI-FI 6
If your router is more than five years old, consider upgrading. Wi-Fi 6 routers are faster, more secure and handle many devices at once without slowing down. They are especially useful when everyone in the family has a phone, laptop and tablet connected at the same time.

6. KILL DEAD ZONES WITH MESH OR A REPEATER
If some rooms have no signal, do not buy another internet line - extend the one you have. A mesh system covers large homes with one seamless network, while a Wi-Fi repeater is a cheaper way to extend coverage to a single room.

7. SECURE YOUR NETWORK
A fast network is useless if it is not safe. Set a strong password, enable WPA2 or WPA3 encryption, and change the default router name and password. Also turn on the router firewall and keep the firmware updated.

8. RESTART IT REGULARLY
Routers work hard. If your internet becomes slow or devices drop off, a simple restart - unplug for 30 seconds, then plug back in - often fixes everything.

WHEN TO ASK FOR HELP
If you have tried all of the above and your internet is still slow, the problem may be with your internet provider or with an old router that cannot handle your speed. Come to Billboard Technology and we will test your equipment and recommend the right router, mesh system or repeater for your home and budget - with installation advice included.', 'Networking Tips', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('Top 5 Tools for Graphic Design Beginners', 'top-5-tools-for-graphic-design-beginners', 'Start your design career with these five powerful yet easy-to-learn tools - including free options that produce professional results.', 'Graphic design is a skill that opens many doors: social media posts, logos, posters, business cards, websites and more. The best part is that you can start today, and some of the best tools are free or very affordable. Here are the five tools every beginner should know.

1. CANVA - THE FASTEST WAY TO DESIGN
Canva is perfect for beginners. It has thousands of ready-made templates for posters, flyers, resumes, Instagram posts and presentations. You simply pick a template, change the text and colors, and download. No experience is needed. Canva is also great for quick client work while you are still learning.

2. ADOBE PHOTOSHOP - THE INDUSTRY STANDARD
Photoshop is the most famous design software in the world. It is used for photo editing, digital art, web graphics and more. It takes time to master, but once you do, you can edit photos professionally, remove backgrounds, create banners and retouch images. Every serious designer learns Photoshop.

3. ADOBE ILLUSTRATOR - FOR LOGOS AND ILLUSTRATIONS
Illustrator is designed for vector graphics. Unlike photos, vector images can be resized to any size without becoming blurry - that is why logos are always made in Illustrator. It is the tool to learn for logos, icons, lettering and illustrations.

4. CORELDRAW - POPULAR FOR PRINT
CorelDRAW is a favorite in Africa for print design: business cards, banners, signboards and magazines. It is powerful, affordable and widely used by printing shops in Rwanda. If you want to design for print, CorelDRAW is a valuable skill.

5. FIGMA - THE TOOL FOR MODERN UI DESIGN
Figma is the go-to tool for web and app design. It runs in the browser, which means you and your team can work on the same design at the same time. Figma is essential if you want to design websites, mobile apps or dashboards.

HOW TO LEARN THEM IN THE RIGHT ORDER
- Start with Canva to learn design basics quickly.
- Move to Photoshop to master image editing.
- Learn Illustrator for logos and vector art.
- Add CorelDRAW if you want to work in print.
- Use Figma to step into web and app design.

Our advice is to master one tool at a time instead of jumping between all five. Each tool builds on the same design principles - color, contrast, spacing and typography - so the second tool is always easier than the first.

READY TO BECOME A PROFESSIONAL?
Our 3-month Graphic Design course teaches Canva, Photoshop, Illustrator, CorelDRAW and branding through real projects. You will design logos, posters and social media content for real clients, and graduate with a portfolio that gets you hired.', 'Graphic Design Ideas', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('How to Design Your First Logo', 'how-to-design-your-first-logo', 'A great logo is simple, memorable and timeless. Follow this complete step-by-step process - from research to final file - to create yours.', 'Your logo is the face of your brand. It appears on your products, your website, your business cards and your shop sign. A great logo is simple, memorable and timeless - think of famous brands you recognize at a glance. Here is the complete process to design your first professional logo.

STEP 1: UNDERSTAND THE BRAND
Do not open any software yet. First, understand who the brand is for. Ask questions: Who are the customers? What does the brand stand for? Is it modern or traditional? Bold or elegant? A logo for a tech company should feel different from a logo for a restaurant, and your design must match the brand personality.

STEP 2: RESEARCH FOR INSPIRATION
Look at logos in the same industry - not to copy, but to understand what works. Notice colors, shapes and fonts. Save examples you like. This research tells you what your design needs to compete with.

STEP 3: SKETCH ON PAPER
This is the step most beginners skip, and it is the most important. Draw at least 10 to 20 rough ideas on paper. Start with simple shapes and letters. Do not worry about beauty at this stage - your best idea is usually hiding among the first ugly sketches.

STEP 4: CHOOSE YOUR COLORS
Colors carry emotion. Blue feels trustworthy, green suggests growth and nature, red is bold and energetic, yellow feels friendly. Use only two or three colors so the logo stays clean. Also design a version in black and white - a strong logo must work without color.

STEP 5: PICK THE RIGHT FONTS
Typography is half of logo design. Bold sans-serif fonts feel modern and confident. Serif fonts feel classic and trustworthy. Script fonts feel elegant and personal. Use at most two font styles in one logo, and make sure the name is easy to read at any size.

STEP 6: DIGITIZE IN ILLUSTRATOR OR CORELDRAW
Turn your best sketch into vector art using Adobe Illustrator or CorelDRAW. Work with simple shapes and clean curves. Vector format means your logo stays sharp from a business card to a billboard.

STEP 7: TEST IT EVERYWHERE
Scale the logo down to a tiny size and make sure it is still readable. Test it on a white background, a black background and a photo. Show it to friends and ask what it makes them think of. If it works everywhere, your design is done.

STEP 8: DELIVER THE RIGHT FILES
A professional logo should be delivered in several formats: .ai or .cdr (the original editable file), .svg (for the web), .pdf (for printing) and .png with a transparent background. Always give the client the editable files - they belong to the client.

Designing logos is one of the best first services for a new designer, because every business needs one. Learn the complete process - including branding and social media design - in our 3-month Graphic Design course. You will design real logos for real businesses and build the portfolio that gets you your first clients.', 'Graphic Design Ideas', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('From Intern to Employee: Patrick''s Story', 'from-intern-to-employee-patricks-story', 'Patrick studied at CMS/UNILAK in Kigali, then joined our internship with no real experience - only school knowledge and a lot of determination. Here is how he built his career - one real project at a time.', 'Two years ago, Patrick was an L4 software development student at CMS/UNILAK in Kigali. He had attended classes, passed exams and memorized theory - but he had never built a real system that real people would use. Like many students, he knew that passing tests was not the same as building real software.

That feeling pushed him to apply for the Billboard Technology internship program. "I knew I needed something more than the classroom," Patrick remembers. "I needed proof that I could actually build software."

THE FIRST MONTH - LEARNING BY DOING
From day one, Patrick worked on real projects. He started by fixing small bugs in an existing system, then moved on to adding features. His mentor reviewed his code every day, showed him cleaner ways to write it, and taught him how to use Git and to work in a team.

"I learned more in three months of internship than in two years of classroom learning," Patrick says. "Every day I was solving problems that no lecture can cover."

THE TURNING POINT
The turning point came when Patrick was asked to build an inventory system for a local shop. He designed the MySQL database, wrote the backend with Node.js and Express, and built the frontend with React. Two weeks later, the shop was using his system - and it still is today.

"I will never forget the feeling the first time I saw someone using software I had built," Patrick says. "That is when I knew this is my career."

THE RESULT
When the internship ended, we offered Patrick a full-time position as a junior developer. Today, he mentors new interns - the same way someone once mentored him. "The cycle is beautiful," he laughs. "One day you are the student, and before you know it, you are the one teaching."

PATRICK''S ADVICE TO STUDENTS
- Apply early. Do not wait until you graduate to look for experience.
- Build small projects on your own, even if nobody asks you to.
- Never be afraid to ask questions - that is how you learn fast.
- Show up every day, because consistency beats talent.

ARE YOU NEXT?
If you are an L3, L4 or L5 software development student looking for real experience, our internship program is always open. You will get a mentor, real projects and a team that believes in you. Patrick''s story proves that with the right opportunity and hard work, your story could be next.', 'Student Success Stories', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team'),
  ('How Internships Built My Career', 'how-internships-built-my-career', 'Diane, Eric and Chantal all left the classroom with doubts - and walked into jobs after real internships. Here are their stories.', '"How do I get my first job in tech?" is the question we hear most from students. Our answer is always the same: start with an internship. Internships turn knowledge into experience, and experience into opportunities. Here are three stories that prove it.

DIANE - FROM THEORY TO NETWORK TECHNICIAN
Diane studied networking and could explain the OSI model perfectly, but she had never touched a real router until her internship. At Billboard Technology, she helped set up the networks of two small offices: running cables, configuring switches, setting up Wi-Fi and troubleshooting real problems under pressure.

"I was nervous the first time I held a switch," Diane says. "By the end, I could configure a network on my own in an afternoon."

Six months after her internship, Diane was hired as a network technician. "The internship gave me the hands-on confidence that no classroom can give," she says.

ERIC - BUILDING A PORTFOLIO THAT GETS HIRED
Eric joined as an L5 student and was placed directly onto an e-commerce project. He learned React, Node.js and MySQL by building real features: product listings, a shopping cart and payment integration. By the time he graduated, he had a portfolio of finished work - and two job offers.

"Employers do not ask what you studied. They ask what you have built," Eric says. "My internship gave me something to show and something to talk about in interviews."

CHANTAL - FROM TEMPLATES TO REAL CLIENT WORK
Chantal designed posters, logos and social media content for our marketing team. She started with Canva templates and quickly moved to Photoshop and Illustrator. Her portfolio of real designs impressed a local agency, which hired her as a junior designer.

"I walked into the interview with samples of work I actually delivered," Chantal says. "That changed everything."

WHAT ALL THREE HAVE IN COMMON
They applied, they showed up, and they worked on real projects. Internships are the bridge between the classroom and the workplace - the place where you learn teamwork, deadlines, client expectations and professional habits.

HOW TO START YOUR OWN JOURNEY
- Apply to internships early, not after graduation.
- Prepare: learn the basics of your field before you start.
- Ask for feedback and act on it.
- Treat every task - even small ones - as a chance to grow.

Our internship program for L3, L4 and L5 software development students gives you a mentor, real projects and a team to learn with. If you prefer structured learning first, our 3-month courses in Software Development, Networking and Graphic Design take you from beginner to job-ready. Whichever path you choose, remember Diane, Eric and Chantal: the opportunity is out there - go and take it.', 'Student Success Stories', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60', 'Billboard Tech Team');
