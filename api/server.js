import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/userRoutes.js'
import path from 'path'
import { config } from 'dotenv'

config()

const app = express()

app.use(cors())

app.use(express.json())

// Isso expõe a pasta 'src/uploads' como pública
app.use('/uploads', express.static(path.join('src', 'uploads')))

// Routes
app.use('/sd-user', userRoutes)

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`))
