import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/my', authenticateToken, getUserOrders);
router.get('/all', authenticateToken, requireAdmin, getAllOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;