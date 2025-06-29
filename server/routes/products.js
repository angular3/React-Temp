import express from 'express';
import {
  getAllProducts,
  getProductById,
  getPopularProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/popular', getPopularProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, requireAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;