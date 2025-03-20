# E-Commerce Shop

A full-stack e-commerce web application built with React, Node.js, Express, and MySQL.

![E-Commerce Shop](/screenshots/homepage.png)

## Features

- **User Authentication** - Register, login, and user profiles
- **Product Browsing** - Browse products by category with search functionality
- **Shopping Cart** - Add/remove items, adjust quantities
- **Checkout Process** - Address, payment method, and order confirmation
- **Order Management** - View order history and details
- **Responsive Design** - Mobile-friendly interface

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Bootstrap for styling
- Axios for API requests

### Backend
- Node.js with Express
- MySQL database with Sequelize ORM
- JWT for authentication
- RESTful API design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/e-commerce-shop.git
cd e-commerce-shop
```

2. Install server dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

5. Set up the database
```bash
# Run database seed script
node database/seed.js
```

## Running the Application

1. Start the backend server (development mode)
```bash
npm run server
```

2. Start the frontend (in a separate terminal)
```bash
cd frontend
npm start
```

3. Open your browser and navigate to http://localhost:3000

## Deployment

### Backend
The backend can be deployed to services like:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean

### Frontend
The React frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages

## Sample User Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | Admin |
| john@example.com | hi | Customer |
| jane@example.com | password123 | Customer |

## Screenshots

![Product Page](/screenshots/product.png)
![Cart Page](/screenshots/cart.png)
![Checkout Page](/screenshots/checkout.png)

## License

[MIT](LICENSE)

## Author

Your Name

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [React Router](https://reactrouter.com/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/) 