import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct} from '../controller/productController.js';
import roleMiddleware from '../middleware/role.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// router.get('/', getAllProducts);
router.use(authMiddleware)

router.get('/', roleMiddleware(['admin', 'customer']), getAllProducts);
router.post('/create', roleMiddleware('admin'), upload.single('image'), createProduct);
router.put('/update/:id', roleMiddleware('admin'), upload.single('image'), updateProduct);
router.delete('/delete/:id', roleMiddleware('admin'), deleteProduct);
router.get('/:id', roleMiddleware(['admin', 'customer']), getProductById);


export default router;