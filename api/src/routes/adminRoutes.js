import express from 'express'
import { getAdmin, updateAdmin } from '../controllers/adminController.js'
import { verifyToken } from '../middelwares/auth.js'
import upload from '../multer/uploadConfig.js'

const router = express.Router()

// Rota que devolve o admin
router.get('/admin/get', verifyToken, getAdmin)

// Rota que atualiza o admin
router.patch('/admin/update', verifyToken, upload.single('admin-avatar'), updateAdmin)

export default router