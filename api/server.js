import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/userRoutes.js'
import { config } from 'dotenv'

config()

const app = express()
app.use(cors())
const users = []

app.use(express.json())

app.use('/', userRoutes)

// app.post('/users', (req, res) => {
//     console.log(req);
//     users.push(req.body)
//     res.status(201).json(req.body)
// })

// app.get('/users', (req, res) => {
//     res.status(200).json(users)
// })

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`))
