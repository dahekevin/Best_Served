import { PrismaClient } from '../../generated/prisma/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export const registerClient = async (req, res) => {

    const avatar = req.file ? req.file.filename : null;

    try {
        const existingClient = await prisma.client.findUnique({
            where: { email: req.body.email }
        })

        if (existingClient) {
            return res.status(400).json({ message: 'E-mail já cadastrado!' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        console.log("Dados do Cliente:", {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            avatar: avatar ?? undefined,
        });

        const client = await prisma.client.create({
            data: {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: hashPassword,
                avatar: avatar ?? undefined
            }
        })

        res.status(201).json({ message: 'Cadastro Realizado!!!', client })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }
}

export const getClients = async (req, res) => {

    try {
        let client = []

        if (req.query) {
            client = await prisma.client.findMany({
                where: {
                    email: req.query.email,
                    name: req.query.name
                }
            })

            res.status(200).json(client)

        } else {
            client = await prisma.client.findMany()
            res.status(200).json(client)
        }

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }
}

export const getClientById = async (req, res) => {

    console.log("Buscando Cliente com ID:", req.userId);

    try {
        const client = await prisma.client.findUnique({
            where: {
                id: req.userId
            },
            include: {
                review: true,
                reservations: {
                    include: {
                        restaurant: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        if (!client) return res.status(404).json({ message: "Cliente não encontrado" });

        console.log("Cliente: ", client);
        
        res.status(200).json(client);
    } catch (err) {
        console.error("Erro no servidor:", err);
        res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
}

export const getTotalClients = async (req, res) => {
    try {
        const total = await prisma.client.count()

        res.status(202).json({ message: 'Tota de clientes', total })
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
}

export const getClientType = async (req, res) => {
    try {
        
        if (!req.query.email) {
            return res.status(400).json({ message: "Email é obrigatório" })
        }
        
        const client = await prisma.client.findUnique({
            where: { email: req.query.email }
        })
        
        console.log('getClientType: ');
        if (!client) return res.status(404).json({ message: "Cliente não encontrado" });
        
        res.status(200).json(client.type);

    } catch (error) {
        console.error("Erro no servidor:", error);
        res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
}


export const updateClient = async (req, res) => {
    console.log("Dados recebidos para atualização:", req.body);

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const newAvatar = req.file ? req.file.filename : null;
        console.log("Imagem atualizada!", req.file);

        // 1. Searches Current Client
        const clientBeforeUpdate = await prisma.client.findUnique({
            where: { id: req.userId }
        })


        // 2. Deletes the previous avatar if it exists and if it is different from the new one
        if ((clientBeforeUpdate.avatar && newAvatar && (clientBeforeUpdate.avatar != newAvatar)) || (newAvatar === "apagar")) {
            const filePath = path.resolve('src', 'uploads', clientBeforeUpdate.avatar);
            console.log('Tentando deletar arquivo em:', filePath);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Erro ao deletar avatar antigo: ', err.message);
                } else {
                    console.log('Avatar antigo deletado com sucesso!');
                }
            })
        }

        const client = await prisma.client.update({
            where: {
                id: req.userId // Assuming you have middleware that sets req.userId
            },
            data: {
                email: req.body.email,
                phone: req.body.phone || null, // Allow phone to be optional
                name: req.body.name,
                password: hashPassword,
                avatar: newAvatar ?? undefined, // se for opcional
            }
        })

        res.status(202).json({ message: "Clientes atualizado com sucesso!!!", client })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }
}

export const updateClientHistory = async (req, res) => {
    try {
        console.log('UpdateClientehistory: ', req.body.restaurantId);
        const clientId = req.userId; 
        const newRestaurantId = req.body.restaurantId;         

        if (!clientId || !newRestaurantId) {
            return res.status(400).json({ message: 'ID do cliente ou ID do restaurante ausente.' });
        }

        const client = await prisma.client.findUnique({
            where: { id: clientId },
            select: { restaurantHistory: true }
        });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        const currentHistory = Array.isArray(client.restaurantHistory) ? client.restaurantHistory : [];

        if (currentHistory.includes(newRestaurantId)) {
            console.log(`Restaurante ${newRestaurantId} já está no histórico do cliente ${clientId}.`);
            return res.status(200).json({ message: 'Restaurante já no histórico.', client });
        }

        const updatedHistory = [...currentHistory, newRestaurantId];

        const updatedClient = await prisma.client.update({
            where: { id: clientId },
            data: { restaurantHistory: updatedHistory }
        });

        res.status(200).json({ message: 'Histórico de restaurante atualizado!', client: updatedClient });

    } catch (error) {
        console.error("🚨 Erro ao atualizar histórico do cliente:", error);
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' });
    }
}

export const deleteClient = async (req, res) => {

    try {
        const client = await prisma.client.delete({
            where: {
                id: req.userId
            }
        })

        res.status(203).json({ message: 'Cliente deletado!', client })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }
}

export const clientLogin = async (req, res) => {

    try {
        const client_db = await prisma.client.findUnique({ where: { email: req.body.email } })

        const isMatch = await bcrypt.compare(req.body.password, client_db.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Senha Inválida' })
        }

        console.log("Cliente encontrado:", client_db.id);

        const token = jwt.sign({ id: client_db.id }, process.env.JWT_SECRET, { expiresIn: '1w' })

        return res.status(201).json({
            message: 'Login realizado com sucesso!',
            token,
            client: {
                name: client_db.name,
                email: client_db.email,
                type: client_db.type  // <-- ESSENCIAL
            }
        });

    } catch (error) {
        res.status(400).json({ message: 'Cliente não existe' })
    }
}