import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const registerNotification = async (req, res) => {
    try {
        let notification
        if (req.query.role === 'client') {
            notification = await prisma.notification.create({
                data: {
                    type: req.body.type,
                    activity: req.body.activity,
                    clientId: req.body.clientId
                }
            })
        } else if (req.query.role === 'restaurant') {
            notification = await prisma.notification.create({
                data: {
                    type: req.body.type,
                    activity: req.body.activity,
                    restaurantId: req.body.restaurantId
                }
            })
        } else if (req.query.role === 'admin') {
            notification = await prisma.notification.create({
                data: {
                    type: req.body.type,
                    activity: req.body.activity,
                    adminId: req.body.adminId
                }
            })
        }

        if (!notification) {
            return res.status(500).json({ message: 'Erro ao criar notificação.' })
        }

        res.status(200).json({ message: 'Notificação criada com sucesso!', notification })

    } catch (error) {
        res.status(500).json({ message: 'Falha no servidor, tente novamente.', error })
    }
}

export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany()

        if (!notifications) {
            return res.status(404).json({ message: 'Nenhuma notificação encontrada' })
        }

        res.status(200).json({ message: 'Notificações encontradas!', notifications })
    } catch (error) {
        res.status(500).json({ message: 'Falha no servidor, tente novamente', error })
    }
}

export const getNotificationsByUserID = async (req, res) => {
    const role = req.query.role

    console.log('ROLE: ', role);

    try {
        let notifications

        if (role === 'client') {
            notifications = await prisma.notification.findMany({
                where: { clientId: req.userId}
            }) 
        } else if (role === 'restaurant') {
            notifications = await prisma.notification.findMany({
                where: { restaurantId: req.userId }
            })
        } else if (role === 'admin') {
            notifications = await prisma.notification.findMany({
                where: { adminId: req.userId }
            })
        } else {
            return res.status(400).json({ error: "Tipo de usuário inválido." });
        }

        return res.status(200).json(notifications);

    } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
}