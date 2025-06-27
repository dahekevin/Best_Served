import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {

    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' })
    }    

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET)
        req.userId = decoded.id
        console.log("Token verificado, ID do usuário:", req.userId);
        
        next()
    } catch (error) {
        res.status(400).json({ message: 'Token Inválido' })
    }
}