import express from 'express'
import { registerNotification, getAllNotifications, getNotificationsByUserID, updateNotification } from '../controllers/notificationController.js'
import { verifyToken } from '../middelwares/auth.js'

const router = express.Router()

router.post('/notification/register', registerNotification)

router.get('/notification/get-all', verifyToken, getAllNotifications)

router.get('/notification/get-by-user', verifyToken, getNotificationsByUserID) 

router.patch('/notification/update', verifyToken, updateNotification)

export default router