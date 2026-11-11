import express from 'express';
import { createTransaction, deleteTransactionById, getTransactionsByUserId, getTransactionSummaryByUserId } from '../controllers/transactionsController.js';


const router = express.Router();

router.post('/', createTransaction)
router.delete('/:id', deleteTransactionById)
router.get('/:user_id', getTransactionsByUserId)
router.get('/summary/:user_id', getTransactionSummaryByUserId)

export default router;