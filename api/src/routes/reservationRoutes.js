import express from 'express'
import { registerReservation, getReservations } from '../controllers/reservationController.js'

const router = express.Router();

// Rota que registra as reservas
router.post('/reservation/register', registerReservation)

// Rota que devolve todas reservas
router.get('/reservation/get-many', getReservations)

export default router