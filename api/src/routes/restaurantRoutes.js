import express from 'express';
import { registerRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, restaurantLogin } from '../controllers/restaurantController';
import { verifyToken } from '../middelwares/auth';

const router = express.Router();

// Rota de criação de restaurante
router.post('/register', registerRestaurant)

// Rota que devolve todos os restaurantes
router.get('/get-many', getRestaurants)

// Rota que devolve um restaurante específico
router.get('/get-one', verifyToken, getRestaurantById)

// Rota que edita um restaurante
router.put('/update/me', verifyToken, updateRestaurant)

// Rota que deleta restaurantes
router.delete('/delete/me', verifyToken, deleteRestaurant)

// Rota de login
router.post('/login', restaurantLogin)

export default router