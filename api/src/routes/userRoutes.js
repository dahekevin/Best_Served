import express from 'express'
import { registerUser, getUsers, updateUser, deleteUser, userLogin } from '../controllers/userController.js'
import { verifyToken } from '../middelwares/auth.js'

const router = express.Router()

// Rota de criação de usuário
router.post('/user/register', registerUser)

// Rota que devolve todos os usuários
router.get('/user/get', getUsers)

// Rota que edita um usuário
router.put('/user/edit/:id', updateUser)

// Rota que deleta usuários
router.delete('/user/delete/:id', verifyToken, deleteUser)

// Rota de login
router.post('/login', userLogin)

export default router