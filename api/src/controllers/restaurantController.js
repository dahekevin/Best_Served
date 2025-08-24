import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";
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

        const avatarFile = req.files?.['restaurant-avatar']?.[0]
        const menuFile = req.files?.['menu']?.[0]

        const rawData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cnpj: req.body.cnpj,
            fullAddress: req.body.fullAddress,
            opensAt: req.body.opensAt,
            closesAt: req.body.closesAt,
            phone: req.body.phone,
            mapsUrl: req.body.mapsUrl,
            description: req.body.description,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            avatar: avatarFile ? avatarFile.path : '',
            menu: menuFile ? menuFile.path : '',
        }

        const cleanedData = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )

        if (cleanedData.password) {
            const salt = await bcrypt.genSalt(10)
            cleanedData.password = await bcrypt.hash(req.body.password, salt)
        }

        const parsedTables = req.body.tables ? JSON.parse(req.body.tables) : [];

        const generatedTables = parsedTables.map((table, index) => {
            // `index` começa em 0, então adicione 1 para começar a contagem em 1
            const tableCode = index + 1;

            return {
                codeID: tableCode.toString(),
                seats: Number(table.seats || 0),
                status: 'Available'
            };
        });

        const restaurant = await prisma.restaurant.create({
            data: cleanedData
        })

        const updatedRestaurant = await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
                tables: {
                    create: generatedTables
                }
            },
            include: {
                tables: true
            }
        })

        if (!updatedRestaurant) {
            return res.status(500).json({ message: "Erro ao atualizar restaurante." })
        }

        res.status(201).json({ message: "Restaurante registrado com sucesso!", restaurant: updatedRestaurant })

    } catch (error) {
        console.error("Erro ao atualizar restaurante:", error);
        res.status(500).json({ message: "Erro no servidor, tente novamente.", error })
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
                    review: true,
                    reservations: true
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

export const getRestaurantByRating = async (req, res) => {

    try {
        const restaurants = await prisma.restaurant.findMany({
            orderBy: { rating: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                fullAddress: true,
                tags: true,
                rating: true,
                status: true,
                isActive: true,
                avatar: true,
                description: true,
                createdAt: true,
                _count: {
                    select: { reservations: true }
                }
            },
        })

        res.status(201).json({ message: 'Lista de restaurantes por rating', restaurants })

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
                review: true,
                reservations: {
                    include: {
                        client: {
                            select: {
                                name: true
                            }
                        },
                        tables: {
                            select: {
                                codeID: true
                            }
                        }
                    },
                }
            }
        })

        if (!restaurant) { res.status(404).json({ message: "Restaurante não encontrado" }) };

        res.status(201).json({ message: "Restaurante encontrado!", restaurant });

    } catch (error) {
        console.log('Erro no servidor: ', error);

        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const getTables = async (req, res) => {
    try {
        let tables

        console.log('GetTables: ', req.query);

        if (req.query.restaurantId) {
            tables = await prisma.tables.findMany({
                where: { restaurantId: req.query.restaurantId },
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

        const formattedTables = tables
            .filter(table => table.seats > 0)
            .map(table => {
                return {
                    id: table.id,
                    seats: table.seats,
                    status: table.status,
                    codeID: table.codeID,
                    restaurant: table.restaurant.name,
                    restaurantId: table.restaurant.id,
                    opensAt: table.restaurant.opensAt,
                    closesAt: table.restaurant.closesAt,
                    reservations: table.reservation.map((res, index) => ({
                        index,
                        reservationDate: res.date,
                        reservationStarts: res.startsAt,
                        reservationEnds: res.endsAt,
                        reservationStatus: res.status,
                        customerName: res.client?.name || null
                    }))
                };
            });

        console.log('FormattedTables: ', formattedTables);

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

        const avatarFile = req.files?.['restaurant-avatar']?.[0]
        const menuFile = req.files?.['menu']?.[0]

        const rawData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cnpj: req.body.cnpj,
            fullAddress: req.body.fullAddress,
            opensAt: req.body.opensAt,
            closesAt: req.body.closesAt,
            phone: req.body.phone,
            mapsUrl: req.body.mapsUrl,
            description: req.body.description,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            avatar: avatarFile ? avatarFile.path : '',
            menu: menuFile ? menuFile.path : '',
        }

        const cleanedData = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        )

        if (cleanedData.password) {
            const salt = await bcrypt.genSalt(10)
            cleanedData.password = await bcrypt.hash(req.body.password, salt)
        }

        // const parsedTables = req.body.tables ? JSON.parse(req.body.tables) : [];

        // const generatedTables = parsedTables.map((table, index) => {
        //     // `index` começa em 0, então adicione 1 para começar a contagem em 1
        //     const tableCode = index + 1;

        //     return {
        //         codeID: tableCode.toString(),
        //         seats: String(Number(table.seats || 0)),
        //         status: 'Available'
        //     };
        // });

        // await prisma.restaurant.update({
        //     where: { id: req.userId },
        //     data: {
        //         tables: {
        //             create: generatedTables
        //         }
        //     }
        // })

        const restaurantBeforeUpdate = await prisma.restaurant.findUnique({
            where: { id: req.userId },
            include: { tables: true }
        });

        if (!restaurantBeforeUpdate) {
            return res.status(404).json({ message: "Restaurante não encontrado." });
        }

        console.log('tables: ', req.body.tables);

        if (req.body.tables) {

            // 1. Processar as mesas (a lógica crucial)
            const parsedTables = req.body.tables ? JSON.parse(req.body.tables) : [];

            // Crie uma lista dos IDs das mesas atuais que vieram do formulário
            const newTableIds = new Set(parsedTables.map(table => table.id).filter(id => id));

            // 2. Identificar mesas a serem deletadas
            const tablesToDelete = restaurantBeforeUpdate.tables.filter(
                table => !newTableIds.has(table.id)
            );
            const tablesToDeleteIds = tablesToDelete.map(table => table.id);

            // 3. Identificar mesas a serem criadas
            const tablesToCreate = parsedTables.filter(
                table => !table.id // Mesas que não têm ID são novas
            );
            const newTablesData = tablesToCreate.map((table, index) => ({
                codeID: (restaurantBeforeUpdate.tables.length + index + 1).toString(), // Novo ID de mesa
                seats: Number(table.seats || 0),
                status: 'Available'
            }));

            // 4. Identificar mesas a serem atualizadas
            const tablesToUpdate = parsedTables.filter(table => newTableIds.has(table.id));

            // 5. Executar as operações no banco de dados

            // Se houver mesas para deletar, precisamos lidar com as reservas delas
            if (tablesToDeleteIds.length > 0) {
                // CANCELE ou lide com as reservas associadas a essas mesas
                await prisma.reservations.updateMany({
                    where: { tableId: { in: tablesToDeleteIds } },
                    data: { status: 'Cancelled' }
                });
                // Agora, delete as mesas
                await prisma.tables.deleteMany({
                    where: { id: { in: tablesToDeleteIds } }
                });
            }

            // Crie as novas mesas
            if (newTablesData.length > 0) {
                await prisma.tables.createMany({
                    data: newTablesData.map(table => ({
                        ...table,
                        restaurantId: req.userId // Associar ao restaurante
                    }))
                });
            }

            // Atualize as mesas existentes que foram modificadas
            for (const updatedTable of tablesToUpdate) {
                await prisma.tables.update({
                    where: { id: updatedTable.id },
                    data: {
                        seats: Number(updatedTable.seats || 0),
                    }
                });
            }
        }

        const restaurant = await prisma.restaurant.update({
            where: {
                id: req.userId
            },
            data: cleanedData
        })

        if (!restaurant) { return res.status(500).json({ message: "Erro ao atualizar restaurante." }) }

        res.status(201).json({ message: "Restaurante atualizado com sucesso!", restaurant })

    } catch (error) {
        console.error("Erro ao atualizar restaurante:", error);
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const updateRestaurantRating = async (req, res) => {
    try {
        const restaurantId = req.query.restaurantId;
        const { rating } = req.body; // Pega o novo rating do corpo da requisição

        // Valide se o rating é um número
        if (typeof rating !== 'number') {
            return res.status(400).json({ message: "O rating deve ser um número." });
        }

        // Atualize apenas o campo 'rating' no banco de dados
        const updatedRestaurant = await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { rating: rating }
        });

        if (!updatedRestaurant) {
            return res.status(404).json({ message: "Restaurante não encontrado para atualização." });
        }

        res.status(200).json({
            message: "Nota do restaurante atualizada com sucesso!",
            restaurant: updatedRestaurant
        });
    } catch (error) {
        console.error("Erro ao atualizar a nota do restaurante:", error);
        res.status(500).json({ message: "Erro no servidor, tente novamente." });
    }
};

export const updateRestaurantStatus = async (req, res) => {
    try {
        if (req.body.status) {
            const restaurant = await prisma.restaurant.update({
                where: { id: req.query.id },
                data: { status: req.body.status }
            })

            res.status(202).json({ message: "Status do restaurante atualizados com sucesso!", restaurant })
        }

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor, tente novamente." })
    }
}

export const updateRestaurantIsActiveStatus = async (req, res) => {
    try {
        console.log('IsActive: ', req);


        const restaurant = await prisma.restaurant.update({
            where: { id: req.userId },
            data: { isActive: req.body.isActive }
        })

        res.status(201).json({ success: true, restaurant })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar status.' })
    }
}

export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.delete({
            where: {
                id: req.query.id
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