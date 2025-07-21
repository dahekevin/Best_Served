import express from 'express';
import upload from '../multer/uploadConfig.js';
import { verifyToken } from '../middelwares/auth.js';
import { registerRestaurant, getRestaurants, getRestaurantById, getTables, getRestaurantType, updateRestaurant, deleteRestaurant, restaurantLogin, getRestaurantByRating, updateRestaurantStatus, updateRestaurantIsActiveStatus } from '../controllers/restaurantController.js';
import { loginController } from '../controllers/loginController.js'

const router = express.Router();

// Rota de criação de restaurante
router.post('/restaurant/register', upload.fields([{ name: 'restaurant-avatar', maxCount: 1 }, { name: 'menu', maxCount: 1 }]), registerRestaurant)

// Rota que devolve todos os restaurantes
router.get('/restaurant/get-many', getRestaurants)

// Rota que devolve todos os restaurantes ordenados por rating
router.get('/restaurant/get-orderByRating', getRestaurantByRating)

// Rota que devolve um restaurante específico
router.get('/restaurant/get-one', verifyToken, getRestaurantById)

// Rota que devolve todos os menus de todos os restaurantes
router.get('/restaurant/get-tables', getTables)

// Rota que devolve o tipo
router.get('/restaurant/get-type', getRestaurantType)

// Rota que edita um restaurante
router.put('/restaurant/update', verifyToken, upload.fields([{ name: 'restaurant-avatar', maxCount: 1 }, { name: 'menu', maxCount: 1 }]), updateRestaurant)

// Rota que edita o status do restaurante
router.patch('/restaurant/update-status', updateRestaurantStatus)

// Rota que edita o status de ativo do restaurante
router.patch('/restaurant/update-isActive', updateRestaurantIsActiveStatus)

// Rota que deleta restaurantes
router.delete('/restaurant/delete', verifyToken, deleteRestaurant)

// Rota de login
router.post('/login', loginController)

export default router