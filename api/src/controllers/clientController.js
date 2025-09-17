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
                avatar: avatar ?? undefined,
                notification: {
                    create: {
                        type: "welcome",
                        title: "Boas Vindas",
                        message: "Seja bem vindo a Best Served o melhor sistema de reservas que você verá. Faça sua primeira reserva já.",
                    }
                }
            }
        })

        res.status(201).json({ message: 'Cadastro Realizado!!!', client })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente', error })
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

export const updateClient = async (req, res) => {
    console.log("Dados recebidos para atualização:", req.body);

    try {

        const rawData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        }

        const cleanedData = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )

        if (cleanedData.password) {
            const salt = await bcrypt.genSalt(10)
            cleanedData.password = await bcrypt.hash(cleanedData.password, salt)
        }

        if (req.file && req.file.filename !== "apagar") {
            cleanedData.avatar = req.file.filename
        }

        // 1. Searches Current Client
        const clientBeforeUpdate = await prisma.client.findUnique({
            where: { id: req.userId }
        })


        // 2. Deletes the previous avatar if it exists and if it is different from the new one
        if ((clientBeforeUpdate.avatar && cleanedData.avatar && (clientBeforeUpdate.avatar != cleanedData.avatar)) || (cleanedData.avatar === "apagar")) {
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
                id: req.userId
            },
            data: cleanedData,
            notification: {
                create: {
                    type: "warning",
                    title: "Atualização de Dados Pessoais",
                    message: "Atenção! Os dados da sua conta foram atualizados, caso tenha sido você ignore essa mensagem."
                }
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
        res.status(500).json({ message: 'Erro no servidor, tente novamente', error })
    }
}