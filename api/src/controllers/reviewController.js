import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const registerReview = async (req, res) => {
    try {
        console.log('Review Registration: ', req.body);

        if (!req.body.rating) {
            return res.status(400).json({ message: 'Avaliação, cliente e restaurante são obrigatórios.' });
        }

        const newReview = await prisma.review.create({
            data: {
                clientName: req.body.clientName,
                rating: req.body.rating,
                comment: req.body.comment,
                tags: req.body.tags,
                client: { connect: { id: req.body.clientId || null } },
                restaurant: { connect: { id: req.body.restaurantId || null } },
            },
        });

        if (!newReview) { console.log('Erro na função create'); }

        console.log(newReview);        

        res.status(201).json({ message: "Avaliação registrada com sucesso!", review: newReview });
    } catch (error) {
        console.error("🚨 Erro ao registrar avaliação:", error);
        res.status(500).json({
            message: "Erro no servidor, tente novamente.",
            error: error.message // ou error.stack se quiser mais detalhes
        });
    }
}

export const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany();
        res.status(200).json({ message: "Lista de avaliações:", reviews });
    } catch (error) {
        console.error("🚨 Erro ao obter avaliações:", error);
        res.status(500).json({
            message: "Erro no servidor, tente novamente.",
            error: error.message
        });
    }
}

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientName, rating, comment, tags } = req.body;

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { clientName, rating, comment, tags }
        });

        res.status(200).json({ message: "Avaliação atualizada com sucesso!", review: updatedReview });
    } catch (error) {
        console.error("🚨 Erro ao atualizar avaliação:", error);
        res.status(500).json({
            message: "Erro no servidor, tente novamente.",
            error: error.message
        });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.review.delete({
            where: { id }
        });

        res.status(200).json({ message: "Avaliação deletada com sucesso!" });
    } catch (error) {
        console.error("🚨 Erro ao deletar avaliação:", error);
        res.status(500).json({
            message: "Erro no servidor, tente novamente.",
            error: error.message
        });
    }
}
