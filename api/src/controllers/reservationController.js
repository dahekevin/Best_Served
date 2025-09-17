import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const registerReservation = async (req, res) => {
    try {
        console.log('Reservation Registration: ', req.body);

        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

        const reservationDateTime = new Date(`${req.body.date}T${req.body.startsAt}:00`);
        console.log('ReservationDateTime String: ', reservationDateTime);

        if (isNaN(reservationDateTime.getTime())) {
            return res.status(400).json({ message: 'Data ou hora inválida.' });
        }

        const isoString = reservationDateTime.toISOString();
        console.log('ISO String:', isoString);

        const formattedDay = capitalize(new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(reservationDateTime));
        const formattedMonth = capitalize(new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(reservationDateTime));

        const reservation = await prisma.reservations.create({
            data: {
                date: isoString,
                startsAt: req.body.startsAt,
                endsAt: req.body.endsAt,
                day: formattedDay,
                month: formattedMonth,
                guests: parseInt(req.body.guests),
                status: 'Pending',
                notes: req.body.notes,
                clientId: req.body.clientId,
                restaurantId: req.body.restaurantId,
                tableId: req.body.tableId
            }
        })

        if (!reservation) { return console.log('Erro ao tentar criar reserva.'); }

        console.log(reservation);

        res.status(201).json({ message: 'Reserva cadastrada com sucesso!', reservation })
    } catch (error) {
        console.error("🚨 Erro ao registrar reserva:", error);
        res.status(500).json({
            message: "Erro no servidor, tente novamente.",
            error: error.message // ou error.stack se quiser mais detalhes
        });
    }
}

export const getReservations = async (req, res) => {
    try {
        let reservations

        console.log('Reservas Backend', req.query);

        if (req.query.date) {
            const selectedDateString = req.query.date;

            const startOfDayUTC = new Date(`${selectedDateString}T00:00:00.000Z`);

            const endOfDayUTC = new Date(startOfDayUTC);
            endOfDayUTC.setDate(endOfDayUTC.getDate() + 1);

            console.log('Início da busca (UTC):', startOfDayUTC.toISOString());
            console.log('Fim da busca (UTC):', endOfDayUTC.toISOString());

            reservations = await prisma.reservations.findMany({
                where: {
                    date: {
                        // Busca reservas a partir da meia-noite do dia selecionado
                        gte: startOfDayUTC,
                        // Busca reservas até o final do dia selecionado
                        lte: endOfDayUTC
                    }
                },
                include: {
                    client: { select: { name: true } },
                    restaurant: { select: { name: true } },
                    tables: { select: { codeID: true } }
                }
            });

            console.log('Reservations encontradas:', reservations);

            if (!reservations || reservations.length === 0) {
                return res.status(200).json({ message: 'Nenhuma reserva encontrada para a data.', reservations: [] });
            }

            return res.status(200).json({ message: 'Lista de reservas:', reservations });
        }

        if (req.query.restaurantId) {
            reservations = await prisma.reservations.findMany({
                where: { restaurantId: req.query.restaurantId },
                include: {
                    client: {
                        select: { name: true }
                    },
                    restaurant: {
                        select: { name: true }
                    },
                    tables: { select: { codeID: true } }
                }
            })
            res.status(201).json({ message: 'Lista de reservas:', reservations })
        } else {
            reservations = await prisma.reservations.findMany({
                include: {
                    client: {
                        select: { name: true }
                    },
                    restaurant: {
                        select: { name: true }
                    },
                    tables: { select: { codeID: true } }
                }
            })
            res.status(201).json({ message: 'Lista de reservas:', reservations })
        }

    } catch (error) {
        console.log('Erro no servidor: ', error); 
        
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}

export const getTotalReservations = async (req, res) => {
    try {
        const total = await prisma.reservations.count()

        res.status(201).json({ message: 'Total de reservas', total })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}

export const updateReservation = async (req, res) => {
    console.log('Dados recebidos para atualização:', req.body);

    try {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

        const reservationDateTime = new Date(`${req.body.date}T${req.body.time}:00`);
        console.log('ReservationDateTime String: ', reservationDateTime);

        if (isNaN(reservationDateTime.getTime())) {
            return res.status(400).json({ message: 'Data ou hora inválida.' });
        }

        const isoString = reservationDateTime.toISOString();
        console.log('ISO String:', isoString);

        const formattedDay = capitalize(new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(reservationDateTime));
        const formattedMonth = capitalize(new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(reservationDateTime));

        const reservation = await prisma.reservations.update({
            where: { id: req.query.id },
            data: {
                date: isoString,
                time: req.body.time,
                day: formattedDay,
                month: formattedMonth,
                guests: parseInt(req.body.guests),
                status: req.body.status || 'Pending',
                notes: req.body.notes,
                clientId: req.body.clientId,
                restaurantId: req.body.restaurantId,
                tableId: req.body.tableId
            }
        })

        if (!reservation) { return console.log('Erro ao tentar criar reserva.'); }

        console.log(reservation);

        res.status(202).json({ message: 'Reserva atualizada com sucesso!' })

    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar informações, tente novamente.' })
    }
}

export const updateReservationStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        const userId = req.userId;

        if (!status) { return res.status(400).json({ message: 'Status não fornecido.' }) }
        
        console.log('UpdateReservationStatus: ', status);

        const reservation = await prisma.reservations.findUnique({
            where: { id: id },
            include: {
                restaurant: {
                    select: { name: true }
                }
            }
        })
        
        if (!reservation) { return res.status(404).json({ message: 'Reserva não encontrada!' }) }

        if (reservation.restaurantId !== userId) { return res.status(403).json({ message: 'Você não tem permissão para modificar essa reserva.' }) }

        const reservationStatus = await prisma.reservations.update({
            where: { id: id },
            data: { status: status }
        })

        await prisma.client.update({
            where: { id: reservation.clientId },
            data: {
                notification: {
                    create: {
                        type: 'warning',
                        title: 'Status de Reserva Atualizado',
                        message: `Sua reserva no restaurante ${reservation.restaurant.name}, foi atualizada para ${status}`
                    }
                }
            }
        })
        
        await prisma.admin.update({
            where: { id: process.env.ADMIN_ID },
            data: {
                notification: {
                    create: {
                        type: 'info',
                        title: 'Status de Reserva Atualizado',
                        message: `A reserva no restaurante ${reservation.restaurant.name}, foi atualizada para ${status}`
                    }
                }
            }
        })

        res.status(201).json({ message: 'Status de reserva atualizado com sucesso!', reservationStatus })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status, tente novamente.', error })
    }
}

export const deleteReservation = async (req, res) => {
    try {
        const reservation = await prisma.reservations.delete({
            where: { id: req.query.id }
        })

        if (!reservation) { return console.log('Reserva inexistente.'); }

        res.status(203).json({ message: 'Delete Rerservation: ', reservation });

    } catch (error) {
        res.status(500).json({ message: 'Erro ao tentar deletar reserva.', error });
    }
}

