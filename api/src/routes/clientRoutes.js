import express from 'express'
import { registerClient, getClients, getClientById, getClientType, updateClient, updateClientHistory , deleteClient} from '../controllers/clientController.js'
import { loginController } from '../controllers/loginController.js'
import { verifyToken } from '../middelwares/auth.js'
import upload from '../multer/uploadConfig.js'

const router = express.Router()

// Rota de criação de cliente
router.post('/client/register', registerClient)

// Rota que devolve todos os clientes
router.get('/client/get-many', getClients)

// Rota que devolve um cliente específico
router.get('/client/get-one', verifyToken, getClientById)

// Rota que devolve o tipo
router.get('/client/get-type', getClientType)

// Rota que edita um cliente
router.put('/client/update', verifyToken, upload.single('client-avatar'), updateClient)

// Rota que atualiza o hitórico do cliente
router.patch('/client/update-history', verifyToken, updateClientHistory)

// Rota que deleta clientes
router.delete('/client/delete', verifyToken, deleteClient)

// Rota de login
router.post('/login', loginController)

export default router