import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const registerReservation = async (req, res) => {
    try {
        console.log('Reservation Registration: ', req.body);

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

        const reservation = await prisma.reservations.create({
            data: {
                date: isoString,
                time: req.body.time,
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

