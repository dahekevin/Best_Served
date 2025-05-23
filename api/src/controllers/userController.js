import { PrismaClient } from '../../generated/prisma/client.js'
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const registerUser = async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: hashPassword
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

export const getUser = async (req, res) => {
    
}

export const updateUser = async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                email: req.body.email,
                name: req.body.name,
                password: hashPassword
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
                id: req.params.id
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

        const token = jwt.sign({ id: req.params.id }, process.env.JWT_SECRET, { expiresIn: '1m' })

        res.status(200).json({ message: 'Login realizado com sucesso!', token })

    } catch (error) {
        res.status(400).json({ message: 'Usuário não existe' })
    }
}