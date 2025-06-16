import express from 'express'
import { registerUser, getUsers, getUserById, updateUser, deleteUser, userLogin } from '../controllers/userController.js'
import { verifyToken } from '../middelwares/auth.js'
import upload from '../multer/uploadConfig.js'

const router = express.Router()

// Rota de criação de usuário
router.post('/register', registerUser)

// Rota que devolve todos os usuários
router.get('/get-many', getUsers)

// Rota que devolve um usuário específico
router.get('/get-one', verifyToken, getUserById)

// Rota que edita um usuário
router.put('/edit', verifyToken, upload.single('avatar'), updateUser)

// Rota que deleta usuários
router.delete('/delete', verifyToken, deleteUser)

// Rota de login
router.post('/login', userLogin)

export default router