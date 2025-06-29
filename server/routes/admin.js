import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersCount,
  getProductsCount,
  getOrdersStats
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Все маршруты требуют аутентификации и прав администратора
router.use(authenticateToken);
router.use(requireAdmin);

// Статистика
router.get('/dashboard/stats', getDashboardStats);
router.get('/users/count', getUsersCount);
router.get('/products/count', getProductsCount);
router.get('/orders/stats', getOrdersStats);

// Управление пользователями
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;