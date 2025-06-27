import { PrismaClient } from '../../generated/prisma/client.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const loginController = async (req, res) => {
    try {
        console.log("Email recebido no backend:", req.body.email);
        console.log("Password recebida no backend:", req.body.password); 

        let user_db = await prisma.client.findUnique({
            where: { email: req.body.email }
        })
        
        console.log("User: ", user_db);
        if (!user_db) {
            user_db = await prisma.restaurant.findUnique({
                where: { email: req.body.email }
            })
        }
        
        if (!user_db) {
            return res.status(500).json({ message: "Usuário não encontrado" })
        }
        
        const isMatch = await bcrypt.compare(req.body.password, user_db.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Senha Inválida" })
        }

        console.log("Cliente encontrado: ", user_db);
        
        const token = jwt.sign({ id: user_db.id }, process.env.JWT_SECRET, { expiresIn: '1w' })


        return res.status(201).json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                name: user_db.name,
                email: user_db.email,
                type: user_db.type    // <-- ESSENCIAL
            }
        })

    } catch (error) {
        console.error("Erro no servidor durante o login:", error);
        res.status(500).json({ message: "Erro no servidor, tente novamente." });
    }
}