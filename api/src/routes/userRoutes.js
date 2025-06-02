import express from 'express'
import { registerUser, getUsers, updateUser, deleteUser, userLogin } from '../controllers/userController.js'
import { verifyToken } from '../middelwares/auth.js'

const router = express.Router()

// Rota de criação de usuário
router.post('/sd-user/register', registerUser)

// Rota que devolve todos os usuários
router.get('/sd-user/get', getUsers)

// Rota que edita um usuário
router.put('/sd-user/edit/:id', updateUser)

// Rota que deleta usuários
router.delete('/sd-user/delete/:id', verifyToken, deleteUser)

// Rota de login
router.post('/sd-user/login', userLogin)

export default router