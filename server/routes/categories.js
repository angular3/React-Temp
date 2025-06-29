import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createCategory);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

export default router;