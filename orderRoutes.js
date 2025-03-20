const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderStatus,
  getUserOrders,
  getAllOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

// Get all orders for the logged-in user
router.get('/', protect, getUserOrders);

// Admin: Get all orders
router.get('/admin/all', protect, admin, getAllOrders);

module.exports = router; 