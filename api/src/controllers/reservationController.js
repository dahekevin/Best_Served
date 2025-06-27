import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const registerReservation = async (req, res) => {
    try {
        console.log('Reservation Registration: ', req.body);

        const isoString = new Date(`${req.body.date}T${req.body.time}:00.000Z`).toISOString();

        const reservation = await prisma.reservations.create({
            data: {
                date: isoString,
                time: req.body.time,
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

        console.log('Reservas Backend', req.query.restaurantId);

        if (req.query.restaurantId) {
            reservations = await prisma.reservations.findMany({
                where: { restaurantId: req.query.restaurantId }
            })
            res.status(201).json({ message: 'Lista de reservas:', reservations })
        } else {
            reservations = await prisma.reservations.findMany()
            res.status(201).json({ message: 'Lista de reservas:', reservations })
        }

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente.' })
    }
}

export const deleteReservation = async (req, res) => {
    try {
        const reservation = await prisma.reservations.delete({
            where: { id: req.body.id }
        })

        if (!reservation) { return console.log('Reserva inexistente.'); }

        console.log('Delete Rerservation: ', reservation);

    } catch (error) {
        console.error('Erro ao tentar deletar reserva.', error);
    }
}

