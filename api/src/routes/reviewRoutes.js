import express from 'express';
import { registerReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middelwares/auth.js';

const router = express.Router();

// Rota que registra as avaliações
router.post('/review/register', registerReview);

// Rota que obtém todas as avaliações
router.get('/review/get-many', getReviews);

// Rota que atualiza uma avaliação
router.put('/review/update/:id', verifyToken, updateReview);

// Rota que deleta uma avaliação
router.delete('/review/delete/:id', verifyToken, deleteReview);

export default router;