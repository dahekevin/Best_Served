import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";
import { table } from "console";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerRestaurant = async (req, res) => {

    try {
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: { email: req.body.email }
        })

        if (existingRestaurant) {
            return res.status(400).json({ message: "E-mail já cadastrado!" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)


        const avatarFile = req.files?.['restaurant-avatar']?.[0]
        const menuFile = req.files?.['tables']?.[0]

        console.log('Dados do restaurante:', req.body);
        console.log("FILES: ", req.files);

        console.log('BODY:', req.body);
        console.log('AVATAR FILE:', avatarFile);
        console.log('MENU FILE:', menuFile);

        const numberOfTables = parseInt(req.body.tables) || 0

        const generatedTables = Array.from({ length: numberOfTables }, () => ({
            capacity: req.body.capacity || '0',
            status: 'Available'
        }))

        const restaurant = await prisma.restaurant.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                cnpj: req.body.cnpj,
                fullAddress: req.body.fullAddress,
                phone: req.body.phone,
                opensAt: req.body.opensAt,
                closesAt: req.body.closesAt,
                mapsUrl: req.body.mapsUrl || '',
                description: req.body.description || '',
                avatar: avatarFile ? avatarFile.path : '',
                menu: menuFile ? menuFile.path : '',
                tables: {
                    create: generatedTables
                }
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

        console.log(req.query.id);


        if (req.query.id || req.query.email || req.query.name) {
            restaurants = await prisma.restaurant.findMany({
                where: {
                    id: req.query.id,
                    email: req.query.email,
                    name: req.query.name
                },
                include: { 
                    tables: true,
                    review: true
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
            },
            include: { 
                tables: true,
                review: true
            }
        })

        if (!restaurant) { res.status(404).json({ message: "Restaurante não encontrado" }) };

        res.status(201).json({ message: "Restaurante encontrado!", restaurant });

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const getTables = async (req, res) => {
    try {
        let tables

        console.log('GetTables: ', req.body);

        if (req.query.email) {
            tables = await prisma.tables.findMany({
                where: { email: req.query.email },
                include: {
                    restaurant: true,
                    reservation: {
                        include: { client: true }
                    }
                }
            })
        } else {
            tables = await prisma.tables.findMany({
                include: {
                    restaurant: true,
                    reservation: {
                        include: { client: true }
                    }
                }
            })
        }

        if (!tables) { return res.status(404).json({ message: 'Nenhuma mesa encontrada.' }) }
        
        const formattedTables = tables.map(table => {            
            return {
                id: table.id,
                seats: table.seats,
                status: table.status,
                restaurant: table.restaurant.name,
                restaurantId: table.restaurant.id,
                reservations: table.reservation.map((res, index) => ({
                    index,
                    reservationDate: res.date,
                    reservationTime: res.time,
                    customerName: res.client?.name || null
                }))
            };
        });

        // console.log('FormattedTables: ', formattedTables);        

        res.status(201).json({ message: 'Mesas econtradas com sucesso!', formattedTables })
    } catch (error) {
        console.error('Erro ao buscar mesas:', error)
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}

export const getRestaurantType = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { email: req.body.email }
        })

        if (!restaurant) { res.status(404).json({ message: "Restaurante não encontrado" }) };

        res.status(200).json(restaurant.type)

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const updateRestaurant = async (req, res) => {
    console.log("Dados recebidos para atualização:", req.body);

    try {

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)


        const avatarFile = req.files?.['restaurant-avatar']?.[0]
        const menuFile = req.files?.['tables']?.[0]

        console.log('Dados do restaurante:', req.body);
        console.log("FILES: ", req.files);

        console.log('BODY:', req.body);
        console.log('AVATAR FILE:', avatarFile);
        console.log('MENU FILE:', menuFile);

        const numberOfTables = parseInt(req.body.tables)

        const generatedTables = Array.from({ length: numberOfTables }, () => ({
            capacity: req.body.capacity || '0',
            status: req.body.status
        }))

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
                opensAt: req.body.opensAt,
                closesAt: req.body.closesAt,
                phone: req.body.phone,
                mapsUrl: req.body.mapsUrl || '',
                description: req.body.description || '',
                avatar: avatarFile ? avatarFile.path : '',
                tables: menuFile ? menuFile.path : '',
                tables: {
                    create: generatedTables
                }
            }
        })

        if (!restaurant) { return res.status(500).json({ message: "Erro ao atualizar restaurante." }) }

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