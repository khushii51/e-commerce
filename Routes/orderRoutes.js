import express from 'express';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/role.js';
import { createOrder, deleteOrder, getAllOrders, getMyOrders, updateOrder } from '../controller/orderController.js';

const router = express.Router();

router.use(authMiddleware)
router.post('/create', createOrder);
router.get('/my', roleMiddleware(['admin', 'customer']), getMyOrders);
router.get('/', roleMiddleware('admin'), getAllOrders);
router.delete('/delete/:id', roleMiddleware(['admin', 'customer']), deleteOrder);
router.put('/update/:id', roleMiddleware(['admin', 'customer']), updateOrder);

export default router;
