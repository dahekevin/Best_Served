import express from 'express'
import { registerReservation, getReservations, updateReservation, deleteReservation } from '../controllers/reservationController.js'
import { verifyToken } from '../middelwares/auth.js';

const router = express.Router();

// Rota que registra as reservas
router.post('/reservation/register', registerReservation)

// Rota que devolve todas reservas
router.get('/reservation/get-many', getReservations)

// Rota que atualiza uma reserva
router.get('/reservation/update', verifyToken, updateReservation)

// Rota que deleta reserva
router.delete('/reservation/delete', verifyToken, deleteReservation)

export default router 