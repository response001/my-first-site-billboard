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
  ('Welcome to Billboard Technology', 'welcome-to-billboard-technology', 'Your one-stop shop for devices, training and internships.', 'We are excited to launch our platform. Buy the latest devices, enroll in professional short courses and apply for internships.', 'Latest Technology News', 'Billboard Tech Team');

-- Product gallery + features seed (photos per product + specifications)

UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5-13400","GPU: Intel Integrated UHD","RAM: 8GB DDR4","Storage: 256GB SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-desktop-pc';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7","RAM: 16GB","Storage: 512GB SSD","Screen: 14-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-pro-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.7-inch LTPO 120Hz","Camera: 50MP + 48MP + 48MP","Battery: 5000mAh","Charging: 45W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-s1-smartphone';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 2.0-inch AMOLED","Battery Life: 5 days","Water Resistance: IP67","Connectivity: GPS + LTE","Health Tracking: Heart rate, SpO2, ECG & GPS","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-watch-fit';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60"]', features = '["Technology: Inkjet","Print Speed: Up to 8 ppm","Connectivity: USB","Paper Size: A4 & Letter","Duty Cycle: Up to 1,000 pages/month","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-laser-printer';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Gigabit Network Switch","Speed: Up to 1 Gbps","Ports: 8 x Gigabit LAN","Security: WPA2 + VLAN Support","Coverage: Whole building","Warranty: 1 Year Warranty"]' WHERE slug = 'billboard-wifi-router';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.7-inch LTPO 120Hz","Camera: 50MP + 48MP + 48MP","Battery: 5000mAh","Charging: 45W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'iphone-15-pro';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.8-inch QHD+ AMOLED","Camera: 108MP Periscope","Battery: 5500mAh","Charging: 100W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-s24';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB","Storage: 256GB SSD","Screen: 13.3-inch FHD","Battery: Up to 8 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'macbook-air-m3';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7","RAM: 16GB","Storage: 512GB SSD","Screen: 14-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'dell-xps-15';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 12.4-inch AMOLED","Storage: 256GB","RAM: 8GB","Battery: Up to 14 hours","Connectivity: Wi-Fi only","Warranty: 1 Year Warranty"]' WHERE slug = 'ipad-air';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 10.9-inch Retina","Storage: 512GB","RAM: 8GB","Battery: Up to 13 hours","Connectivity: Wi-Fi + 4G","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-tab-s9';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.4-inch AMOLED","Battery Life: 7 days","Water Resistance: 5ATM","Connectivity: Bluetooth 5.3","Health Tracking: Heart rate & SpO2","Warranty: 1 Year Warranty"]' WHERE slug = 'apple-watch-series-9';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.7-inch AMOLED","Battery Life: 10 days","Water Resistance: IP68","Connectivity: Bluetooth 5.3 + Wi-Fi","Health Tracking: Heart rate, SpO2 & ECG","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-watch-6';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Compatibility: Works with smartphones & tablets","Design: Premium finish","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'sony-wh-1000xm5-headphones';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Wireless 2.4GHz","Compatibility: PC & Console compatible","Design: RGB illuminated","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'rgb-gaming-keyboard';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5-13400","GPU: Intel Integrated UHD","RAM: 8GB DDR4","Storage: 256GB SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = '27-inch-4k-monitor';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB-C","Compatibility: Universal compatibility","Design: Compact & portable","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-mouse';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60"]', features = '["Technology: Inkjet All-in-One","Print Speed: Up to 22 ppm","Connectivity: USB + Wi-Fi + AirPrint","Paper Size: A4, Legal & Letter","Duty Cycle: Up to 5,000 pages/month","Warranty: 1 Year Warranty"]' WHERE slug = 'canon-wireless-printer';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: HD Security Camera","Speed: HD 1080p Video","Ports: Wi-Fi only","Security: Motion Detection Alerts","Coverage: Night Vision","Warranty: 1 Year Warranty"]' WHERE slug = 'tp-link-mesh-wifi-router';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Wi-Fi 6 Router","Speed: Up to 1200 Mbps","Ports: 4 x Gigabit LAN","Security: WPA3 Encryption","Coverage: Up to 1,500 sq ft","Warranty: 1 Year Warranty"]' WHERE slug = 'cctv-security-camera';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB-C","Compatibility: Universal compatibility","Design: Compact & portable","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'wireless-earbuds';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Compatibility: Works with smartphones & tablets","Design: Premium finish","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = '1tb-external-ssd';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Wireless 2.4GHz","Compatibility: PC & Console compatible","Design: RGB illuminated","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = '20000mah-power-bank';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5-13400","GPU: Intel Integrated UHD","RAM: 8GB DDR4","Storage: 256GB SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-desktop-rtx-4070';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-13700K","GPU: NVIDIA RTX 4060 8GB","RAM: 16GB DDR4","Storage: 512GB NVMe SSD","Operating System: Windows 11 Home","Warranty: 1 Year Warranty"]' WHERE slug = 'all-in-one-desktop-24';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: AMD Ryzen 7 7800X3D","GPU: NVIDIA RTX 4070 12GB","RAM: 32GB DDR5","Storage: 1TB NVMe SSD","Operating System: Windows 11 Pro","Warranty: 2 Years Warranty"]' WHERE slug = 'office-mini-pc';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i9-13900K","GPU: NVIDIA RTX 4080 16GB","RAM: 64GB DDR5","Storage: 2TB NVMe SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = '4k-video-editing-workstation';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5-13400","GPU: Intel Integrated UHD","RAM: 8GB DDR4","Storage: 256GB SSD","Operating System: Windows 11 Pro","Warranty: 1 Year Warranty"]' WHERE slug = 'dual-monitor-office-setup';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7-13700K","GPU: NVIDIA RTX 4060 8GB","RAM: 16GB DDR4","Storage: 512GB NVMe SSD","Operating System: Windows 11 Home","Warranty: 1 Year Warranty"]' WHERE slug = 'compact-business-desktop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Apple M3","RAM: 16GB LPDDR5","Storage: 1TB SSD","Screen: 15.6-inch FHD","Battery: Up to 12 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'asus-rog-strix-gaming-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: AMD Ryzen 7","RAM: 32GB","Storage: 512GB NVMe SSD","Screen: 16-inch 4K OLED","Battery: Up to 14 hours","Warranty: 2 Years Warranty"]' WHERE slug = 'hp-spectre-x360-2-in-1';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB","Storage: 256GB SSD","Screen: 13.3-inch FHD","Battery: Up to 8 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'lenovo-thinkpad-x1-carbon';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7","RAM: 16GB","Storage: 512GB SSD","Screen: 14-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'acer-swift-3-thin-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593642532842-98d0fd5ebcaf?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Apple M3","RAM: 16GB LPDDR5","Storage: 1TB SSD","Screen: 15.6-inch FHD","Battery: Up to 12 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'microsoft-surface-laptop-5';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: AMD Ryzen 7","RAM: 32GB","Storage: 512GB NVMe SSD","Screen: 16-inch 4K OLED","Battery: Up to 14 hours","Warranty: 2 Years Warranty"]' WHERE slug = 'budget-chromebook';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i5","RAM: 8GB","Storage: 256GB SSD","Screen: 13.3-inch FHD","Battery: Up to 8 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'student-ultrabook-14';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1622151834677-70f982c9caef?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=60"]', features = '["CPU: Intel Core i7","RAM: 16GB","Storage: 512GB SSD","Screen: 14-inch FHD","Battery: Up to 10 hours","Warranty: 1 Year Warranty"]' WHERE slug = 'creator-pro-16-laptop';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.9-inch AMOLED","Battery Life: 14 days","Water Resistance: 3ATM","Connectivity: GPS + Bluetooth","Health Tracking: Full health suite","Warranty: 1 Year Warranty"]' WHERE slug = 'fitness-tracker-band';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 2.0-inch AMOLED","Battery Life: 5 days","Water Resistance: IP67","Connectivity: GPS + LTE","Health Tracking: Heart rate, SpO2, ECG & GPS","Warranty: 1 Year Warranty"]' WHERE slug = 'garmin-forerunner-watch';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.4-inch AMOLED","Battery Life: 7 days","Water Resistance: 5ATM","Connectivity: Bluetooth 5.3","Health Tracking: Heart rate & SpO2","Warranty: 1 Year Warranty"]' WHERE slug = 'kids-smartwatch';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 1.7-inch AMOLED","Battery Life: 10 days","Water Resistance: IP68","Connectivity: Bluetooth 5.3 + Wi-Fi","Health Tracking: Heart rate, SpO2 & ECG","Warranty: 1 Year Warranty"]' WHERE slug = 'classic-smartwatch-pro';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.7-inch LTPO 120Hz","Camera: 50MP + 48MP + 48MP","Battery: 5000mAh","Charging: 45W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'google-pixel-8';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.8-inch QHD+ AMOLED","Camera: 108MP Periscope","Battery: 5500mAh","Charging: 100W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'xiaomi-redmi-note-13';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.1-inch OLED 120Hz","Camera: Dual 50MP","Battery: 4000mAh","Charging: 33W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'oneplus-12-pro';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.5-inch AMOLED 120Hz","Camera: Triple 108MP","Battery: 4500mAh","Charging: 67W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'samsung-galaxy-z-fold-5';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1607936854279-55e8a4c64888?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.7-inch LTPO 120Hz","Camera: 50MP + 48MP + 48MP","Battery: 5000mAh","Charging: 45W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'budget-smartphone-6-5';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 6.8-inch QHD+ AMOLED","Camera: 108MP Periscope","Battery: 5500mAh","Charging: 100W Fast Charge","Operating System: Android 14","Warranty: 1 Year Warranty"]' WHERE slug = 'rugged-outdoor-phone';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 10.4-inch LCD","Storage: 64GB","RAM: 4GB","Battery: Up to 10 hours","Connectivity: Wi-Fi only","Warranty: 1 Year Warranty"]' WHERE slug = 'kindle-e-reader';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 11-inch 2K","Storage: 128GB","RAM: 6GB","Battery: Up to 12 hours","Connectivity: Wi-Fi + 4G","Warranty: 1 Year Warranty"]' WHERE slug = 'galaxy-tab-a-10-4';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 12.4-inch AMOLED","Storage: 256GB","RAM: 8GB","Battery: Up to 14 hours","Connectivity: Wi-Fi only","Warranty: 1 Year Warranty"]' WHERE slug = 'drawing-tablet-wacom';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=60"]', features = '["Display: 10.9-inch Retina","Storage: 512GB","RAM: 8GB","Battery: Up to 13 hours","Connectivity: Wi-Fi + 4G","Warranty: 1 Year Warranty"]' WHERE slug = 'lenovo-tab-m11';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1585232004423-244e0e6904e5?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?auto=format&fit=crop&w=800&q=60"]', features = '["Technology: Inkjet","Print Speed: Up to 8 ppm","Connectivity: USB","Paper Size: A4 & Letter","Duty Cycle: Up to 1,000 pages/month","Warranty: 1 Year Warranty"]' WHERE slug = 'hp-deskjet-2700-printer';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Gigabit Network Switch","Speed: Up to 1 Gbps","Ports: 8 x Gigabit LAN","Security: WPA2 + VLAN Support","Coverage: Whole building","Warranty: 1 Year Warranty"]' WHERE slug = '8-port-gigabit-network-switch';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Mesh Wi-Fi System","Speed: Up to 3000 Mbps","Ports: 4 x Gigabit LAN","Security: WPA3 + Parental Controls","Coverage: Up to 4,500 sq ft","Warranty: 1 Year Warranty"]' WHERE slug = 'cat6-network-cable-10m';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: HD Security Camera","Speed: HD 1080p Video","Ports: Wi-Fi only","Security: Motion Detection Alerts","Coverage: Night Vision","Warranty: 1 Year Warranty"]' WHERE slug = 'network-rack-cabinet-9u';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&w=800&q=60"]', features = '["Type: Wi-Fi 6 Router","Speed: Up to 1200 Mbps","Ports: 4 x Gigabit LAN","Security: WPA3 Encryption","Coverage: Up to 1,500 sq ft","Warranty: 1 Year Warranty"]' WHERE slug = 'wifi-repeater-1200mbps';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB-C","Compatibility: Universal compatibility","Design: Compact & portable","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'bluetooth-speaker-jbl';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Compatibility: Works with smartphones & tablets","Design: Premium finish","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'usb-c-multiport-hub';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Wireless 2.4GHz","Compatibility: PC & Console compatible","Design: RGB illuminated","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'laptop-backpack-15-6';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB wired","Compatibility: Works with Windows, Mac & Linux","Design: Ergonomic & lightweight","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = '1080p-usb-webcam';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB-C","Compatibility: Universal compatibility","Design: Compact & portable","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'usb-condenser-microphone';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Compatibility: Works with smartphones & tablets","Design: Premium finish","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'aluminum-laptop-stand';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1583863790271-d3a3491fe11f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Wireless 2.4GHz","Compatibility: PC & Console compatible","Design: RGB illuminated","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'wireless-fast-charger';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1531493185146-021cefdee39b?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB wired","Compatibility: Works with Windows, Mac & Linux","Design: Ergonomic & lightweight","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = '1tb-external-hard-drive';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB-C","Compatibility: Universal compatibility","Design: Compact & portable","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = '128gb-microsd-card';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Compatibility: Works with smartphones & tablets","Design: Premium finish","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'smart-home-speaker';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Wireless 2.4GHz","Compatibility: PC & Console compatible","Design: RGB illuminated","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'rgb-gaming-mouse-pad';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB wired","Compatibility: Works with Windows, Mac & Linux","Design: Ergonomic & lightweight","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-controller';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: USB-C","Compatibility: Universal compatibility","Design: Compact & portable","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'vr-headset';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Bluetooth 5.3","Compatibility: Works with smartphones & tablets","Design: Premium finish","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'gaming-headset';
UPDATE products SET gallery = '["https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1491472253230-a044054ca35f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60"]', features = '["Connectivity: Wireless 2.4GHz","Compatibility: PC & Console compatible","Design: RGB illuminated","Condition: Brand New","Warranty: 1 Year Warranty"]' WHERE slug = 'wireless-optical-mouse';
