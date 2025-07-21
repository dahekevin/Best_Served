import express from 'express'
import { registerReservation, getReservations, getTotalReservations, updateReservation, updateReservationStatus, deleteReservation } from '../controllers/reservationController.js'
import { verifyToken } from '../middelwares/auth.js';

const router = express.Router();

// Rota que registra as reservas
router.post('/reservation/register', registerReservation)

// Rota que devolve todas reservas
router.get('/reservation/get-many', getReservations)

// Rota que devolve o total de reservas
router.get('/reservation/get-total', getTotalReservations)

// Rota que atualiza uma reserva
router.put('/reservation/update', verifyToken, updateReservation)

// Rota que atualiza o status da reserva
router.patch('/reservation/update-status', verifyToken, updateReservationStatus)

// Rota que deleta reserva
router.delete('/reservation/delete', verifyToken, deleteReservation)

export default router 