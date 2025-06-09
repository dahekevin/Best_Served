import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerRestaurant = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        console.log('Dados do restaurante:', req.body);

        const restaurant = await prisma.restaurant.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                cnpj: req.body.cnpj,
                fullAddress: req.body.fullAddress,
                phone: req.body.phone,
                mapsUrl: req.body.mapsUrl,
                description: req.body.description
            }
        })

        res.status(201).json({ message: "Restaurante Cadastrado com sucesso!", restaurant })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const getRestaurants = async (req, res) => {

    try {
        let restaurants = []

        if (req.query) {
            restaurants = await prisma.restaurant.findMany({
                where: {
                    email: req.query.email,
                    name: req.query.name
                }
            })
            res.status(201).json({ message: 'Lista de restaurantes: ', restaurants })
        } else {
            restaurants = await prisma.restaurant.findMany()
            res.status(201).json({ message: 'Lista de restaurantes: ', restaurants })
        }

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: {
                id: req.userId
            }
        })

        if (!restaurant) { res.status(404).json({ message: "Restaurante não encontrado" }) };

        res.status(201).json({ message: "Restaurante encontrado!", restaurant });

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const updateRestaurant = async (req, res) => {
    try {
        const salt = bcrypt.genSalt(10)
        const hashPassword = bcrypt.hash(req.body.password, salt)

        const restaurant = await prisma.restaurant.update({
            where: {
                id: req.userId
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                cnpj: req.body.cnpj,
                fullAddress: req.body.fullAddress,
                phone: req.body.phone,
                mapsUrl: req.body.mapsUrl,
                description: req.body.description
            }
        })

        res.status(201).json({ message: "Restaurante atualizado com sucesso!", restaurant })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.delete({
            where: {
                id: req.userId
            }
        })

        res.status(200).json({ message: "Restaurante Deletado!", restaurant })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const restaurantLogin = async (req, res) => {
    try {
        const restaurant_db = await prisma.restaurant.findUnique({ where: { email: req.body.email } })
        const isMatch = await bcrypt.compare(req.body.password, restaurant_db.password)

        if (!isMatch) { return res.status(400).json({ message: "Senha invalida!" }) }

        console.log("Restaurante encontrado: ", restaurant_db);
        
        const token = jwt.sign({ id: restaurant_db.id }, process.env.JWT_SECRET, { expiresIn: "1w" })

        res.status(200).json({ message: "Login realizado com sucesso!, Token:", token })

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}