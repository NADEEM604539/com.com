-- Drop database if it exists and recreate it
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db;
USE ecommerce_db;

-- Create Users table
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  address TEXT,
  phone VARCHAR(20),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE Categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Products table
CREATE TABLE Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  imageUrl VARCHAR(255),
  countInStock INT NOT NULL DEFAULT 0,
  rating DECIMAL(3, 1) DEFAULT 0,
  numReviews INT DEFAULT 0,
  categoryId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Create Orders table
CREATE TABLE Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  shippingAddress TEXT NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  paymentResultId VARCHAR(100),
  paymentResultStatus VARCHAR(50),
  paymentResultUpdateTime DATETIME,
  taxPrice DECIMAL(10, 2) DEFAULT 0,
  shippingPrice DECIMAL(10, 2) DEFAULT 0,
  totalPrice DECIMAL(10, 2) NOT NULL,
  isPaid BOOLEAN DEFAULT FALSE,
  paidAt DATETIME,
  isDelivered BOOLEAN DEFAULT FALSE,
  deliveredAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create OrderItems table
CREATE TABLE OrderItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Create Cart table
CREATE TABLE Cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Create Reviews table
CREATE TABLE Reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE
);

-- Insert admin user with bcrypt hashed password 'password123'
-- The hash below is for 'password123' using bcrypt with 10 salt rounds
INSERT INTO Users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$oua1/J4cUeVSjQS3RJGxu.aQpDoFa8Iy9y3Da4RUgj9UckHFn6tqC', 'admin');

-- Insert customer users
INSERT INTO Users (name, email, password, role) VALUES 
('John Doe', 'john@example.com', '$2a$10$oua1/J4cUeVSjQS3RJGxu.aQpDoFa8Iy9y3Da4RUgj9UckHFn6tqC', 'customer'),
('Jane Smith', 'jane@example.com', '$2a$10$oua1/J4cUeVSjQS3RJGxu.aQpDoFa8Iy9y3Da4RUgj9UckHFn6tqC', 'customer');

-- Insert categories
INSERT INTO Categories (name, description) VALUES 
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Fashion and apparel'),
('Books', 'Books and literature'),
('Home & Kitchen', 'Home appliances and kitchen tools');

-- Insert products
INSERT INTO Products (name, description, price, imageUrl, countInStock, rating, numReviews, categoryId) VALUES 
('Smartphone X', 'Latest smartphone with advanced features', 999.99, '/uploads/phonex.jpg', 15, 4.5, 10, 1),
('Laptop Pro', 'High-performance laptop for professionals', 1299.99, '/uploads/laptop.jpg', 8, 4.8, 7, 1),
('Cotton T-Shirt', 'Comfortable cotton t-shirt', 19.99, '/uploads/tshirt.jpg', 50, 4.2, 15, 2),
('Denim Jeans', 'Classic denim jeans', 49.99, '/uploads/WIN_20240927_10_46_01_Pro.jpg', 30, 4.0, 12, 2),
('Programming Guide', 'Comprehensive programming guide', 34.99, '/uploads/program.jpg', 20, 4.7, 8, 3),
('Coffee Maker', 'Automatic coffee maker', 89.99, '/uploads/WIN_20240927_10_46_01_Pro.jpg', 12, 4.3, 9, 4); 