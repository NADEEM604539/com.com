const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');
const { User, Category, Product, Order, OrderItem } = require('../models');
require('dotenv').config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    address: '123 Admin St, City, Country',
    phone: '123-456-7890'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hi',
    address: '456 User St, City, Country',
    phone: '234-567-8901'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    address: '789 User Ave, City, Country',
    phone: '345-678-9012'
  }
];

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    imageUrl: '/uploads/electronics.jpg'
  },
  {
    name: 'Clothing',
    description: 'Men and women apparel',
    imageUrl: '/uploads/clothing.jpg'
  },
  {
    name: 'Books',
    description: 'Physical and digital books',
    imageUrl: '/uploads/books.jpg'
  },
  {
    name: 'Home & Kitchen',
    description: 'Home appliances and kitchen tools',
    imageUrl: '/uploads/home.jpg'
  }
];

const products = [
  {
    name: 'Apple iPhone 13',
    description: 'Latest iPhone with A15 Bionic chip and improved camera system',
    price: 799.99,
    stock: 50,
    imageUrl: '/uploads/iphonex.jpg',
    categoryId: 1,
    featured: true,
    rating: 4.5,
    numReviews: 12,
    discount: 5
  },
  {
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features and high performance',
    price: 999.99,
    stock: 35,
    imageUrl: '/uploads/iphonex.jpg',
    categoryId: 1,
    featured: true,
    rating: 4.6,
    numReviews: 14,
    discount: 7
  },
  {
    name: 'Laptop Pro',
    description: 'High-performance laptop with latest processor and enhanced graphics',
    price: 1299.99,
    stock: 25,
    imageUrl: '/uploads/laptop.jpg',
    categoryId: 1,
    featured: true,
    rating: 4.7,
    numReviews: 18,
    discount: 8
  },
  {
    name: 'Samsung Galaxy S21',
    description: 'Flagship Samsung phone with high resolution display and 5G',
    price: 699.99,
    stock: 40,
    imageUrl: '/uploads/samsung.jpg',
    categoryId: 1,
    featured: true,
    rating: 4.3,
    numReviews: 8,
    discount: 10
  },
  {
    name: 'Men\'s Casual T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear',
    price: 19.99,
    stock: 100,
    imageUrl: '/uploads/tshirt.jpg',
    categoryId: 2,
    featured: false,
    rating: 4.0,
    numReviews: 15,
    discount: 0
  },
  {
    name: 'Denim Jeans',
    description: 'Classic blue denim jeans, perfect fit for all occasions',
    price: 49.99,
    stock: 75,
    imageUrl: '/uploads/jeans.jpg',
    categoryId: 2,
    featured: false,
    rating: 4.2,
    numReviews: 12,
    discount: 0
  },
  {
    name: 'Women\'s Summer Dress',
    description: 'Light and flowy summer dress perfect for hot days',
    price: 39.99,
    stock: 80,
    imageUrl: '/uploads/dress.jpg',
    categoryId: 2,
    featured: true,
    rating: 4.7,
    numReviews: 20,
    discount: 15
  },
  {
    name: 'The Psychology of Money',
    description: 'Book about understanding how money works and making smarter financial decisions',
    price: 14.99,
    stock: 60,
    imageUrl: '/uploads/psych-money.jpg',
    categoryId: 3,
    featured: false,
    rating: 4.8,
    numReviews: 32,
    discount: 0
  },
  {
    name: 'Atomic Habits',
    description: 'Book about building good habits and breaking bad ones',
    price: 13.99,
    stock: 70,
    imageUrl: '/uploads/atomic-habits.jpg',
    categoryId: 3,
    featured: true,
    rating: 4.9,
    numReviews: 45,
    discount: 5
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with timer and multiple brewing options',
    price: 89.99,
    stock: 30,
    imageUrl: '/uploads/coffee-maker.jpg',
    categoryId: 4,
    featured: true,
    rating: 4.2,
    numReviews: 18,
    discount: 10
  },
  {
    name: 'Knife Set',
    description: '12-piece knife set with sharpener and wooden block',
    price: 59.99,
    stock: 25,
    imageUrl: '/uploads/knife-set.jpg',
    categoryId: 4,
    featured: false,
    rating: 4.4,
    numReviews: 14,
    discount: 0
  }
];

// Sample orders
const orders = [
  {
    orderNumber: 'ORD-001',
    userId: 2, // John Doe
    totalAmount: 849.99,
    shippingAddress: '456 User St, City, Country',
    paymentMethod: 'credit_card',
    paymentStatus: 'completed',
    status: 'delivered'
  },
  {
    orderNumber: 'ORD-002',
    userId: 2, // John Doe
    totalAmount: 1299.99,
    shippingAddress: '456 User St, City, Country',
    paymentMethod: 'paypal',
    paymentStatus: 'completed',
    status: 'shipped'
  },
  {
    orderNumber: 'ORD-003',
    userId: 3, // Jane Smith
    totalAmount: 73.98,
    shippingAddress: '789 User Ave, City, Country',
    paymentMethod: 'credit_card',
    paymentStatus: 'pending',
    status: 'processing'
  }
];

// Sample order items
const orderItems = [
  {
    orderId: 1,
    productId: 1,
    quantity: 1,
    price: 799.99,
    name: 'Apple iPhone 13',
    imageUrl: '/uploads/iphonex.jpg'
  },
  {
    orderId: 1,
    productId: 5,
    quantity: 2,
    price: 19.99,
    name: 'Men\'s Casual T-Shirt',
    imageUrl: '/uploads/tshirt.jpg'
  },
  {
    orderId: 2,
    productId: 3,
    quantity: 1,
    price: 1299.99,
    name: 'Laptop Pro',
    imageUrl: '/uploads/laptop.jpg'
  },
  {
    orderId: 3,
    productId: 9,
    quantity: 1,
    price: 13.99,
    name: 'Atomic Habits',
    imageUrl: '/uploads/atomic-habits.jpg'
  },
  {
    orderId: 3,
    productId: 6,
    quantity: 1,
    price: 49.99,
    name: 'Denim Jeans',
    imageUrl: '/uploads/jeans.jpg'
  }
];

const importData = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });

    // Create users with hashed passwords
    const createdUsers = await Promise.all(
      users.map(async user => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return User.create(user);
      })
    );

    console.log('Users imported successfully');

    // Create categories
    const createdCategories = await Category.bulkCreate(categories);
    console.log('Categories imported successfully');

    // Create products
    await Product.bulkCreate(products);
    console.log('Products imported successfully');

    // Create orders
    const createdOrders = await Order.bulkCreate(orders);
    console.log('Orders imported successfully');

    // Create order items
    await OrderItem.bulkCreate(orderItems);
    console.log('Order items imported successfully');

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.destroy({ where: {}, truncate: { cascade: true } });
    await Category.destroy({ where: {}, truncate: { cascade: true } });
    await User.destroy({ where: {}, truncate: { cascade: true } });

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 