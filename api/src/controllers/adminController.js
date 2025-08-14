import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const getAdmin = async (req, res) => {
    try {
        const admin = await prisma.admin.findFirst({
            where: { id: req.userId }
        })

        if (!admin) { return res.status(404).json({ message: 'Administrador não encontrado.' }) }

        res.status(200).json({ admin })

    } catch (error) {
        console.error('Erro ao buscar administrador:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
}

export const updateAdmin = async (req, res) => {
    try {
        const rawData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        }

        const cleanedData = Object.fromEntries(
            Object.entries(rawData).filter(([_, value]) => value !== undefined && value != null && value !== '')
        )

        if (cleanedData.password) {
            cleanedData.password = await bcrypt.hash(req.body.password, 10)
        }

        if (req.file && req.file.filename !== "apagar") {
            cleanedData.avatar = req.file.filename
        }

        // 1. Searches Current Admin
        const adminBeforeUpdate = await prisma.admin.findFirst({
            where: { id: req.userId }
        })

        if (!adminBeforeUpdate) {
            console.log('Administrador não encontrado.');
            
            return res.status(404).json({ message: 'Administrador não encontrado.' }) 
        }        

        // 2. Deletes the previous avatar if it exists and if it is different from the new one
        if ((adminBeforeUpdate.avatar && cleanedData.avatar && (adminBeforeUpdate.avatar != cleanedData.avatar)) || (cleanedData.avatar === "apagar")) {
            const filePath = path.resolve('src', 'uploads', adminBeforeUpdate.avatar);
            console.log('Tentando deletar arquivo em:', filePath);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Erro ao deletar avatar antigo: ', err.message);
                } else {
                    console.log('Avatar antigo deletado com sucesso!');
                }
            })
        }

        const admin = await prisma.admin.update({
            where: { id: req.userId },
            data: cleanedData
        })

        res.status(201).json({ message: 'Senha atualizado com sucesso!', admin })

    } catch (error) {
        console.error('Erro ao atualizar informações do administrador:', error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
}

export const adminLogin = async (req, res) => {
    try {
        const admin_db = await prisma.restaurant.findFirst({
            where: { email: req.body.email }
        })

        const isMatch = await bcrypt.compare(req.body.password, admin_db.password)

        if (!isMatch) { return res.status(400).json({ message: 'Senha invalida!' }) }

        const token = jwt.sign({
            id: admin_db.id,
            role: admin_db.type
        }, process.env.JWT_SECRET, { expiresIn: "1w" })

        const role = admin_db.type

        res.status(200).json({ message: 'Login realizado com sucesso!', token, role })
    } catch (error) {

    }
}