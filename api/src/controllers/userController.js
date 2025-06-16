import { PrismaClient } from '../../generated/prisma/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export const registerUser = async (req, res) => {

    const avatar = req.file ? req.file.filename : null;

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        console.log("Dados do usuário:", {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            avatar: avatar ?? undefined,
        });

        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: hashPassword,
                avatar: avatar ?? undefined
            }
        })

        res.status(201).json({ message: 'Cadastro Realizado!!!', user })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }

}

export const getUsers = async (req, res) => {

    try {
        let user = []

        if (req.query) {
            user = await prisma.user.findMany({
                where: {
                    email: req.query.email,
                    name: req.query.name
                }
            })

            res.status(200).json(user)

        } else {
            user = await prisma.user.findMany()
            res.status(200).json(user)
        }

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }


}

export const getUserById = async (req, res) => {

    console.log("Buscando usuário com ID:", req.userId);

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true
            }
        });

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        res.json(user);
    } catch (err) {
        console.error("Erro no servidor:", err);
        res.status(500).json({ message: "Erro no servidor, tente novamente" });
    }
};


export const updateUser = async (req, res) => {
    console.log("Dados recebidos para atualização:", req.body);

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        const newAvatar = req.file ? req.file.filename : null;
        console.log("Imagem atualizada!", req.file);

        // 1. Buscar usuário atual
        const userBeforeUpdate = await prisma.user.findUnique({
            where: { id: req.userId }
        })


        // 2. Deletar avatar antigo se existir e for diferente do novo
        if ((userBeforeUpdate.avatar && newAvatar && (userBeforeUpdate.avatar != newAvatar)) || (newAvatar === "apagar")) {
            const filePath = path.resolve('src', 'uploads', userBeforeUpdate.avatar);
            console.log('Tentando deletar arquivo em:', filePath);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log('Erro ao deletar avatar antigo: ', err.message);
                } else {
                    console.log('Avatar antigo deletado com sucesso!');
                }
            })
        }

        const user = await prisma.user.update({
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

        res.status(202).json({ message: "Usuários atualizado com sucesso!!!", user })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }

}

export const deleteUser = async (req, res) => {

    try {
        const user = await prisma.user.delete({
            where: {
                id: req.userId
            }
        })

        res.status(203).json({ message: 'Usuário deletado!', user })

    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor, tente novamente' })
    }
}

export const userLogin = async (req, res) => {

    try {
        const user_db = await prisma.user.findUnique({ where: { email: req.body.email } })

        const isMatch = await bcrypt.compare(req.body.password, user_db.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Senha Inválida' })
        }

        console.log("Usuário encontrado:", user_db.id);

        const token = jwt.sign({ id: user_db.id }, process.env.JWT_SECRET, { expiresIn: '1w' })

        return res.status(201).json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                name: user_db.name,
                email: user_db.email,
                type: user_db.type  // <-- ESSENCIAL
            }
        });

    } catch (error) {
        res.status(400).json({ message: 'Usuário não existe' })
    }
}